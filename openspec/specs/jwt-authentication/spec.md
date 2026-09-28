## Purpose

Provide a complete demo authentication boundary for the Expo banking app,
including server-issued JWTs, secure client session state, and protected
application access.

## Requirements

### Requirement: Login authenticates the demo user and issues tokens

The authentication service SHALL expose `POST /api/auth/login`. It SHALL
accept the demo user's credentials and return an access token, a refresh token,
their token types, and their expiration metadata when the credentials match.

#### Scenario: Login succeeds with the demo credentials

- **WHEN** a client submits the configured demo username and password
- **THEN** the service returns a successful response containing a JWT access
  token and JWT refresh token
- **AND** the response identifies the tokens as bearer tokens
- **AND** the response includes expiration information for both tokens

#### Scenario: Login rejects invalid credentials

- **WHEN** a client submits credentials that do not match the configured demo
  user
- **THEN** the service returns an unauthorized response
- **AND** it does not issue either token
- **AND** the response does not reveal which credential was incorrect

#### Scenario: Login rejects malformed input

- **WHEN** a client submits a request without the required credential fields
- **THEN** the service returns a client-error response
- **AND** it does not issue either token

### Requirement: Access tokens authorize API requests

The service SHALL issue signed access JWTs containing an authenticated user
identity, token type, issued-at time, and expiration time. API consumers SHALL
send the access token using the `Authorization: Bearer <token>` header.

#### Scenario: A valid access token is accepted

- **WHEN** an API request includes a valid, unexpired access token for the
  demo user
- **THEN** the protected API operation can identify the authenticated user

#### Scenario: An invalid or expired access token is rejected

- **WHEN** an API request includes a missing, malformed, invalid, or expired
  access token
- **THEN** the protected API operation returns an unauthorized response
- **AND** it does not treat the request as authenticated

### Requirement: Refresh rotates a valid refresh-token session

The authentication service SHALL expose `POST /api/auth/refresh`. It SHALL
accept a valid refresh token, verify its signature, type, subject, and
expiration, and return a newly issued access token and refresh token.
Successful rotation SHALL invalidate the submitted refresh token.

#### Scenario: Refresh succeeds with a valid refresh token

- **WHEN** a client submits an unexpired, non-revoked refresh token issued for
  the demo user
- **THEN** the service returns a new access token and a new refresh token
- **AND** the submitted refresh token can no longer be used

#### Scenario: Refresh rejects an access token

- **WHEN** a client submits an access token to the refresh endpoint
- **THEN** the service returns an unauthorized response
- **AND** it does not issue replacement tokens

#### Scenario: Refresh rejects an expired, invalid, or revoked token

- **WHEN** a client submits an expired, invalid, or previously rotated refresh
  token
- **THEN** the service returns an unauthorized response
- **AND** it does not issue replacement tokens

### Requirement: Logout revokes the refresh-token session

The authentication service SHALL expose `POST /api/auth/logout`. It SHALL
revoke the submitted refresh token and respond idempotently when the token is
already revoked or absent. Logout SHALL not claim to invalidate already-issued
access tokens before their expiration.

#### Scenario: Logout revokes an active refresh token

- **WHEN** an authenticated client submits its refresh token to logout
- **THEN** the service marks that refresh token as revoked
- **AND** subsequent refresh attempts with that token are rejected
- **AND** the service returns a successful logout response

#### Scenario: Logout is safe to repeat

- **WHEN** a client submits an already-revoked, expired, or absent refresh
  token to logout
- **THEN** the service returns a successful logout response
- **AND** it does not issue any token

### Requirement: The client persists and refreshes authentication state

The client SHALL persist the access and refresh tokens in secure device
storage, restore them during application bootstrap, and expose authentication
state through a shared Zustand store. The client SHALL refresh an expired or
unauthorized access token once before failing the original API operation.

#### Scenario: A stored session is restored

- **WHEN** the application starts with valid stored authentication tokens
- **THEN** the authentication store restores the session
- **AND** authenticated route access becomes available after bootstrap

#### Scenario: Login stores the returned session

- **WHEN** the client receives a successful login response
- **THEN** it stores both returned tokens securely
- **AND** it exposes the user as authenticated

#### Scenario: A failed refresh clears the local session

- **WHEN** stored or active tokens cannot be refreshed
- **THEN** the client removes both tokens from secure storage
- **AND** it exposes the user as unauthenticated

#### Scenario: Concurrent requests share one refresh

- **WHEN** multiple API requests require refresh at the same time
- **THEN** the client performs one refresh operation
- **AND** retries eligible requests with the resulting access token

### Requirement: Authentication state controls route access

The application SHALL keep the `(closed)` route group inaccessible to
unauthenticated users and SHALL prevent authenticated users from remaining in
the `(open)` entry flow after authentication bootstrap completes. The app
MUST defer redirects until the authentication bootstrap state is known.

#### Scenario: Unauthenticated launch enters the open flow

- **WHEN** the application finishes bootstrap without a valid session
- **THEN** the user can access the `(open)` routes
- **AND** the user cannot access the `(closed)` routes

#### Scenario: Authenticated launch enters the closed flow

- **WHEN** the application finishes bootstrap with a valid session
- **THEN** the user can access the `(closed)` routes
- **AND** the user is redirected away from the `(open)` entry flow

#### Scenario: Direct closed-route access is denied

- **WHEN** an unauthenticated user directly opens a `(closed)` route
- **THEN** the application redirects the user to the open entry flow

### Requirement: The Docker server exposes the auth API

The project SHALL provide a Docker Compose service that starts the Expo
development/server runtime on a configurable host port and exposes the auth
API to native and web clients through a configurable absolute API URL.

#### Scenario: The server starts with the configured port

- **WHEN** the authentication server container is started through Docker
  Compose
- **THEN** the Expo server listens on the configured host interface and port
- **AND** the three authentication endpoints are reachable under `/api/auth`

#### Scenario: The client uses an explicit API base URL

- **WHEN** the app is configured with an API base URL
- **THEN** authentication requests target that server rather than assuming
  that a native device can resolve a relative `/api` URL
