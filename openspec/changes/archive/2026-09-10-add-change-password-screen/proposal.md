## Why

Authenticated users can see a Change Password option in Settings, but it
currently has no destination. The app needs the supplied Change Password
design represented as an auth-owned screen while keeping password handling
out of scope.

## What Changes

- Add a `ChangePasswordScreen` presentational screen matching
  `CHANGE_PASSWORD_SCREEN.svg` at the reference mobile layout.
- Add three empty, locally editable password fields with local-only masking
  toggles.
- Add back navigation and a non-functional Change Password button.
- Add the authenticated `/change-password` route without adding it to the
  visible tab bar.
- Navigate to the new route when the Settings > Change Password row is
  pressed.
- Add focused screen and navigation tests.

## Capabilities

### New Capabilities

- `change-password-screen`: Present the designed change-password UI with
  local-only field and visibility interactions.

### Modified Capabilities

- `settings-screen`: Change the Change Password row from a no-op row to
  navigation into the authenticated Change Password screen.

## Impact

- Affected UI code: `src/auth/screens`, `src/settings/screens`, and
  authenticated Expo Router adapters under `app/(closed)`.
- Affected tests: auth screen and settings screen tests.
- No API, authentication, persistence, validation, dependency, or data-model
  changes.
