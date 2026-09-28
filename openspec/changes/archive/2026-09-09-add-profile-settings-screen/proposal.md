## Why

Authenticated users can currently view Settings, but the My Profile row has no destination. The profile page is needed to complete the Settings flow and provide the designed account overview UI without introducing account logic or external integrations.

## What Changes

- Add a new profile screen in the authenticated Settings module.
- Navigate from the Settings “My Profile” row to the profile screen.
- Match the supplied mobile profile design with its header, avatar summary, profile rows, icons, separators, and notification badge.
- Keep the profile UI presentational only, with no login, API, persistence, editing, or data-management behavior.
- Preserve the existing Settings layout, biometric state behavior, and authenticated tab navigation.

## Capabilities

### New Capabilities

- `profile-screen`: Present the designed authenticated profile page as a UI-only screen.

### Modified Capabilities

- `settings-screen`: Change the My Profile row from a no-op row to local navigation to the profile screen.

## Impact

- Add a profile screen module under `src/settings/screens`.
- Add a hidden authenticated profile route under `app/(closed)`.
- Update Settings and profile screen tests.
- Update the Settings capability contract with the new navigation behavior.
- No new dependencies, APIs, authentication changes, persistence, or backend systems.
