import type { Credentials, LogoutResponse, TokenResponse } from "../server/types";
import {
  type AuthStorage,
  clearStoredAuthTokens,
  readStoredAuthTokens,
  writeStoredAuthTokens,
} from "./storage";

export interface AuthApiErrorDetails {
  code: string;
  status?: number;
  details?: unknown;
}

export class AuthApiError extends Error {
  readonly code: string;
  readonly status?: number;
  readonly details?: unknown;

  constructor(
    message: string,
    { code, status, details }: AuthApiErrorDetails,
  ) {
    super(message);
    this.name = "AuthApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export const AuthClientError = AuthApiError;

export interface AuthApiClientOptions {
  apiUrl?: string;
  fetch?: typeof globalThis.fetch;
  storage?: AuthStorage;
  onSessionChanged?: (session: TokenResponse) => void | Promise<void>;
  onSessionCleared?: () => void | Promise<void>;
}

export interface AuthRequestOptions extends RequestInit {
  retryOnUnauthorized?: boolean;
}

export interface AuthApiClient {
  readonly apiUrl: string;
  login(credentials: Credentials): Promise<TokenResponse>;
  refresh(): Promise<TokenResponse>;
  logout(): Promise<LogoutResponse>;
  request<T>(path: string, options?: AuthRequestOptions): Promise<T>;
  authenticatedRequest<T>(
    path: string,
    options?: AuthRequestOptions,
  ): Promise<T>;
}

function runtimeEnvironment(): Record<string, string | undefined> {
  const maybeProcess = (globalThis as {
    process?: { env?: Record<string, string | undefined> };
  }).process;
  return maybeProcess?.env ?? {};
}

export function validateApiUrl(value: string, platform?: "web" | "native"): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new AuthApiError("EXPO_PUBLIC_API_URL is required", {
      code: "INVALID_API_URL",
    });
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new AuthApiError(
      "EXPO_PUBLIC_API_URL must be an absolute HTTP(S) URL",
      { code: "INVALID_API_URL" },
    );
  }

  if (
    (platform === "native" || platform === undefined) &&
    !["http:", "https:"].includes(parsed.protocol)
  ) {
    throw new AuthApiError(
      "EXPO_PUBLIC_API_URL must use the HTTP(S) protocol",
      { code: "INVALID_API_URL" },
    );
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new AuthApiError(
      "EXPO_PUBLIC_API_URL must use the HTTP(S) protocol",
      { code: "INVALID_API_URL" },
    );
  }

  return trimmed.replace(/\/+$/, "");
}

export function getApiBaseUrl(
  apiUrl?: string,
  platform?: "web" | "native",
): string {
  return validateApiUrl(
    apiUrl ?? runtimeEnvironment().EXPO_PUBLIC_API_URL ?? "",
    platform,
  );
}

