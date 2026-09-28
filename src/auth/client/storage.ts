import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const AUTH_STORAGE_KEYS = {
  accessToken: "cbsdemo.auth.access-token",
  refreshToken: "cbsdemo.auth.refresh-token",
} as const;

export const ACCESS_TOKEN_STORAGE_KEY = AUTH_STORAGE_KEYS.accessToken;
export const REFRESH_TOKEN_STORAGE_KEY = AUTH_STORAGE_KEYS.refreshToken;
export const AUTH_ACCESS_TOKEN_KEY = ACCESS_TOKEN_STORAGE_KEY;
export const AUTH_REFRESH_TOKEN_KEY = REFRESH_TOKEN_STORAGE_KEY;

export interface AuthStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}

export type AuthStorageAdapter = AuthStorage;

export interface BrowserStorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface SecureStoreLike {
  getItemAsync(key: string): Promise<string | null>;
  setItemAsync(key: string, value: string): Promise<void>;
  deleteItemAsync(key: string): Promise<void>;
  isAvailableAsync?: () => Promise<boolean>;
}

export interface AuthStorageOptions {
  platform?: "web" | "native";
  browserStorage?: BrowserStorageLike;
  secureStore?: SecureStoreLike;
}

export type AuthStorageErrorCode = "UNAVAILABLE" | "FAILED";

export class AuthStorageError extends Error {
  readonly code: AuthStorageErrorCode;
  readonly operation: "get" | "set" | "delete";
  readonly cause?: unknown;

  constructor(
    code: AuthStorageErrorCode,
    operation: "get" | "set" | "delete",
    message: string,
    cause?: unknown,
  ) {
    super(message);
    this.name = "AuthStorageError";
    this.code = code;
    this.operation = operation;
    this.cause = cause;
  }
}

function asError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

function getBrowserStorage(): BrowserStorageLike | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

function getStorage(
  provided: BrowserStorageLike | undefined,
): BrowserStorageLike | undefined {
  return provided ?? getBrowserStorage();
}

function unavailable(
  operation: "get" | "set" | "delete",
  target: string,
): AuthStorageError {
  return new AuthStorageError(
    "UNAVAILABLE",
    operation,
    `${target} storage is unavailable`,
  );
}

function failed(
  operation: "get" | "set" | "delete",
  target: string,
  cause: unknown,
): AuthStorageError {
  return new AuthStorageError(
    "FAILED",
    operation,
    `Unable to ${operation} authentication data in ${target} storage`,
    cause,
  );
}

export function createAuthStorage(options: AuthStorageOptions = {}): AuthStorage {
  const platform = options.platform ?? (Platform.OS === "web" ? "web" : "native");
  const secureStore = options.secureStore ?? SecureStore;

  if (platform === "web") {
    return {
      async get(key) {
        const storage = getStorage(options.browserStorage);
        if (!storage) {
          throw unavailable("get", "browser");
        }
        try {
          return storage.getItem(key);
        } catch (error) {
          throw failed("get", "browser", error);
        }
      },
      async set(key, value) {
        const storage = getStorage(options.browserStorage);
        if (!storage) {
          throw unavailable("set", "browser");
        }
        try {
          storage.setItem(key, value);
        } catch (error) {
          throw failed("set", "browser", error);
        }
      },
      async delete(key) {
        const storage = getStorage(options.browserStorage);
        if (!storage) {
          throw unavailable("delete", "browser");
        }
        try {
          storage.removeItem(key);
        } catch (error) {
          throw failed("delete", "browser", error);
        }
      },
    };
  }

  return {
    async get(key) {
      try {
        if (
          secureStore.isAvailableAsync &&
          !(await secureStore.isAvailableAsync())
        ) {
          throw unavailable("get", "secure");
        }
        return await secureStore.getItemAsync(key);
      } catch (error) {
        if (error instanceof AuthStorageError) {
          throw error;
        }
        throw failed("get", "secure", error);
      }
    },
    async set(key, value) {
      try {
        if (
          secureStore.isAvailableAsync &&
          !(await secureStore.isAvailableAsync())
        ) {
          throw unavailable("set", "secure");
        }
        await secureStore.setItemAsync(key, value);
      } catch (error) {
        if (error instanceof AuthStorageError) {
          throw error;
        }
        throw failed("set", "secure", error);
      }
    },
    async delete(key) {
      try {
        if (
          secureStore.isAvailableAsync &&
          !(await secureStore.isAvailableAsync())
        ) {
          throw unavailable("delete", "secure");
        }
        await secureStore.deleteItemAsync(key);
      } catch (error) {
        if (error instanceof AuthStorageError) {
          throw error;
        }
        throw failed("delete", "secure", error);
      }
    },
  };
}

export async function readStoredAuthTokens(
  storage: AuthStorage,
): Promise<{ accessToken: string | null; refreshToken: string | null }> {
  const [accessToken, refreshToken] = await Promise.all([
    storage.get(ACCESS_TOKEN_STORAGE_KEY),
    storage.get(REFRESH_TOKEN_STORAGE_KEY),
  ]);
  return { accessToken, refreshToken };
}

export async function writeStoredAuthTokens(
  storage: AuthStorage,
  tokens: { accessToken: string; refreshToken: string },
): Promise<void> {
  try {
    await storage.set(ACCESS_TOKEN_STORAGE_KEY, tokens.accessToken);
    await storage.set(REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken);
  } catch (error) {
    await clearStoredAuthTokens(storage);
    throw asError(error);
  }
}

export async function clearStoredAuthTokens(storage: AuthStorage): Promise<void> {
  await Promise.allSettled([
    storage.delete(ACCESS_TOKEN_STORAGE_KEY),
    storage.delete(REFRESH_TOKEN_STORAGE_KEY),
  ]);
}

export const createAuthStorageAdapter = createAuthStorage;
