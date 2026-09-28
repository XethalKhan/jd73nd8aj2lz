import type { TokenResponse } from "../server/types";
import { createAuthStore } from "./store";
import type { AuthApiClient } from "./api";
import type { AuthStorage } from "./storage";

const session: TokenResponse = {
  tokenType: "Bearer",
  accessToken: "access",
  refreshToken: "refresh",
  accessTokenExpiresAt: 1000,
  refreshTokenExpiresAt: 2000,
  accessTokenExpiresIn: 60,
  refreshTokenExpiresIn: 120,
  expiresIn: 60,
  refreshExpiresIn: 120,
};

function makeStorage(initial: Record<string, string> = {}): AuthStorage {
  const values = new Map(Object.entries(initial));
  return {
    get: async (key) => values.get(key) ?? null,
    set: async (key, value) => void values.set(key, value),
    delete: async (key) => void values.delete(key),
  };
}

function makeApi(overrides: Partial<AuthApiClient> = {}): AuthApiClient {
  return {
    apiUrl: "https://api.example.test",
    login: jest.fn(async () => session),
    refresh: jest.fn(async () => session),
    logout: jest.fn(async () => ({ loggedOut: true as const })),
    request: jest.fn(),
    authenticatedRequest: jest.fn(),
    ...overrides,
  };
}

describe("auth store", () => {
  it("hydrates a stored session and transitions on login/logout", async () => {
    const store = createAuthStore({
      storage: makeStorage({
        "cbsdemo.auth.access-token": "stored-access",
        "cbsdemo.auth.refresh-token": "stored-refresh",
      }),
      apiClient: makeApi(),
    });
    await store.getState().bootstrap();
    expect(store.getState()).toMatchObject({
      status: "authenticated",
      isAuthenticated: true,
    });

    await store.getState().logout();
    expect(store.getState()).toMatchObject({
      status: "unauthenticated",
      isAuthenticated: false,
      session: null,
    });
  });

  it("clears stored tokens when refresh fails", async () => {
    const storage = makeStorage({
      "cbsdemo.auth.access-token": "access",
      "cbsdemo.auth.refresh-token": "refresh",
    });
    const store = createAuthStore({
      storage,
      apiClient: makeApi({
        refresh: jest.fn(async () => {
          throw new Error("refresh failed");
        }),
      }),
    });
    await store.getState().bootstrap();
    await expect(store.getState().refresh()).rejects.toThrow("refresh failed");
    expect(store.getState().isAuthenticated).toBe(false);
    await expect(storage.get("cbsdemo.auth.access-token")).resolves.toBeNull();
    await expect(storage.get("cbsdemo.auth.refresh-token")).resolves.toBeNull();
  });
});
