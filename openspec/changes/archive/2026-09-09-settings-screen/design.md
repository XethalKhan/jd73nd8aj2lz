## Context

The Settings route currently renders a centered placeholder. The closed area already uses Expo Router tabs, Poppins fonts loaded by the root layout, `@emotion/native` for styling, and `phosphor-react-native` for tab icons. The target design is a 375x812 portrait mobile screen whose content sits above the existing authenticated tab bar.

## Goals / Non-Goals

**Goals:**

- Add a reusable Settings screen component under `src/settings/screens`.
- Match the Figma spacing, typography, colors, section hierarchy, row separators, header controls, and bottom-tab presentation.
- Keep the only behaviors to back navigation and local biometric state.
- Preserve the existing route and closed-area tab structure.

**Non-Goals:**

- Implement authentication, logout, profile, language, contact, password, privacy, or biometric functionality.
- Add persistence, networking, analytics, or new dependencies.
- Change the shared closed-area tab navigation.

## Decisions

### Screen component plus route adapter

The UI will live in `src/settings/screens/SettingsScreen.tsx`, while `app/(closed)/settings/index.tsx` will remain a thin route entry point. This follows the requested settings module boundary and keeps route wiring separate from screen presentation. An alternative would be to keep the entire screen in the route file, but that would diverge from the existing auth and onboarding screen organization.

### Emotion-native primitives and existing design tokens

The screen will use `@emotion/native` styled primitives, the loaded Poppins font families, and the existing dark, muted, white, and blue palette. This matches the project convention and avoids introducing a second styling system. React Native `StyleSheet` or Tailwind would be inconsistent with the current codebase.

### Local state for the biometric control

The biometric control will use component-local state solely to render its toggled appearance. The other controls will be pressable only where required for accessibility, with no callbacks beyond the back action. A persisted store or native biometric integration is deliberately excluded because the requested screen is UI-only.

### Icon implementation

Use the project's existing icon assets or `phosphor-react-native` icons for the back, logout, and chevron affordances, selecting weights and sizes that match the Figma reference. This avoids adding image assets or dependencies. The existing bottom tab bar remains owned by the closed layout rather than being duplicated inside the screen.

## Risks / Trade-offs

- [Risk] Small differences between available icon glyphs and the Figma export may remain → Mitigate by matching the reference dimensions, stroke weight, tint, and touch-area placement.
- [Risk] The Settings screen may be rendered at different device heights → Use safe-area-aware layout and flexible content rather than fixed absolute positioning.
- [Risk] Existing placeholder-focused tests may assert only the old copy → Update or supplement tests to assert the designed labels and requested interactions.

## Migration Plan

Replace the Settings route placeholder with the new screen component, add focused screen tests, and run the existing lint and Jest checks. Rollback is a route-level revert that restores the current placeholder.
