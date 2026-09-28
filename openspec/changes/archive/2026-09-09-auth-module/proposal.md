## Why

App currently has a welcome screen and placeholder authentication
destinations, but no usable authentication entry screens. The app needs a
cohesive, design-faithful auth entry module now so users can view the intended
login and sign-up experiences while backend authentication remains out of
scope.

## What Changes

- Move the existing welcome screen presentation and its tests into
  `src/auth/screens`.
- Add design-faithful Login and Sign Up screens under `src/auth/screens`,
  matching the referenced Figma frames' copy, typography, spacing, colors,
  controls, and icons.
- Keep Expo Router files under `app/(open)` as thin route adapters to the
  auth-module screens.
- Add bundled Poppins font files and load them for the Figma typography.
- Bundle the required Figma-derived icon assets locally instead of using
  temporary remote asset URLs at runtime.
- Make Login submission navigate directly to a minimal Home route under
  `app/(closed)`, without validating or persisting credentials.
- Preserve the absence of authentication services, API calls, sessions,
  credential storage, and account-creation behavior.
- Add screen-level tests for rendering, navigation, accessibility, and the
  unvalidated Login submission behavior.

## Capabilities

### New Capabilities

<!-- No new capability path is required. The existing auth entry capability is
     expanded to cover the complete screen-only module. -->

### Modified Capabilities

- `welcome-auth-entry`: Expand the existing welcome and destination contract
  into a complete screen-only authentication entry flow, including
  design-faithful Login and Sign Up screens and direct Login-to-Home
  navigation without authentication services.

## Impact

- Presentation code and tests under `src/auth/screens`.
- Existing welcome component tests and route adapters under `app/(open)`.
- New local font and icon assets under `assets`.
- A minimal authenticated-area Home route under `app/(closed)`.
- Expo Router navigation and root font loading.
- No backend, API, authentication provider, session store, or persisted data.
