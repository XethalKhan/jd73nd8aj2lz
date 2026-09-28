## Why

The authenticated area currently exposes a placeholder Settings route, so users do not have the preferences screen defined in the product design. This change adds the designed Settings presentation now while keeping behavior intentionally limited to navigation back and a local biometric switch.

## What Changes

- Add a Settings screen matching the referenced Figma design.
- Present General and Security sections with language, profile, contact, password, privacy, and biometric rows.
- Make the top-left back button navigate back.
- Keep the top-right Log out button and all settings rows except the biometric switch non-functional.
- Make the biometric switch interactive with local UI state only.
- Replace the current Settings route placeholder with the new screen component.

## Capabilities

### New Capabilities

- `settings-screen`: Display the designed Settings screen and its explicitly limited local interactions.

### Modified Capabilities

None.

## Impact

- Affected route: `app/(closed)/settings/index.tsx`.
- New screen module under `src/settings/screens`.
- New or focused React Native tests for rendering and the allowed interactions.
- No API, persistence, authentication, logout, or external-service changes.
