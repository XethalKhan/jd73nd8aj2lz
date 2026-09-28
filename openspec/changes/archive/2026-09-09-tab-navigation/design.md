## Context

The `(closed)` route group currently uses a headerless Expo Router stack with
one Home route and a nested onboarding flow. The project already loads the
Poppins font family globally, uses `@emotion/native` for screen styling, and
has `phosphor-react-native` installed. The proposal and
`specs/tab-navigation/spec.md` define the required destinations and visual
behavior.

## Goals / Non-Goals

**Goals:**

- Make the `(closed)` layout a four-destination bottom-tab container.
- Preserve the existing Home route and onboarding URLs.
- Match the Figma navigation's order, labels, outline icon language, colors,
  typography, and 86px bar height at the 375px reference width.
- Keep tab-specific implementation inside `app`.
- Provide lightweight placeholder content for the three new destinations.

**Non-Goals:**

- Implement card management, statistics calculations, or settings behavior.
- Add authentication, session persistence, or authorization logic.
- Move existing feature screens into `src` or introduce a tab module there.
- Add a new icon, styling, or navigation dependency.

## Decisions

### Use the JavaScript bottom-tab navigator in the closed layout

Configure the existing `app/(closed)/_layout.tsx` with Expo Router's
JavaScript bottom-tab navigator and declare the four direct destinations in
the required order. This uses the project's existing router and supports
custom active/inactive tint colors, labels, icons, and tab-bar styling.

The native tabs API was not selected because the Figma design requires
cross-platform control over the custom bar height, Poppins labels, Phosphor
icons, and exact tint colors. A custom navigator was also rejected because it
would duplicate routing behavior already supplied by Expo Router.

### Use existing route locations and a hidden onboarding entry

Keep Home at `app/(closed)/home.tsx` and add the three requested
`<destination>/index.tsx` files. Register the nested onboarding entry with the
tab layout but remove its tab button and hide the bar while onboarding is
active. This keeps the existing login and onboarding paths intact without
exposing onboarding as a primary destination.

The implementation must verify that navigating from onboarding 3 to Home
restores the visible bar and selects Home.

### Use Phosphor outline icons and shared tint configuration

Use the installed Phosphor icon family with house, credit-card, pie-chart, and
gear symbols. Configure the navigator's active tint to `#0066FF` and inactive
tint to `#8B8B94`, then provide each screen's icon through the tab icon
configuration so icon and label states remain synchronized.

Set the tab bar background to `#F4F4F4`, remove the default top border and
shadow treatment, and size the bar to the Figma frame. Use the globally loaded
Poppins fonts for labels. Account for platform safe-area behavior rather than
allowing the bar to clip the device inset.

### Keep placeholders deliberately minimal

The three new route screens will use the existing project's
`@emotion/native` styling conventions and render a centered destination title
with concise placeholder copy. They will not introduce reusable components or
feature modules until those destinations have real requirements.

## Risks / Trade-offs

- **[Risk]** Expo Router may treat the nested onboarding folder as a tab
  screen. **Mitigation:** explicitly register it as hidden and validate both
  direct onboarding URLs and tab selection behavior.
- **[Risk]** A fixed Figma-height bar can interact differently with iOS and
  Android safe areas. **Mitigation:** preserve the platform inset and verify
  the 375px portrait layout on the supported platforms.
- **[Risk]** Icon geometry may differ slightly from the outlined Figma paths.
  **Mitigation:** use the matching Phosphor outline symbols at the Figma icon
  size and compare a rendered screenshot against the supplied reference.

## Migration Plan

1. Update the closed route layout and add the three placeholder route files.
2. Run the existing unit tests and lint/type checks.
3. Manually verify login-to-onboarding-to-Home navigation and each tab.
4. If the tab layout causes a regression, restore the current Stack layout and
   remove the new placeholder routes as a single local rollback.
