import { jwtVerify, SignJWT } from "jose";

import type { AuthConfig } from "./config";
import type { AuthTokenType, TokenClaims } from "./types";

export interface SignedToken {
  token: string;
  claims: TokenClaims;
}

export class TokenVerificationError extends Error {
  constructor(message = "The token is invalid") {
    super(message);
    this.name = "TokenVerificationError";
  }
}

export interface TokenService {
  signAccessToken(userId: string, now?: number): Promise<SignedToken>;
  signRefreshToken(userId: string, now?: number): Promise<SignedToken>;
  verifyToken(
    token: string,
    expectedType: AuthTokenType,
    expectedSubject?: string,
  ): Promise<TokenClaims>;
}

export interface TokenServiceOptions {
  now?: () => number;
  createTokenId?: () => string;
}

function defaultTokenId(): string {
  const crypto = (globalThis as {
    crypto?: { randomUUID?: () => string };
  }).crypto;
  return (
    crypto?.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
  );
}

function toClaims(
  payload: Record<string, unknown>,
  expectedType: AuthTokenType,
  expectedSubject?: string,
): TokenClaims {
  if (
    payload.type !== expectedType ||
    typeof payload.sub !== "string" ||
    typeof payload.jti !== "string" ||
    typeof payload.iat !== "number" ||
    typeof payload.exp !== "number"
  ) {
    throw new TokenVerificationError("The token claims are invalid");
  }

  if (expectedSubject !== undefined && payload.sub !== expectedSubject) {
    throw new TokenVerificationError("The token subject is invalid");
  }

  return {
    sub: payload.sub,
    jti: payload.jti,
    iat: payload.iat,
    exp: payload.exp,
    type: expectedType,
    ...(typeof payload.iss === "string" ? { iss: payload.iss } : {}),
  };
}

export class JwtTokenService implements TokenService {
  private readonly key: Uint8Array;
  private readonly now: () => number;
  private readonly createTokenId: () => string;

  constructor(
    private readonly config: AuthConfig,
    options: TokenServiceOptions = {},
  ) {
    this.key = new TextEncoder().encode(config.jwt.secret);
    this.now = options.now ?? (() => Date.now());
    this.createTokenId = options.createTokenId ?? defaultTokenId;
  }

  signAccessToken(userId: string, now = this.now()): Promise<SignedToken> {
    return this.sign(userId, "access", now, this.config.jwt.accessTokenTtlSeconds);
  }

  signRefreshToken(userId: string, now = this.now()): Promise<SignedToken> {
    return this.sign(
      userId,
      "refresh",
      now,
      this.config.jwt.refreshTokenTtlSeconds,
    );
  }

  async verifyToken(
    token: string,
    expectedType: AuthTokenType,
    expectedSubject?: string,
  ): Promise<TokenClaims> {
    if (!token || typeof token !== "string") {
      throw new TokenVerificationError();
    }

    try {
      const { payload } = await jwtVerify(token, this.key, {
        algorithms: ["HS256"],
        issuer: this.config.jwt.issuer,
      });
      return toClaims(payload, expectedType, expectedSubject);
    } catch (error) {
      if (error instanceof TokenVerificationError) {
        throw error;
      }
      throw new TokenVerificationError();
    }
  }

  private sign(
    userId: string,
    type: AuthTokenType,
    now: number,
    lifetimeSeconds: number,
  ): Promise<SignedToken> {
    const issuedAt = Math.floor(now / 1000);
    const exp = issuedAt + lifetimeSeconds;
    const claims: TokenClaims = {
      sub: userId,
      jti: this.createTokenId(),
      iat: issuedAt,
      exp,
      type,
      iss: this.config.jwt.issuer,
    };

    const builder = new SignJWT({ type })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setSubject(userId)
      .setJti(claims.jti)
      .setIssuedAt(issuedAt)
      .setExpirationTime(exp)
      .setIssuer(this.config.jwt.issuer);

    return builder.sign(this.key).then((token) => ({ token, claims }));
  }
}

export const createTokenService = (
  config: AuthConfig,
  options?: TokenServiceOptions,
): TokenService => new JwtTokenService(config, options);
