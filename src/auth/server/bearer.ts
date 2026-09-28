import type { TokenService } from "./tokens";
import type { AuthPrincipal, HandlerErrorResult, TokenClaims } from "./types";

export interface BearerParseSuccess {
  ok: true;
  token: string;
}

export interface BearerParseFailure {
  ok: false;
  error: "MISSING_AUTHORIZATION" | "MALFORMED_AUTHORIZATION";
}

export type BearerParseResult = BearerParseSuccess | BearerParseFailure;

export function parseBearerToken(
  authorization: string | null | undefined,
): BearerParseResult {
  if (!authorization) {
    return { ok: false, error: "MISSING_AUTHORIZATION" };
  }

  const parts = authorization.trim().split(/\s+/);
  if (
    parts.length !== 2 ||
    parts[0].toLowerCase() !== "bearer" ||
    parts[1].length === 0
  ) {
    return { ok: false, error: "MALFORMED_AUTHORIZATION" };
  }

  return { ok: true, token: parts[1] };
}

export interface ProtectedRequestSuccess {
  ok: true;
  principal: AuthPrincipal;
}

export interface ProtectedRequestFailure {
  ok: false;
  status: 401;
  error: HandlerErrorResult["error"];
}

export type ProtectedRequestResult =
  | ProtectedRequestSuccess
  | ProtectedRequestFailure;

export async function authenticateBearerToken(
  authorization: string | null | undefined,
  tokenService: TokenService,
  expectedSubject?: string,
): Promise<ProtectedRequestResult> {
  const parsed = parseBearerToken(authorization);
  if (!parsed.ok) {
    return {
      ok: false,
      status: 401,
      error: {
        code: "UNAUTHORIZED",
        message: "A valid Bearer token is required",
      },
    };
  }

  try {
    const claims: TokenClaims = await tokenService.verifyToken(
      parsed.token,
      "access",
      expectedSubject,
    );
    return { ok: true, principal: { userId: claims.sub, claims } };
  } catch {
    return {
      ok: false,
      status: 401,
      error: {
        code: "UNAUTHORIZED",
        message: "A valid Bearer token is required",
      },
    };
  }
}

export const authenticateProtectedRequest = authenticateBearerToken;
