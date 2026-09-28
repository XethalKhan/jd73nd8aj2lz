## Why

The app currently has unauthenticated and authenticated route groups, but no
real session boundary. Login only performs a placeholder navigation, API
requests have no access-token mechanism, and the existing logout control is a
no-op. This change establishes a complete demo authentication flow that can be
used by the Expo app and exercised through a Docker-hosted Expo server.

## What Changes

- Add framework-agnostic authentication handlers for login, refresh, and
  logout under `src/auth/server`.
- Mount those handlers as Expo Router API routes at
  `/api/auth/login`, `/api/auth/refresh`, and `/api/auth/logout`.
- Add JWT access-token and rotating refresh-token issuance, validation, and
  in-memory revocation for the demo fake user.
- Add a Docker Compose Expo development/server service and configurable API
  base URL for native and web clients.
- Add a Zustand authentication store that hydrates from Secure Store, manages
  login, token refresh, logout, and authenticated request headers.
- Protect `(closed)` routes from unauthenticated access and redirect
  authenticated users away from `(open)` routes after auth bootstrap.
- Replace screen-only login behavior with API login followed by the existing
  closed onboarding flow.
- Connect the existing Settings logout control to the authentication store.
- Add focused server, storage, store, API-client, routing, screen, and
  Docker/runtime tests.

## Capabilities

### New Capabilities

- `jwt-authentication`: Provide demo JWT authentication endpoints, secure
  client token storage, token refresh, logout, authenticated requests, and
  session-aware route access.

### Modified Capabilities

- `welcome-auth-entry`: Replace screen-only login navigation with credential
  authentication and make the existing open/closed entry behavior session
  aware.

## Impact

- Server and client authentication code under `src/auth`.
- Expo API route adapters under `app/api/auth`.
- Root, `(open)`, and `(closed)` route layouts and the login/settings screens.
- `app.json`, `compose.yaml`, and likely a Dockerfile or related container
  configuration.
- `package.json` and lockfile for JWT support if an additional JWT library is
  required.
- New unit and integration tests; no persisted database or production
  credential store is introduced.
