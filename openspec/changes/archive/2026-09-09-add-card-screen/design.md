## Context

See `proposal.md` for the motivation and
`specs/add-card-screen/spec.md` for the new observable contract. The project
already has a cards screen module, a shared `src/components/Card.tsx`, a
nested Settings Stack, Poppins fonts loaded by the root layout, Emotion Native
styling, Phosphor icons, and focused Jest tests. The existing My Cards and
List Cards add-card controls are presentational no-ops.

The supplied `ADD_CARD_SCREEN.svg` is a 375x812 reference whose card bounds
are approximately 335x199 at x=20/y=128. Much of the SVG is flattened into a
raster layer, so native semantic controls should reproduce the visible
composition instead of rendering the full SVG as an opaque image.

## Goals / Non-Goals

**Goals:**

- Keep screen composition in `src/cards/screens` and keep the Expo Router
  route adapter thin.
- Reproduce the reference header, shared card preview, form spacing,
  typography, colors, separators, and reordered field layout.
- Keep field values local so editing immediately updates the shared card
  preview.
- Make both existing add-card affordances request the nested Add Card route.
- Hide the authenticated tab bar while Add Card is focused and restore it
  when leaving the route.
- Cover screen behavior and both navigation entry points with focused tests.

**Non-Goals:**

- Do not change the public API or artwork implementation of `Card.tsx`.
- Do not add validation, card-brand detection, secure storage, submission,
  persistence, API calls, or payment-service integration.
- Do not add a new tab or replace the existing Settings > My Profile > Banks
  and Cards navigation path.
- Do not render the supplied full-screen SVG as the screen implementation.

## Decisions

### Keep the implementation in the cards screen module

Implement `AddCardScreen` in `src/cards/screens/AddCardScreen.tsx` and render
it from `app/(closed)/add-card.tsx`. This keeps the route adapter separate from
`ListCardsScreen` and `MyCardsScreen` organization and keeps route wiring
separate from presentational code.

Keeping the full screen in the route file is rejected because it would diverge
from the existing cards module pattern and make the form harder to test.

### Use the existing nested Settings Stack

Keep `app/(closed)/settings/_layout.tsx` as the headerless Stack boundary, but
register Add Card as a hidden sibling route in `app/(closed)/_layout.tsx`.
This keeps Add Card out of the Settings stack so returning from it cannot leave
the Settings tab focused on Add Card.

Registering Add Card as a selectable top-level tab is rejected because the
reference has no bottom tab bar and the route belongs to the Settings flow.

### Compose the visual layout with Emotion Native primitives

Use a safe-area-aware white screen, a header with a 42px circular back
control, and a scrollable content area with 20px horizontal margins. Place the
shared card preview at the reference position, then render the fields in this
order:

```text
Cardholder Name
Card Number
Expiry Date        CVV
```

Use styled native `TextInput` controls with local state, muted field labels,
light separators, and Poppins typography. This preserves accessibility and
allows the card preview to reflect edits without introducing business logic.

An opaque SVG or raster image is rejected because it would prevent editable
fields, semantic queries, and reuse of `Card.tsx`.

### Reuse the shared Card preview with static initial values

Initialize the form with local fixture values and pass the state values to
`Card`. Use the existing card brand and optional visual layers that best match
the reference. The screen owns placement and fixture state only; artwork,
network branding, and card detail rendering remain in `Card.tsx`.

Changing the shared card aspect ratio is rejected for this change. The
reference is approximately 335x199 while `Card.tsx` uses 348/199, so the
shared preview may be slightly shorter when constrained to the reference
width. Preserving one reusable card treatment is the safer scope.

### Navigate from both existing add-card controls

Add `useRouter` handlers to `MyCardsScreen` and `ListCardsScreen` so their
existing plus controls call `router.push("/add-card")`. Keep the
ellipsis and unrelated controls unchanged. Preserve the existing
Settings > My Profile > Banks and Cards route to List Cards.

Using a separate route for each entry point is rejected because both actions
open the same Add Card screen and would duplicate route state.

### Test behavior at screen and route boundaries

Add focused tests for:

- Add Card title, fields, initial preview values, reordered sections, editing,
  and back navigation.
- My Cards plus navigation to `/add-card`.
- List Cards Add New Card navigation to `/add-card`, while the
  ellipsis remains inert.
- Closed-area route rendering and hidden tab-bar behavior for Add Card.

Prefer semantic labels and stable test IDs over pixel snapshots. Use visual
comparison against the supplied reference during implementation validation.

## Risks / Trade-offs

- **[Risk]** The shared Card ratio differs from the reference bounds.
  **Mitigation:** constrain the shared component to the reference width and
  avoid duplicating or changing its artwork in this scope.
- **[Risk]** Keyboard appearance can reduce the visible 812px composition.
  **Mitigation:** keep content scrollable and use native inputs without adding
  behavior beyond local editing.
- **[Risk]** The flattened SVG makes exact fixture text difficult to recover.
  **Mitigation:** use the established cards-module fixture style and keep
  initial values local and explicitly presentation-only.
- **[Risk]** Parent tab-bar options could leak after leaving Add Card.
  **Mitigation:** set the parent tab-bar style on focus and restore it in the
  focus cleanup callback, with route-level test coverage.

## Migration Plan

1. Add the Add Card screen module and nested route adapter.
2. Add focus-aware tab-bar handling for the new route.
3. Connect the My Cards plus and List Cards Add New Card controls.
4. Add focused screen, navigation, and route tests.
5. Run the relevant Jest, lint, TypeScript, and 375x812 visual checks.

Rollback is limited to removing the new route and screen module, restoring the
two existing controls to no-ops, and removing the associated tests. No data
or migration rollback is required.
