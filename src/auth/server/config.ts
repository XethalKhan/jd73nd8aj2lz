import type { DemoUser } from "./types";

export const DEFAULT_ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
export const DEFAULT_REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;
export const DEFAULT_DEMO_USER_ID = "demo-user";
export const DEFAULT_DEMO_USERNAME = "demo@example.com";
export const DEFAULT_DEMO_PASSWORD = "demo-password";

// This value is intentionally only a development/test fallback. Production
// configuration must provide AUTH_JWT_SECRET or JWT_SECRET.
const TEST_ONLY_JWT_SECRET = "test-only-jwt-secret-change-me";

export interface JwtSettings {
  secret: string;
  accessTokenTtlSeconds: number;
  refreshTokenTtlSeconds: number;
  issuer: string;
}

export interface AuthConfig {
  environment: string;
  demoUser: DemoUser;
  jwt: JwtSettings;
}

export interface AuthConfigOverrides {
  environment?: string;
  demoUser?: Partial<DemoUser>;
  jwt?: Partial<JwtSettings>;
  jwtSecret?: string;
  accessTokenTtlSeconds?: number;
  refreshTokenTtlSeconds?: number;
  issuer?: string;
  env?: Record<string, string | undefined>;
}

export class AuthConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthConfigurationError";
  }
}

function positiveSeconds(value: number | undefined, name: string): number {
  if (value === undefined) {
    throw new AuthConfigurationError(`${name} must be a positive number of seconds`);
  }

  if (!Number.isFinite(value) || value <= 0) {
    throw new AuthConfigurationError(`${name} must be a positive number of seconds`);
  }

  return Math.floor(value);
}

function numberFromEnvironment(
  value: string | undefined,
  fallback: number,
  name: string,
): number {
  if (value === undefined || value.trim() === "") {
    return fallback;
  }

  const parsed = Number(value);
  return positiveSeconds(parsed, name);
}

function runtimeEnvironment(): Record<string, string | undefined> {
  const maybeProcess = (globalThis as {
    process?: { env?: Record<string, string | undefined> };
  }).process;
  return maybeProcess?.env ?? {};
}

export function loadAuthConfig(
  overrides: AuthConfigOverrides = {},
): AuthConfig {
  const env = overrides.env ?? runtimeEnvironment();
  const environment =
    overrides.environment ?? env.NODE_ENV ?? "development";
  const configuredSecretValue =
    overrides.jwt?.secret ??
    overrides.jwtSecret ??
    env.AUTH_JWT_SECRET ??
    env.JWT_SECRET;
  const configuredSecret =
    configuredSecretValue && configuredSecretValue.trim()
      ? configuredSecretValue
      : undefined;

  if (environment === "production" && !configuredSecret) {
    throw new AuthConfigurationError(
      "AUTH_JWT_SECRET (or JWT_SECRET) is required when NODE_ENV is production",
    );
  }

  const secret = configuredSecret || TEST_ONLY_JWT_SECRET;
  const demoUser: DemoUser = {
    id:
      overrides.demoUser?.id ??
      env.AUTH_DEMO_USER_ID ??
      DEFAULT_DEMO_USER_ID,
    username:
      overrides.demoUser?.username ??
      env.AUTH_DEMO_USERNAME ??
      DEFAULT_DEMO_USERNAME,
    password:
      overrides.demoUser?.password ??
      env.AUTH_DEMO_PASSWORD ??
      DEFAULT_DEMO_PASSWORD,
  };

  if (!demoUser.id || !demoUser.username || !demoUser.password) {
    throw new AuthConfigurationError(
      "The demo user id, username, and password must all be configured",
    );
  }

  const accessTokenTtlSeconds = positiveSeconds(
    overrides.jwt?.accessTokenTtlSeconds ??
      overrides.accessTokenTtlSeconds ??
      numberFromEnvironment(
        env.AUTH_ACCESS_TOKEN_TTL_SECONDS,
        DEFAULT_ACCESS_TOKEN_TTL_SECONDS,
        "AUTH_ACCESS_TOKEN_TTL_SECONDS",
      ),
    "accessTokenTtlSeconds",
  );
  const refreshTokenTtlSeconds = positiveSeconds(
    overrides.jwt?.refreshTokenTtlSeconds ??
      overrides.refreshTokenTtlSeconds ??
      numberFromEnvironment(
        env.AUTH_REFRESH_TOKEN_TTL_SECONDS,
        DEFAULT_REFRESH_TOKEN_TTL_SECONDS,
        "AUTH_REFRESH_TOKEN_TTL_SECONDS",
      ),
    "refreshTokenTtlSeconds",
  );

  return {
    environment,
    demoUser,
    jwt: {
      secret,
      accessTokenTtlSeconds,
      refreshTokenTtlSeconds,
      issuer:
        overrides.jwt?.issuer ??
        overrides.issuer ??
        env.AUTH_JWT_ISSUER ??
        "cbsdemo",
    },
  };
}

export const createAuthConfig = loadAuthConfig;
