## Context

The existing Settings screen is implemented in `src/settings/screens/SettingsScreen.tsx` and is exposed through the authenticated `app/(closed)/settings` tab route. It uses `@emotion/native`, `SafeAreaView`, Poppins fonts loaded by the root layout, and Phosphor icons. The authenticated area owns a visible bottom tab bar.

The profile reference is a 375x812 white mobile layout with no visible bottom tab bar. It contains a compact header, a static avatar and account summary, and seven icon-and-chevron rows separated by light rules. The requested behavior is UI-only.

## Goals / Non-Goals

**Goals:**

- Add a reusable Profile screen in the existing Settings source module.
- Match the reference layout using the existing fonts, colors, spacing conventions, and icon library.
- Open Profile from Settings and return with the profile back control.
- Keep the profile route hidden from tab selection and hide the authenticated tab bar while Profile is active.
- Cover rendering and navigation behavior with focused tests.

**Non-Goals:**

- Do not add authentication, account fetching, editing, persistence, notifications, or API calls.
- Do not make profile rows or the edit action functional.
- Do not add dependencies or replace the existing Settings/tab navigation architecture.

## Decisions

### Keep the screen in the Settings module

Implement `ProfileScreen` under `src/settings/screens` and keep the route file as a thin adapter. This preserves the requested Settings module boundary and follows the existing screen-module organization.

### Use a hidden sibling route for the profile page

Add `app/(closed)/profile.tsx` and register it in the authenticated Tabs layout with no tab link and a hidden tab bar style. The Settings row will push this route, and Profile will use back navigation to return to Settings.

This is preferred over `app/(closed)/settings/profile.tsx` because a nested child of the Settings tab would normally retain the bottom tab chrome, which is not present in the reference. A hidden sibling route also keeps the route transition explicit and avoids changing the existing Settings tab structure.

### Build the page from existing primitives

Use Emotion-native styled primitives with `SafeAreaView`, a scrollable content container, Poppins font families, the existing `#1E1E2D`, `#7E848D`, `#A2A2A7`, `#F4F4F4`, and white palette, and Phosphor icons. Render the avatar, account summary, seven static rows, chevrons, separators, and the notifications badge as presentational elements.

The rows will use the visible profile categories from the reference in order: personal information, payment methods, password, notifications, contact, location, and settings. Labels and casing should be copied exactly from the reference during implementation.

### Keep all profile actions local

Only the header back control calls the router. The edit/profile action and every profile row remain pressable for accessibility but have no handlers with side effects. Account content and the notification count are static placeholders.

### Test at the screen-module boundary

Add Profile screen tests that assert the header, account summary, row labels, notification badge, back navigation, and no-op profile actions. Update Settings tests so pressing My Profile calls the router push for the hidden profile route while the existing no-op rows and biometric behavior remain unchanged.

## Risks / Trade-offs

- [Risk] Static account copy can diverge from future real account data → Mitigation: keep the copy localized to the screen and explicitly exclude data integration from this change.
- [Risk] Hiding the tab bar through a sibling route can regress tab configuration if the route is registered incorrectly → Mitigation: add a navigation test that asserts Profile is not a selectable tab and the existing four tabs remain unchanged.
- [Risk] Phosphor glyphs may differ slightly from the reference exports → Mitigation: match icon family, size, stroke weight, tint, and touch-area placement using the existing dependency.
- [Risk] The reference is a fixed mobile canvas while devices vary in height → Mitigation: use safe-area-aware layout and flexible scrollable content rather than absolute positioning.

## Migration Plan

1. Add the Profile screen module and hidden authenticated route.
2. Register the hidden route without changing the four visible tab destinations.
3. Change only the Settings My Profile row to push Profile.
4. Add or update focused tests and run the relevant Jest and Expo lint checks.
5. Roll back by removing the profile route/module and restoring the My Profile no-op handler.
