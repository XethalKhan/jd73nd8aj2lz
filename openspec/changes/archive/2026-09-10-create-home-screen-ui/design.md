## Context

The current `app/(closed)/home.tsx` route renders only a centered placeholder.
The repository already provides Emotion Native styling, loaded Poppins font
faces, Phosphor icons, safe-area handling, and the shared
`src/components/Card.tsx`. The existing `(closed)` layout owns the bottom tab
bar, so the Home route must not reproduce the tab bar from the SVG reference.

## Goals / Non-Goals

**Goals:**

- Recreate the visible Home Screen composition from `HOME_SCREEN.svg` at the
  existing Home route.
- Keep layout responsive to the available width while preserving the reference
  spacing and proportions.
- Use the shared payment-card component and existing project primitives.
- Keep the four payment actions pressable but behaviorless.
- Keep all content local and static.

**Non-Goals:**

- Implement navigation destinations for the four actions.
- Add payment, balance, transaction, validation, API, or persistence logic.
- Change the authenticated tab layout or any existing card behavior.
- Import or render the SVG as a full-screen image, since it includes the tab
  bar and embedded raster data that should not become runtime UI.

## Decisions

1. **Render the composition through the existing Home route.**
   Keep `app/(closed)/home.tsx` as the route entry point, but place the
   implementation in `src/home/screens/HomeScreen.tsx` to match the
   repository's screen-module convention. The route remains focused on Expo
   Router integration while the screen and its unit test stay together.

2. **Use Emotion Native styled primitives.**
   Define the screen sections with the repository's established
   `@emotion/native` pattern rather than introducing React Native StyleSheet
   objects. This keeps typography and spacing consistent with the neighboring
   screens.

3. **Reuse `Card` with static fixture data.**
   Render `Card` inside a responsive full-width slot using static details
   already compatible with the shared component. This preserves the existing
   card artwork, brand treatment, contactless layer, and accessibility
   semantics without duplicating card rendering.

4. **Use Phosphor icons for the action and summary artwork.**
   Recreate the SVG's action icons with the existing icon dependency, using
   circular light-gray icon surfaces and the established dark, blue, green, and
   red accents. This avoids a new icon asset pipeline while preserving the
   visual intent.

5. **Use no-op `Pressable` handlers.**
   The four action controls will expose button semantics and stable labels but
   use no-op handlers. This satisfies the requested clickability without
   implying a transaction or navigation contract.

6. **Keep content scrollable above the tab bar.**
   Place the Home content in a safe-area-aware vertical container with a
   scrollable content region. The reference is sized for a 375×812 viewport,
   but scrolling prevents lower static content from being hidden on shorter
   devices while the tab bar remains owned by the parent layout.

## Risks / Trade-offs

- [Risk] Vectorized text and embedded artwork in the SVG do not map directly to
  runtime React Native assets. → Recreate text, surfaces, and icons as native
  elements, using the SVG's measured geometry and the repository's existing
  font and color conventions.
- [Risk] Static content can drift from future banking data requirements. →
  Keep fixture values localized to the Home route and explicitly exclude data
  integration from this change.
- [Risk] The bottom tab bar is overlaid by the parent layout. → Reserve
  bottom content space and validate the composition on the target viewport so
  the final Home content is not obscured.
