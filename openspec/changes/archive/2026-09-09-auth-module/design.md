## Context

The current Expo Router app has an `(open)` route group with thin route files,
but Login and Create Account render a shared placeholder component. The
existing Welcome screen lives under `src/components`, while
`src/auth/screens` and the `(closed)` route group are empty. The project
already uses TypeScript, Emotion Native, React Native Paper, Expo Router,
Expo Image, and Jest with React Native Testing Library.

The supplied Figma frames define fixed reference coordinates at 375x812. They
use Poppins, locally rendered line icons, a white canvas, `#1E1E2D` primary
text, `#A2A2A7` supporting text, and `#06F` actions.

## Goals / Non-Goals

**Goals:**

- Make `src/auth/screens` the owner of the three unauthenticated auth-entry
  screen components.
- Preserve file-based routing through thin adapters in `app/(open)`.
- Reproduce the two supplied Figma frames with responsive portrait layout
  behavior.
- Keep Login submission deliberately unvalidated and route it to a minimal
  Home destination.
- Keep design assets and fonts local and deterministic.
- Cover screen rendering, accessibility, navigation, and Login submission
  with focused tests.

**Non-Goals:**

- No authentication provider, API client, session store, credential parser,
  validation, persistence, or account creation workflow.
- No implementation of the broader authenticated banking experience.
- No runtime dependency on temporary Figma asset URLs.

## Decisions

### Keep route adapters separate from auth screen components

Move the existing Welcome screen into `src/auth/screens/WelcomeScreen.tsx`
and add `LoginScreen.tsx` and `SignUpScreen.tsx` beside it. Each existing
`app/(open)` route remains a small default-export adapter. This preserves Expo
Router's file-based contract while making the module boundary explicit.

Alternative considered: putting all screen implementations directly in
`app/(open)`. This would satisfy routing but would not meet the requested
module ownership or make the auth screens easy to reuse and test together.

### Use a shared auth visual system without adding a second styling library

Create shared Emotion Native primitives for the auth canvas, back control,
field rows, icon slots, footer copy, and primary button. Use the existing
project styling convention and React Native Paper where it fits the control
semantics, while allowing the surrounding Emotion styles to control the exact
Figma dimensions and spacing.

Alternative considered: adding Tailwind or a new UI kit. The project already
has the required styling and component dependencies, and another styling
system would increase maintenance cost.

### Bundle Poppins and Figma-derived SVG icons locally

Add the required Poppins font files to project assets and load them from the
root Expo layout with `expo-font`. Check in the exported Figma line-icon SVGs
for the back, email, phone, lock, eye, and status treatments, then reference
them locally through Expo Image or the existing SVG-capable asset path.

Alternative considered: use platform fonts and Phosphor icons. Those assets
are available in the project, but their glyph metrics and paths would not be
exact matches for the referenced frames.

### Use controlled fields only for local display state

Each field will use local React state so the controls behave like text inputs
and support accessibility. Login submission will ignore the values and call
the router replacement to the `(closed)` Home route. Sign Up's submit control
will remain a visual screen control because no account-creation behavior was
specified.

Alternative considered: uncontrolled inputs or a form library. They add no
value while the values are explicitly not validated, parsed, submitted, or
persisted.

### Add a minimal closed-area Home route

Create a minimal Home screen under `app/(closed)` solely as the destination
for Login submission. Login will replace the current route rather than push a
new one, preventing a successful screen-only submission from leaving Login on
the back stack. The Home screen is outside the auth module.

Alternative considered: route to an unimplemented path. That would make the
required interaction observably fail and would leave the router without a
destination.

### Keep the reference layout responsive

Use safe-area-aware containers with horizontal padding matching the 20px Figma
inset, flex or bounded spacing for field groups, and a scrollable fallback for
short portrait viewports. The 375x812 layout remains the visual calibration
target, while the implementation avoids horizontal clipping on supported
portrait sizes.

## Risks / Trade-offs

- [Risk] Bundled font files increase app asset size. -> Mitigation: include
  only the Poppins weights used by headings, labels, body copy, and buttons.
- [Risk] Exported Figma SVGs may contain web-specific markup or unsupported
  features. -> Mitigation: normalize each asset to a local SVG supported by
  the existing Expo asset pipeline and verify it on native and test renders.
- [Risk] Absolute reference coordinates can clip on smaller devices. ->
  Mitigation: calibrate against 375x812 but use safe-area and scroll behavior
  for other portrait heights.
- [Risk] A minimal Home route could be mistaken for a completed authenticated
  experience. -> Mitigation: keep it visibly minimal and document it as a
  routing placeholder with no session state.
- [Risk] Exact Figma footer text has unusual action labels (`Sign In` on the
  Login footer and `Sign Up` on the Sign Up footer). -> Mitigation: preserve
  the supplied copy exactly and do not infer extra navigation behavior.

## Migration Plan

1. Add local Poppins and icon assets.
2. Add root font loading and the shared auth visual primitives.
3. Move and update the three auth screen components and their tests.
4. Replace the open-route placeholders with adapters and add the closed Home
   route.
5. Run focused Jest tests, TypeScript validation, lint, and visual/manual
   checks at the 375x812 reference size.
6. Rollback by removing the new auth screen implementations, assets, font
   loading, and closed placeholder route; no persisted data migration is
   required.
