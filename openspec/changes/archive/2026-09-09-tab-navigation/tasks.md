## 1. Configure the closed-area navigator

- [x] 1.1 Replace the headerless `(closed)` Stack layout with the Expo Router
  JavaScript bottom-tab layout, declare Home, My Cards, Statistics, and
  Settings in that order, and verify the four tab route names resolve to the
  requested paths.
- [x] 1.2 Register the nested onboarding flow as a non-selectable route and
  hide the tab bar while onboarding is active; verify Login still reaches
  onboarding 1, onboarding 3 still replaces the route with Home, and Home
  restores as the active tab.

## 2. Add placeholder destination screens

- [x] 2.1 Add `app/(closed)/my-cards/index.tsx` with a centered My Cards
  placeholder using the project's `@emotion/native` and Poppins conventions,
  and verify the screen renders the `My Cards` destination name.
- [x] 2.2 Add `app/(closed)/statistics/index.tsx` with a centered Statistics
  placeholder using the project's `@emotion/native` and Poppins conventions,
  and verify the screen renders the `Statistics` destination name.
- [x] 2.3 Add `app/(closed)/settings/index.tsx` with a centered Settings
  placeholder using the project's `@emotion/native` and Poppins conventions,
  and verify the screen renders the `Settings` destination name.

## 3. Match the Figma navigation

- [x] 3.1 Configure the tab bar with the supplied `#F4F4F4` background,
  approximately 86px Figma height with platform safe-area handling, no
  unwanted border or shadow, Poppins labels, and `#0066FF` active versus
  `#8B8B94` inactive tinting; verify the rendered bar at a 375px-wide
  portrait viewport.
- [x] 3.2 Add the installed Phosphor outline icons for Home, My Cards,
  Statistics, and Settings at the Figma proportions, and verify each icon
  changes color with its corresponding label when the tab is selected.

## 4. Validate the complete flow

- [x] 4.1 Add or update focused tests for the three placeholder screens and
  tab-related route behavior, and verify the relevant Jest tests pass.
- [x] 4.2 Run the project's lint and TypeScript checks, then manually verify
  login-to-onboarding-to-Home navigation plus switching across all four tabs
  without route or layout regressions.
