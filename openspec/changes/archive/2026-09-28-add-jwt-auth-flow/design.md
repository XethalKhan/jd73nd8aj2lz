## Context

The project is an Expo SDK 56 TypeScript app using Expo Router, Zustand,
`expo-secure-store`, Emotion Native, and Jest. It already has `(open)` and
`(closed)` route groups, a root localization provider, a screen-only Login
implementation, and a no-op logout control in Settings. The existing web
configuration uses static output, while the requested API must run in a
Docker-hosted Expo server process. See `proposal.md` and the capability specs
for the intended behavior.

## Goals / Non-Goals

**Goals:**

- Keep authentication business logic independent of Expo Router.
- Make the API contract testable without starting Expo.
- Use signed, typed, expiring JWTs with refresh-token rotation and revocation.
- Make Secure Store and the browser storage fallback testable through an
  injectable storage boundary.
- Ensure route protection waits for token hydration.
- Run the demo API and web server through Docker Compose.

**Non-Goals:**

- No database, user registration, password hashing, password reset, or
  production credential management.
- No multi-device session management.
- No access-token blacklist; access tokens remain valid until their short
  expiration.
- No EAS deployment or production-grade horizontal scaling.

## Decisions

### Keep domain handlers separate from Expo API adapters

Implement login, refresh, and logout as plain TypeScript operations over
request data and injected authentication dependencies. The `app/api/auth`
files only parse the Web `Request`, call the domain operation, and translate
the result into a `Response`. This keeps the server module unaware of Expo
Router while preserving the `+api.ts` route convention.

Alternative considered: put `Request` parsing and `Response` construction in
`src/auth/server`. That would make unit tests and future server integration
harder, and would couple the requested module to the Expo runtime.

### Use signed JWTs with rotating refresh tokens

Use a maintained JWT implementation compatible with the Expo server runtime,
preferably `jose`, with a server-only secret supplied through environment
configuration. Access and refresh tokens use distinct `type` claims and
short/long lifetimes. Each refresh token receives a unique identifier and is
recorded in the in-memory session registry. Refresh atomically revokes the
submitted identifier before issuing replacements.

Alternative considered: hand-encode JWTs with Node crypto. This increases
cryptographic and claim-validation risk without providing value for the demo.

### Use a single fake user and an in-memory refresh registry

The server compares credentials against one configured demo user and stores
active/revoked refresh-token identifiers in process memory. This matches the
requested scope and keeps the API deterministic for tests.

Alternative considered: add a database or external session store. That would
exceed the explicit credential-storage scope and add Docker services unrelated
to this demo.

### Store tokens behind an authentication storage adapter

Define an auth-specific storage interface with `get`, `set`, and `delete`
operations. Native uses `expo-secure-store`; web uses the existing browser
storage pattern. Store access and refresh tokens under namespaced keys and
clear both keys on logout, invalid refresh, or storage corruption.

Alternative considered: persist the Zustand store directly with a generic
JSON-storage middleware. A dedicated adapter makes token handling explicit and
avoids accidentally persisting unrelated auth state.

### Centralize authenticated requests and refresh deduplication

Expose an API client that adds the current access token, detects expiration or
an unauthorized response, and performs one shared refresh promise. Requests
that fail after the single retry propagate the error and transition the store
to unauthenticated. The Zustand store owns session state and delegates network
operations to the client.

Alternative considered: let every screen call `fetch` and implement refresh
independently. That duplicates security-sensitive behavior and makes
concurrent refresh races likely.

### Guard route groups after auth bootstrap

Add an auth provider/bootstrap boundary inside the root layout. The root entry,
`(open)` layout, and `(closed)` layout use the store's `isBootstrapping` state
before redirecting. Expo Router's protected-screen support or equivalent
layout redirects will keep direct access to the wrong group from rendering.
On successful login, the screen replaces the open route with onboarding; on
logout, the store clears the session and routes to welcome.

Alternative considered: guard only `app/index.tsx`. That protects the default
entry but allows direct navigation to a closed URL.

### Run the Expo server in Docker Compose

Add an Expo server service to the existing Compose file and a project Docker
build context. The service binds Expo to `0.0.0.0` on a configurable port and
runs the development/server command selected during exploration. The app
receives an absolute `EXPO_PUBLIC_API_URL`; web can use the local server
origin, while native development uses an emulator- or LAN-reachable host.
Change web output configuration if required by Expo's server route handling,
and verify the API endpoints through a container smoke test.

Alternative considered: create a separate Express or Fastify server. That
would satisfy Docker hosting but would not exercise the requested Expo API
route adapters or reuse the app's route tree.

### Make logout idempotent and document access-token behavior

Logout revokes the refresh token when present and returns success even if the
token is already revoked or missing. It cannot revoke stateless access JWTs
without an access blacklist, so access tokens use a short lifetime and the
client clears local state immediately.

Alternative considered: maintain an access-token blacklist. That adds memory
growth and synchronization complexity for a demo without changing the core
refresh-session behavior.

## Risks / Trade-offs

- **[Risk]** In-memory refresh state disappears when the Docker process
  restarts and is inconsistent across multiple replicas. **Mitigation:** make
  this limitation explicit, run one demo server, and keep persistence out of
  scope.
- **[Risk]** Static web output may omit server API routes. **Mitigation:** use
  the Expo server runtime in Docker and align `web.output` with Expo's API
  route requirements; add a container endpoint smoke test.
- **[Risk]** A native device cannot resolve a relative `/api` URL.
  **Mitigation:** require an explicit absolute API base URL and document
  emulator and LAN configurations.
- **[Risk]** Refresh races can rotate the same token more than once.
  **Mitigation:** deduplicate client refresh calls and make server rotation
  atomic within the in-memory registry.
- **[Risk]** Test environments may import native Secure Store or server-only
  JWT code in the wrong runtime. **Mitigation:** mock the storage seam and keep
  API adapters thin, with separate server and client test suites.
- **[Risk]** The fake credential and signing secret are not suitable for real
  users. **Mitigation:** keep them clearly demo-only, use environment
  configuration for the signing secret, and exclude secrets from source.

## Migration Plan

1. Add the JWT dependency, auth server contracts, token service, fake user,
   and API route adapters.
2. Add auth storage, API client, Zustand store, bootstrap boundary, and route
   protection.
3. Update Login and Settings to use the store, preserving existing open and
   closed screen destinations.
4. Add Compose/Docker server configuration and API URL documentation.
5. Add unit, route, screen, and container smoke tests, then run type checks,
   lint, and the focused Jest suite.
6. Roll back by removing the auth routes, store, Docker service, and route
   guards. No database or persisted-schema migration is required; clear the
   two namespaced Secure Store keys when testing rollback.
