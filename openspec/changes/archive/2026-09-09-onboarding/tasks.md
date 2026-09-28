## 1. Onboarding Module

- [x] 1.1 Create the shared onboarding screen shell and three screen components under `src/onboarding/screens`, using the existing Poppins fonts, `@emotion/native`, safe-area layout, and exact Figma copy; verify each component renders its required heading and supporting text.
- [x] 1.2 Connect `onboarding1.svg`, `onboarding2.svg`, and `onboarding3.svg` as local illustration assets with the required pagination state and button styling; verify no onboarding screen references a remote Figma asset URL.
- [x] 1.3 Calibrate the shared and per-screen layout against the 375x812 Figma frames, including the 20px inset, illustration placement, text positions, indicators, and 335x56 rounded button; verify the three screens remain usable without horizontal clipping on supported portrait sizes.

## 2. Closed-Area Navigation

- [x] 2.1 Add thin Expo Router adapters under `app/(closed)/onboarding` for Onboarding 1, Onboarding 2, and Onboarding 3; verify each route resolves independently with headers hidden.
- [x] 2.2 Wire Login submission to replace the current Home destination with `/(closed)/onboarding/1`, then wire `Next` from screens 1 and 2 to the next screen and screen 3 to `/(closed)/home`; verify the complete route sequence with navigation tests.

## 3. Tests and Validation

- [x] 3.1 Add focused onboarding screen tests for exact visible copy, local illustration usage, active pagination state, accessible `Next` action, and each navigation destination; verify the new tests pass with Jest and React Native Testing Library.
- [x] 3.2 Update the Login screen test for the first-onboarding replacement route while preserving arbitrary-value, no-validation behavior; verify the auth test suite passes.
- [x] 3.3 Run TypeScript validation, lint, the focused Jest suites, and a 375x812 visual smoke check; verify the final onboarding flow reaches the existing Home screen without API calls or persistence.
