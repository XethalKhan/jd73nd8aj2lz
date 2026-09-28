import type { TokenResponse } from "../server/types";
import {
  AuthApiError,
  createAuthApiClient,
  validateApiUrl,
} from "./api";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  type AuthStorage,
  REFRESH_TOKEN_STORAGE_KEY,
} from "./storage";

const session: TokenResponse = {
  tokenType: "Bearer",
  accessToken: "new-access",
  refreshToken: "new-refresh",
  accessTokenExpiresAt: 1000,
  refreshTokenExpiresAt: 2000,
  accessTokenExpiresIn: 60,
  refreshTokenExpiresIn: 120,
  expiresIn: 60,
  refreshExpiresIn: 120,
};

function makeStorage(
  initial: Record<string, string> = {},
): AuthStorage & { values: Map<string, string> } {
  const values = new Map(Object.entries(initial));
  return {
    values,
    get: async (key) => values.get(key) ?? null,
    set: async (key, value) => void values.set(key, value),
    delete: async (key) => void values.delete(key),
  };
}

function response(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(body),
  } as Response;
}

describe("auth API client", () => {
  it("validates an absolute API URL and sends login payloads", async () => {
    expect(() => validateApiUrl("/api", "native")).toThrow(AuthApiError);
    const storage = makeStorage();
    const fetcher = jest.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      expect(url).toBe("https://api.example.test/api/auth/login");
      expect(init?.method).toBe("POST");
      expect(init?.headers).toBeInstanceOf(Headers);
      expect((init?.headers as Headers).get("Content-Type")).toBe(
        "application/json",
      );
      return response({ ok: true, data: session });
    });
    const client = createAuthApiClient({
      apiUrl: "https://api.example.test/",
      fetch: fetcher,
      storage,
    });

    await expect(
      client.login({ username: "demo@example.com", password: "demo-password" }),
    ).resolves.toEqual(session);
    expect(storage.values.get(ACCESS_TOKEN_STORAGE_KEY)).toBe("new-access");
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("normalizes API errors and shares one refresh for concurrent requests", async () => {
    const storage = makeStorage({
      [ACCESS_TOKEN_STORAGE_KEY]: "old-access",
      [REFRESH_TOKEN_STORAGE_KEY]: "old-refresh",
    });
    const fetcher = jest.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.endsWith("/api/auth/refresh")) {
        expect(JSON.parse(String(init?.body))).toEqual({
          refreshToken: "old-refresh",
        });
        return response({ ok: true, data: session });
      }
      if (init?.headers && (init.headers as Headers).get("Authorization") === "Bearer old-access") {
        return response({ error: { code: "UNAUTHORIZED", message: "expired" } }, 401);
      }
      expect((init?.headers as Headers).get("Authorization")).toBe(
        "Bearer new-access",
      );
      return response({ ok: true, data: { value: "ok" } });
    });
    const client = createAuthApiClient({
      apiUrl: "https://api.example.test",
      fetch: fetcher,
      storage,
    });

    await expect(
      Promise.all([
        client.authenticatedRequest<{ value: string }>("/api/protected"),
        client.authenticatedRequest<{ value: string }>("/api/protected"),
      ]),
    ).resolves.toEqual([{ value: "ok" }, { value: "ok" }]);
    expect(
      fetcher.mock.calls.filter(([url]) =>
        String(url).endsWith("/api/auth/refresh"),
      ),
    ).toHaveLength(1);

    const failedClient = createAuthApiClient({
      apiUrl: "https://api.example.test",
      fetch: jest.fn(async () =>
        response({ error: { code: "INVALID_CREDENTIALS", message: "no" } }, 401),
      ),
      storage,
    });
    await expect(
      failedClient.login({ username: "bad", password: "bad" }),
    ).rejects.toMatchObject({ code: "INVALID_CREDENTIALS", status: 401 });
  });

  it("clears the session when refresh cannot authorize a request", async () => {
    const storage = makeStorage({
      [ACCESS_TOKEN_STORAGE_KEY]: "expired",
      [REFRESH_TOKEN_STORAGE_KEY]: "refresh",
    });
    const fetcher = jest.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith("/api/auth/refresh")) {
        return response({ error: { code: "INVALID_REFRESH_TOKEN", message: "expired" } }, 401);
      }
      return response({ error: { code: "UNAUTHORIZED", message: "expired" } }, 401);
    });
    const client = createAuthApiClient({
      apiUrl: "https://api.example.test",
      fetch: fetcher,
      storage,
    });

    await expect(client.authenticatedRequest("/api/protected")).rejects.toMatchObject({
      code: "INVALID_REFRESH_TOKEN",
      status: 401,
    });
    await expect(storage.get(ACCESS_TOKEN_STORAGE_KEY)).resolves.toBeNull();
    await expect(storage.get(REFRESH_TOKEN_STORAGE_KEY)).resolves.toBeNull();
  });
});
