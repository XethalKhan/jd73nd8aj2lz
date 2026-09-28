## Context

See `proposal.md` for the motivation and `specs/my-cards-screen/spec.md` for
the observable contract. The current `app/(closed)/my-cards/index.tsx` is a
centered placeholder. The `src/cards/components` and `src/cards/screens`
directories are empty, while `src/components/Card.tsx` already provides the
responsive card artwork, dynamic detail overlay, optional branding, and
optional visual layers required by the design.

The app already loads the Poppins font family globally, uses Emotion Native
for screen styling, and provides Phosphor icons and safe-area primitives.
Figma MCP access was unavailable during discovery, so the checked-in
`MY_CARDS_SCREEN.svg` is the fallback visual authority.

## Goals / Non-Goals

**Goals:**

- Compose the reference screen from reusable screen-level primitives under
  `src/cards/screens`.
- Match the reference's header, card area, supporting copy, spending-limit
  panel, and static visual affordances.
- Keep the route thin and preserve the existing closed-area tab layout.
- Make the screen testable through semantic labels, text, and stable test IDs.
- Keep all displayed values local presentation fixtures with no business logic.

**Non-Goals:**

- Add card creation, editing, deletion, selection state, or carousel behavior.
- Add API integration, persistence, financial calculations, or card security
  behavior.
- Change `src/components/Card.tsx` or the existing tab-navigation contract
  unless a narrow integration adjustment is required.
- Add a new dependency or render the full-screen SVG as an opaque image.

## Decisions

### Keep the route as a thin adapter

The route at `app/(closed)/my-cards/index.tsx` will render a named
`MyCardsScreen` component from `src/cards/screens`. This matches the existing
pattern used by the settings screens and keeps screen composition separate from
Expo Router file conventions.

An alternative is to keep all markup in the route file. That is rejected
because the cards module is currently empty and the requested scope explicitly
places the work in `src/cards`; a screen module gives the UI a stable home and
keeps the route easy to test.

### Compose the screen with Emotion Native primitives

Use `SafeAreaView`, a scrollable content container where needed, and Emotion
Native styled primitives for spacing, typography, colors, rounded surfaces,
and the spending-limit track. Reuse the established color values such as
`#FFFFFF`, `#1E1E2D`, `#A2A2A7`, `#F4F4F4`, and `#0066FF`, adjusting only
where the SVG reference requires it.

A full-screen SVG `<Image>` or WebView is rejected because it would make the
copy and card content non-semantic, prevent reuse of `Card`, and scale poorly
outside the exact exported viewport.

### Use `Card` for the card artwork

Render `src/components/Card.tsx` with a local static card fixture matching the
reference. The screen owns only fixture data and placement; card artwork,
brand rendering, dynamic detail typography, and card proportions remain owned
by the shared component.

This avoids duplicating the component's SVG layers and keeps the screen
compatible with later data integration without changing its visual contract.

### Represent controls as visual affordances only

Use the existing Phosphor icon set and non-mutating touchable or view
primitives to reproduce the back, add, and card-switching affordances. Their
visual and accessibility labels should be stable, but they will not navigate,
mutate card state, or perform data work in this change. The existing bottom
tab navigation remains the only functional navigation in scope.

### Test behavior through semantic screen queries

Add a focused screen test under the cards module using React Native Testing
Library. Assert the designed title, important labels, spending-limit content,
shared card details, and stable affordance identifiers. Keep assertions about
layout limited to durable section styles or test IDs rather than brittle
pixel snapshots.

## Risks / Trade-offs

- **[Risk]** The exported SVG encodes much of its copy as paths, making exact
  text transcription difficult without Figma access. **Mitigation:** treat the
  supplied SVG and user-approved design as authoritative, avoid invented
  copy, and keep reference copy centralized in the screen fixture.
- **[Risk]** The existing `Card` component's internal ratio may differ from the
  card bounds in the full-screen export. **Mitigation:** place it in a
  constrained responsive wrapper and compare its landscape proportions against
  the reference during implementation validation.
- **[Risk]** Static financial-looking values could be mistaken for live data.
  **Mitigation:** keep the scope explicitly fixture-only and perform no data
  work or calculations.
- **[Risk]** Screen controls may suggest functionality that is not implemented.
  **Mitigation:** preserve the visual affordances but make their no-op scope
  explicit in accessibility and tests until a behavior change is separately
  specified.

## Migration Plan

1. Add the screen module and focused tests.
2. Replace the route placeholder with the screen component.
3. Run the focused tests, lint, and TypeScript validation, then visually
   compare the rendered screen with `MY_CARDS_SCREEN.svg`.
4. Roll back by restoring the placeholder route and removing the new screen
   module and tests; no persisted data or navigation migration is required.

## Open Questions

None. Figma access is optional because the checked-in SVG fallback and the
existing shared Card component define the implementation inputs.
