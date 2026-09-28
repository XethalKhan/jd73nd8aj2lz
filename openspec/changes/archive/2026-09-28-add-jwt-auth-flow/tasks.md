## 1. Authentication foundations

- [x] 1.1 Add the server-compatible JWT dependency and auth module types for credentials, token responses, token claims, and handler results; verify the dependency tree and TypeScript imports resolve.
- [x] 1.2 Add configurable demo-user and JWT lifetime/secret settings with safe test defaults; verify secrets are not committed and missing production configuration fails clearly.
- [x] 1.3 Add auth storage keys and an injectable client storage adapter backed by Secure Store on native and browser storage on web; verify get, set, delete, unavailable-storage, and failure paths with unit tests.

## 2. Framework-agnostic authentication server

- [x] 2.1 Implement token signing and verification with distinct access and refresh token types, user identity, token ID, issued-at, and expiration claims; verify valid, expired, wrong-type, wrong-user, and invalid-signature tokens in unit tests.
- [x] 2.2 Implement the in-memory fake-user repository and refresh-session registry with rotation and revocation; verify a rotated token cannot be reused and process-local state is deterministic in tests.
- [x] 2.3 Implement framework-agnostic login, refresh, and logout operations with consistent success and error results; verify valid login, invalid/malformed credentials, refresh rotation, invalid refresh tokens, and idempotent logout.
- [x] 2.4 Add bearer-token parsing and protected-request authentication helpers for future API operations; verify missing, malformed, invalid, expired, and valid Authorization headers.

## 3. Expo API routes and Docker server

- [x] 3.1 Add Expo Router `+api.ts` adapters for POST `/api/auth/login`, `/api/auth/refresh`, and `/api/auth/logout`; verify each adapter maps JSON input and domain errors to the documented HTTP status and response bodies.
- [x] 3.2 Add route-level tests that invoke the API adapters with Web `Request` objects and verify token issuance, refresh rotation, logout revocation, and malformed request handling without starting React Native.
- [x] 3.3 Add the Expo server Dockerfile and Compose service, binding the development/server runtime to a configurable host and port; verify `docker compose config` and a container endpoint smoke test.
- [x] 3.4 Configure the Expo server/web output and document `EXPO_PUBLIC_API_URL`, Android emulator, physical-device LAN, and web values; verify the app does not construct native requests from an unusable relative API URL.

## 4. Client session and API client

- [x] 4.1 Implement the auth API client for login, refresh, logout, and authenticated requests using the configured absolute API URL; verify request payloads, Bearer headers, response parsing, and normalized errors.
- [x] 4.2 Implement the Zustand auth store with bootstrap hydration, authenticated/unauthenticated state, login, logout, and failed-refresh cleanup; verify state transitions and Secure Store writes with mocked storage and fetch.
- [x] 4.3 Add one shared refresh promise for concurrent unauthorized requests and retry each eligible request once; verify concurrent calls perform one refresh and refresh failure clears the session.
- [x] 4.4 Add an auth bootstrap boundary to the root layout without bypassing the existing localization and splash-screen readiness behavior; verify the router renders only after auth bootstrap is known.

## 5. Route protection and screen integration

- [x] 5.1 Protect the `(closed)` route group and redirect unauthenticated direct access to `(open)/welcome`; verify bootstrap loading does not redirect prematurely and closed routes are inaccessible without a session.
- [x] 5.2 Redirect authenticated users away from `(open)` routes and update the root entry redirect; verify a restored session enters the closed flow and an empty session enters welcome.
- [x] 5.3 Update Login to call the auth store, show authentication failure, persist successful tokens, and replace the route with the existing onboarding flow; verify valid and invalid credentials with screen tests.
- [x] 5.4 Connect the Settings logout control to the auth store and open welcome route; verify the endpoint is called, local tokens are cleared, and the user leaves the closed flow.

## 6. Regression coverage and validation

- [x] 6.1 Update existing auth, navigation, settings, and route-layout tests for session-aware behavior; verify focused Jest tests cover open/closed redirects, login, logout, and existing screen navigation.
- [x] 6.2 Add end-to-end server/client contract coverage for login, authenticated request authorization, refresh rotation, and logout; verify the full token lifecycle against the Docker-hosted API.
- [x] 6.3 Run TypeScript validation, Expo lint, focused Jest tests, and the Docker configuration/smoke checks; verify no new diagnostics or regressions remain.
