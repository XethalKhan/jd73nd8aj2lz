export type AuthTokenType = "access" | "refresh";

export interface Credentials {
  username: string;
  password: string;
}

export interface DemoUser {
  id: string;
  username: string;
  password: string;
}

export interface TokenClaims {
  sub: string;
  jti: string;
  iat: number;
  exp: number;
  type: AuthTokenType;
  iss?: string;
}

export interface TokenResponse {
  tokenType: "Bearer";
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number;
  refreshTokenExpiresAt: number;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
  expiresIn: number;
  refreshExpiresIn: number;
}

export interface LogoutResponse {
  loggedOut: true;
}

export interface AuthError {
  code:
    | "INVALID_REQUEST"
    | "INVALID_CREDENTIALS"
    | "INVALID_REFRESH_TOKEN"
    | "UNAUTHORIZED"
    | "INTERNAL_ERROR";
  message: string;
}

export interface HandlerSuccessResult<T> {
  ok: true;
  status: 200;
  data: T;
}

export interface HandlerErrorResult {
  ok: false;
  status: 400 | 401 | 500;
  error: AuthError;
}

export type HandlerResult<T> =
  | HandlerSuccessResult<T>
  | HandlerErrorResult;

export interface RefreshRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken?: string;
}

export interface AuthPrincipal {
  userId: string;
  claims: TokenClaims;
}