function configuredApiUrl(explicit?: string): string {
  return explicit ?? runtimeEnvironment().EXPO_PUBLIC_API_URL ?? "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

async function parseResponse(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return undefined;
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function unwrapResponse(value: unknown): unknown {
  if (isRecord(value) && value.ok === true && "data" in value) {
    return value.data;
  }
  return value;
}

function errorFromResponse(value: unknown, status: number): AuthApiError {
  const envelope = isRecord(value) && isRecord(value.error) ? value.error : value;
  const code =
    isRecord(envelope) && typeof envelope.code === "string"
      ? envelope.code
      : status === 401
        ? "UNAUTHORIZED"
        : "HTTP_ERROR";
  const message =
    isRecord(envelope) && typeof envelope.message === "string"
      ? envelope.message
      : typeof value === "string"
        ? value
        : `Authentication request failed with status ${status}`;
  return new AuthApiError(message, { code, status, details: value });
}

function isUnauthorized(error: unknown): boolean {
  return error instanceof AuthApiError && error.status === 401;
}

export function createAuthApiClient(
  options: AuthApiClientOptions = {},
): AuthApiClient {
  const fetcher = options.fetch ?? globalThis.fetch.bind(globalThis);
  const storage = options.storage;
  const configured = configuredApiUrl(options.apiUrl);
  if (options.apiUrl !== undefined) {
    validateApiUrl(configured);
  }

  let refreshPromise: Promise<TokenResponse> | undefined;

  const getBaseUrl = (): string => validateApiUrl(configured);

  const call = async <T>(
    path: string,
    requestOptions: RequestInit = {},
    accessToken?: string,
  ): Promise<T> => {
    const url = /^https?:\/\//i.test(path) ? path : `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
    const headers = new Headers(requestOptions.headers);
    if (requestOptions.body !== undefined && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    headers.set("Accept", "application/json");
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    let response: Response;
    try {
      response = await fetcher(url, { ...requestOptions, headers });
    } catch (error) {
      throw new AuthApiError("Unable to reach the authentication server", {
        code: "NETWORK_ERROR",
        details: error,
      });
    }

    const body = await parseResponse(response);
    if (!response.ok) {
      throw errorFromResponse(body, response.status);
    }
    return unwrapResponse(body) as T;
  };

  const requireStorage = (): AuthStorage => {
    if (!storage) {
      throw new AuthApiError("Authentication storage is not configured", {
        code: "STORAGE_UNAVAILABLE",
      });
    }
    return storage;
  };

  const saveSession = async (session: TokenResponse): Promise<TokenResponse> => {
    await writeStoredAuthTokens(requireStorage(), session);
    await options.onSessionChanged?.(session);
    return session;
  };

  const clearSession = async (): Promise<void> => {
    if (storage) {
      await clearStoredAuthTokens(storage);
    }
    await options.onSessionCleared?.();
  };

  const refresh = async (): Promise<TokenResponse> => {
    const authStorage = requireStorage();
    const { refreshToken } = await readStoredAuthTokens(authStorage);
    if (!refreshToken) {
      await clearSession();
      throw new AuthApiError("No refresh token is available", {
        code: "NO_REFRESH_TOKEN",
        status: 401,
      });
    }
    try {
      const session = await call<TokenResponse>("/api/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });
      return await saveSession(session);
    } catch (error) {
      await clearSession();
      throw error;
    }
  };

  const refreshOnce = (): Promise<TokenResponse> => {
    if (!refreshPromise) {
      refreshPromise = refresh().finally(() => {
        refreshPromise = undefined;
      });
    }
    return refreshPromise;
  };

  const request = async <T>(
    path: string,
    requestOptions: AuthRequestOptions = {},
    attempt = 0,
  ): Promise<T> => {
    const authStorage = requireStorage();
    const { accessToken } = await readStoredAuthTokens(authStorage);
    const fetchOptions = { ...requestOptions };
    delete fetchOptions.retryOnUnauthorized;
    try {
      return await call<T>(path, fetchOptions, accessToken ?? undefined);
    } catch (error) {
      const shouldRetry =
        isUnauthorized(error) &&
        accessToken !== null &&
        requestOptions.retryOnUnauthorized !== false &&
        attempt === 0;
      if (!shouldRetry) {
        if (isUnauthorized(error) && attempt > 0) {
          await clearSession();
        }
        throw error;
      }
      await refreshOnce();
      return request(path, { ...requestOptions, retryOnUnauthorized: false }, 1);
    }
  };

  return {
    get apiUrl() {
      return getBaseUrl();
    },
    async login(credentials) {
      const session = await call<TokenResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      return saveSession(session);
    },
    refresh,
    async logout() {
      const authStorage = requireStorage();
      const { refreshToken } = await readStoredAuthTokens(authStorage);
      try {
        return await call<LogoutResponse>("/api/auth/logout", {
          method: "POST",
          body: JSON.stringify(
            refreshToken ? { refreshToken } : undefined,
          ),
        });
      } finally {
        await clearSession();
      }
    },
    request,
    authenticatedRequest: request,
  };
}

export const createApiClient = createAuthApiClient;
