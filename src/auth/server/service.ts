import {
  createAuthConfig,
  type AuthConfig,
  type AuthConfigOverrides,
} from "./config";
import {
  createTokenService,
  type TokenService,
  type TokenServiceOptions,
} from "./tokens";
import { InMemoryRefreshSessionRegistry, type RefreshSessionRegistry } from "./sessions";
import { InMemoryUserRepository, type UserRepository } from "./users";
import type {
  AuthError,
  Credentials,
  HandlerErrorResult,
  HandlerResult,
  LogoutResponse,
  RefreshRequest,
  TokenResponse,
} from "./types";

export interface AuthServiceOptions {
  config?: AuthConfig;
  configOverrides?: AuthConfigOverrides;
  userRepository?: UserRepository;
  sessionRegistry?: RefreshSessionRegistry;
  tokenService?: TokenService;
  tokenServiceOptions?: TokenServiceOptions;
  now?: () => number;
}

function error(
  status: HandlerErrorResult["status"],
  code: AuthError["code"],
  message: string,
): HandlerErrorResult {
  return { ok: false, status, error: { code, message } };
}

function isCredentials(value: unknown): value is Credentials {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const credentials = value as Partial<Credentials>;
  return (
    typeof credentials.username === "string" &&
    credentials.username.length > 0 &&
    typeof credentials.password === "string" &&
    credentials.password.length > 0
  );
}

function refreshTokenFrom(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value || undefined;
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }
  const request = value as Partial<RefreshRequest>;
  return typeof request.refreshToken === "string" && request.refreshToken
    ? request.refreshToken
    : undefined;
}

export class AuthService {
  readonly config: AuthConfig;
  readonly sessionRegistry: RefreshSessionRegistry;
  readonly tokenService: TokenService;
  readonly userRepository: UserRepository;
  private readonly now: () => number;

  constructor(options: AuthServiceOptions = {}) {
    this.config = options.config ?? createAuthConfig(options.configOverrides);
    this.now = options.now ?? (() => Date.now());
    this.userRepository =
      options.userRepository ?? new InMemoryUserRepository(this.config.demoUser);
    this.sessionRegistry =
      options.sessionRegistry ?? new InMemoryRefreshSessionRegistry();
    this.tokenService =
      options.tokenService ??
      createTokenService(this.config, {
        ...options.tokenServiceOptions,
        now: options.tokenServiceOptions?.now ?? this.now,
      });
  }

  async login(input: unknown): Promise<HandlerResult<TokenResponse>> {
    if (!isCredentials(input)) {
      return error(
        400,
        "INVALID_REQUEST",
        "username and password are required",
      );
    }

    const user = this.userRepository.findByUsername(input.username);
    if (!user || user.password !== input.password) {
      return error(401, "INVALID_CREDENTIALS", "Invalid credentials");
    }

    try {
      return {
        ok: true,
        status: 200,
        data: await this.issueSession(user.id),
      };
    } catch {
      return error(500, "INTERNAL_ERROR", "Unable to issue authentication tokens");
    }
  }

  async refresh(input: unknown): Promise<HandlerResult<TokenResponse>> {
    const refreshToken = refreshTokenFrom(input);
    if (!refreshToken) {
      return error(400, "INVALID_REQUEST", "refreshToken is required");
    }

    let claims;
    try {
      claims = await this.tokenService.verifyToken(
        refreshToken,
        "refresh",
        this.config.demoUser.id,
      );
    } catch {
      return error(401, "INVALID_REFRESH_TOKEN", "Invalid refresh token");
    }

    if (
      !this.sessionRegistry.consume(
        claims.jti,
        claims.sub,
        this.now(),
      )
    ) {
      return error(401, "INVALID_REFRESH_TOKEN", "Invalid refresh token");
    }

    try {
      return {
        ok: true,
        status: 200,
        data: await this.issueSession(claims.sub),
      };
    } catch {
      return error(500, "INTERNAL_ERROR", "Unable to issue authentication tokens");
    }
  }

  async logout(input?: unknown): Promise<HandlerResult<LogoutResponse>> {
    const refreshToken = refreshTokenFrom(input);
    if (refreshToken) {
      try {
        const claims = await this.tokenService.verifyToken(
          refreshToken,
          "refresh",
          this.config.demoUser.id,
        );
        this.sessionRegistry.revoke(claims.jti, this.now());
      } catch {
        // Logout deliberately remains idempotent for invalid or expired tokens.
      }
    }

    return { ok: true, status: 200, data: { loggedOut: true } };
  }

  private async issueSession(userId: string): Promise<TokenResponse> {
    const now = this.now();
    const access = await this.tokenService.signAccessToken(userId, now);
    const refresh = await this.tokenService.signRefreshToken(userId, now);
    const refreshExpiresAt = refresh.claims.exp * 1000;

    this.sessionRegistry.register({
      jti: refresh.claims.jti,
      userId,
      issuedAt: refresh.claims.iat * 1000,
      expiresAt: refreshExpiresAt,
    });

    return {
      tokenType: "Bearer",
      accessToken: access.token,
      refreshToken: refresh.token,
      accessTokenExpiresAt: access.claims.exp * 1000,
      refreshTokenExpiresAt: refreshExpiresAt,
      accessTokenExpiresIn: this.config.jwt.accessTokenTtlSeconds,
      refreshTokenExpiresIn: this.config.jwt.refreshTokenTtlSeconds,
      expiresIn: this.config.jwt.accessTokenTtlSeconds,
      refreshExpiresIn: this.config.jwt.refreshTokenTtlSeconds,
    };
  }
}

export const createAuthService = (options?: AuthServiceOptions): AuthService =>
  new AuthService(options);

export const createAuthHandlers = createAuthService;
