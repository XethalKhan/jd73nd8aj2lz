## Context

The project is an Expo 56 TypeScript app using Expo Router, `@emotion/native`,
`expo-image`, Poppins fonts loaded by the root layout, Jest, and React Native
Testing Library. The authenticated route group is `app/(closed)`, and its
current Home screen is a placeholder. The three onboarding SVGs already exist
under `assets/images` and are sized for the supplied 375x812 Figma frames.

## Goals / Non-Goals

**Goals:**

- Keep onboarding screens in a focused `src/onboarding` module with only the
  three user-facing screens.
- Reuse one presentational screen shell and per-screen content configuration
  without changing the visual output.
- Calibrate the layout to the Figma reference while remaining usable on
  supported portrait heights.
- Keep route adapters thin and keep navigation behavior testable.

**Non-Goals:**

- Add authentication state, onboarding completion persistence, API calls, or
  analytics.
- Add a new navigation library, image dependency, or design-system layer.
- Build or change the Home experience beyond its existing route destination.

## Decisions

### Use one shared screen shell with three screen configurations

Create a shared onboarding presentation component that receives the local
illustration, heading, supporting copy, active pagination index, and next
handler. Expose three screen components from `src/onboarding/screens`, one for
each Figma frame, so the module contains exactly the requested screens while
keeping layout and accessibility behavior consistent.

Alternative considered: three independent layouts. This would make small
spacing or typography changes drift between screens and duplicate the same
button, indicator, and safe-area behavior.

### Use local SVGs through the existing Expo image path

Each screen will reference its corresponding checked-in SVG with the same local
asset pattern already used by the Welcome and auth screens. No temporary Figma
URLs or generated fragment assets will be used at runtime.

Alternative considered: reproduce the illustrations with React Native shapes.
That would not meet the exact-visual requirement and would unnecessarily
duplicate the supplied artwork.

### Keep routing in the existing closed route group

Add thin route adapters under `app/(closed)/onboarding`, with one route for
each onboarding screen. Login will replace its current Home destination with
Onboarding 1. Onboarding 1 and 2 will advance to the next screen, and
Onboarding 3 will replace the flow with `/(closed)/home`, preventing a
completed onboarding flow from remaining on the active stack.

Alternative considered: a single route with local page state. Separate
file-based routes match the project's existing Expo Router structure, make each
screen directly testable, and preserve normal back behavior during the flow.

### Calibrate the visual layout at 375x812

Use the existing Poppins font families, white safe-area-aware canvas, 20px
horizontal inset, absolute or bounded illustration placement matching each
reference frame, the shared 335x56 blue button with a 16px radius, and shared
pagination and text styles. Use layout constraints that preserve the same
hierarchy on taller or shorter portrait screens without horizontal clipping.

### Test behavior and visual contract at the screen level

Add focused tests for each screen's exact visible copy, illustration source,
pagination state, accessible `Next` action, and navigation destination. Update
the Login screen test to assert the new first-onboarding replacement route.
Visual verification should use the 375x812 reference viewport and confirm the
three local SVGs render without remote dependencies.

## Risks / Trade-offs

- [Risk] Safe-area insets can shift the fixed Figma coordinates on native
  devices. -> Mitigation: calibrate against the existing device frame and use
  bounded layout regions so content remains visible on supported portrait
  sizes.
- [Risk] SVG rendering can differ between native and Jest environments. ->
  Mitigation: keep the existing `expo-image` asset approach, mock image
  rendering in unit tests, and perform a native or web visual smoke check.
- [Risk] Misspelled copy in the reference may be “corrected” accidentally. ->
  Mitigation: treat the supplied Figma strings as the contract and test them
  exactly.
- [Risk] Screen-only Login has no real session gate. -> Mitigation: keep the
  transition explicitly presentation-only and leave authentication state out
  of this change.

## Migration Plan

1. Add the shared onboarding shell and the three screen components.
2. Add the three closed-area route adapters and update Login's replacement
   destination.
3. Add focused screen and navigation tests.
4. Run TypeScript, lint, Jest, and a 375x812 visual smoke check.
5. Roll back by removing the onboarding routes/components/tests and restoring
   Login's existing Home replacement; no persisted data migration is needed.
