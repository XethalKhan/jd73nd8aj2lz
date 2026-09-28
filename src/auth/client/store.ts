import { create, type StoreApi, type UseBoundStore } from "zustand";

import type { Credentials, TokenResponse } from "../server/types";
import {
  createAuthApiClient,
  type AuthApiClient,
  type AuthApiClientOptions,
} from "./api";
import {
  createAuthStorage,
  type AuthStorage,
  clearStoredAuthTokens,
  readStoredAuthTokens,
} from "./storage";

export type AuthStatus =
  | "bootstrapping"
  | "authenticated"
  | "unauthenticated";

export interface AuthStore {
  status: AuthStatus;
  isBootstrapping: boolean;
  isAuthenticated: boolean;
  session: TokenResponse | null;
  bootstrap(): Promise<void>;
  login(credentials: Credentials): Promise<TokenResponse>;
  refresh(): Promise<TokenResponse>;
  logout(): Promise<void>;
  clearSession(): Promise<void>;
}

export interface AuthStoreOptions {
  storage?: AuthStorage;
  apiClient?: AuthApiClient;
  apiClientOptions?: Omit<AuthApiClientOptions, "storage" | "onSessionChanged" | "onSessionCleared">;
}

export type AuthStoreHook = UseBoundStore<StoreApi<AuthStore>>;

export function createAuthStore(options: AuthStoreOptions = {}): AuthStoreHook {
  const storage = options.storage ?? createAuthStorage();
  let setState: (partial: Partial<AuthStore>) => void = () => undefined;
  let clearPromise: Promise<void> | undefined;

  const clearSession = async (): Promise<void> => {
    if (!clearPromise) {
      clearPromise = clearStoredAuthTokens(storage)
        .finally(() => {
          clearPromise = undefined;
        });
    }
    await clearPromise;
    setState({
      session: null,
      status: "unauthenticated",
      isBootstrapping: false,
      isAuthenticated: false,
    });
  };

  const apiClient =
    options.apiClient ??
    createAuthApiClient({
      ...options.apiClientOptions,
      storage,
      onSessionChanged: (session) => {
        setState({
          session,
          status: "authenticated",
          isBootstrapping: false,
          isAuthenticated: true,
        });
      },
      onSessionCleared: clearSession,
    });

  const store = create<AuthStore>((set) => {
    setState = set;
    return {
      status: "bootstrapping",
      isBootstrapping: true,
      isAuthenticated: false,
      session: null,
      async bootstrap() {
        try {
          const tokens = await readStoredAuthTokens(storage);
          if (tokens.accessToken && tokens.refreshToken) {
            set({
              session: {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                tokenType: "Bearer",
                accessTokenExpiresAt: 0,
                refreshTokenExpiresAt: 0,
                accessTokenExpiresIn: 0,
                refreshTokenExpiresIn: 0,
                expiresIn: 0,
                refreshExpiresIn: 0,
              },
              status: "authenticated",
              isBootstrapping: false,
              isAuthenticated: true,
            });
          } else {
            await clearSession();
          }
        } catch {
          await clearSession();
        }
      },
      async login(credentials) {
        try {
          const session = await apiClient.login(credentials);
          set({
            session,
            status: "authenticated",
            isBootstrapping: false,
            isAuthenticated: true,
          });
          return session;
        } catch (error) {
          await clearSession();
          throw error;
        }
      },
      async refresh() {
        try {
          const session = await apiClient.refresh();
          set({
            session,
            status: "authenticated",
            isBootstrapping: false,
            isAuthenticated: true,
          });
          return session;
        } catch (error) {
          await clearSession();
          throw error;
        }
      },
      async logout() {
        try {
          await apiClient.logout();
        } finally {
          await clearSession();
        }
      },
      clearSession,
    };
  });

  return store;
}

export const useAuthStore = createAuthStore();
