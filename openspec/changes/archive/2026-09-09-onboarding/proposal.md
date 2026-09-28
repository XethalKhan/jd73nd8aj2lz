## Why

The authenticated flow currently sends a successful screen-only login directly
to a placeholder Home screen. The product needs the three supplied onboarding
screens between Login and Home so new users see the intended banking
introduction before entering the authenticated area.

## What Changes

- Add a three-screen onboarding flow using the supplied local SVG illustrations
  and the exact copy, typography, colors, spacing, pagination indicators, and
  button treatment from the referenced Figma frames.
- Add reusable onboarding screen components under `src/onboarding/screens`.
- Add Expo Router routes under `app/(closed)/onboarding`.
- Navigate from Onboarding 1 to 2, 2 to 3, and 3 to the existing Home route
  through the `Next` button.
- Change screen-only Login submission to replace the current route with
  Onboarding 1 instead of Home.
- Keep the flow presentation-only, with no API calls, authentication state,
  persistence, validation, integrations, or additional banking functionality.

## Capabilities

### New Capabilities

- `onboarding-flow`: Provides the three-screen post-login onboarding experience
  and its navigation to Home.

### Modified Capabilities

- `welcome-auth-entry`: Changes the screen-only Login submission destination
  from Home to the first onboarding screen while preserving the no-validation,
  no-backend behavior.

## Impact

- Affected Expo Router files under `app/(closed)` and the Login screen under
  `src/auth/screens`.
- New onboarding screen components and focused screen/navigation tests under
  `src/onboarding`.
- Existing local assets under `assets/images/onboarding1.svg`,
  `onboarding2.svg`, and `onboarding3.svg`.
- No API contracts, external dependencies, persistence, or data migrations.
