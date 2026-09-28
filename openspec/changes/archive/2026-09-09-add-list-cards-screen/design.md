## Context

See `proposal.md` for the motivation and `specs/list-cards-screen/spec.md`
for the observable contract. The project already has a shared
`src/components/Card.tsx`, Poppins fonts loaded by the root layout, Emotion
Native styling, Phosphor icons, and a cards screen module containing the
presentational `MyCardsScreen`.

The requested route is nested at
`app/(closed)/settings/list-cards.tsx`, while the current authenticated shell
is a Tabs layout and the current Settings route is only an `index.tsx`. The
reference has no visible bottom tab bar, so the nested Settings route needs a
local navigation boundary and focused tab-bar handling.

## Goals / Non-Goals

**Goals:**

- Compose the reference from semantic native views and the reusable Card
  component rather than rendering the SVG as an opaque image.
- Keep the nested Settings route thin and keep screen composition under
  `src/cards/screens`.
- Preserve the exact visual affordances from the reference while limiting
  behavior to back navigation.
- Keep all card values and labels local to the screen as presentation fixtures.
- Cover screen rendering, back navigation, no-op affordances, and Profile
  navigation with focused tests.

**Non-Goals:**

- Do not add card selection, editing, creation, deletion, validation,
  persistence, API calls, or payment processing.
- Do not change the shared Card component's public API unless visual
  integration exposes a narrowly scoped defect.
- Do not add a competing tab bar or new card-management navigation.

## Decisions

### Keep the screen in the cards module

Implement `ListCardsScreen` under `src/cards/screens` and keep
`app/(closed)/settings/list-cards.tsx` as a route adapter. This follows the
existing screen-module pattern and keeps the route-specific Expo Router code
small.

Keeping the implementation in `app/(closed)/settings/list-cards.tsx` is
rejected because it would make the screen harder to test and would mix route
configuration with the cards presentation.

### Add a nested Settings stack boundary

Add the minimum Settings layout needed for the nested route to render as a
child of the Settings tab with headers disabled. Configure the List Cards
screen to hide the parent tab bar while focused, restoring the normal Settings
tab-bar presentation when it loses focus. The route remains exactly
`/settings/list-cards`, and the existing Settings index remains the tab's
default screen.

Using a root-level sibling route is rejected because the requested route is
explicitly nested under Settings. Leaving the default tab bar visible is
rejected because it would conflict with the supplied 812px reference.

### Use shared Card instances with local fixtures

Render two responsive `Card` instances in fixed-width slots matching the
reference's horizontal margins and vertical placement. Supply static fixtures
for each card's number, name, expiry, CVV, brand, and optional contactless
layer. Keep the card artwork and network logos owned by `Card.tsx`; the List
Cards screen owns only placement and fixture data.

Rendering the checked-in SVG as an image is rejected because it would bypass
the shared Card component, make content non-semantic, and couple the screen to
one viewport.

### Use presentational controls with semantic labels

Build the circular back control, blue ellipsis control, and bottom add-card
control with existing Phosphor icons and Emotion Native primitives. Only the
back control calls the router. The ellipsis and add-card controls remain
pressable no-ops with stable accessibility labels and test IDs.

### Test behavior at the screen boundary

Add a focused `ListCardsScreen.test.tsx` asserting the reference title,
fixtures, both shared card instances, the blue ellipsis, the add-card
affordance, back navigation, and no-op actions. Extend Profile tests to assert
that Banks and Cards requests `/settings/list-cards` while the other
non-functional rows remain unchanged.

## Risks / Trade-offs

- **[Risk]** The shared Card aspect ratio is 348:199 while the exported
  reference card bounds are approximately 335:199. **Mitigation:** use the
  shared component without duplicating its artwork, constrain placement to the
  reference width, and validate the rendered result at the supplied viewport.
- **[Risk]** Nested Expo Router tab-bar options can leak between Settings child
  screens. **Mitigation:** apply the hide/show behavior on List Cards focus
  transitions and add a navigation-level assertion for the nested route.
- **[Risk]** The SVG encodes much of its text as paths rather than semantic
  text. **Mitigation:** centralize the approved static fixture copy and
  compare the screen visually against the supplied reference during
  implementation validation.
- **[Risk]** Visual controls imply unimplemented card operations. **Mitigation:**
  keep their handlers explicitly inert and cover that behavior in tests.

## Migration Plan

1. Add the nested Settings layout and thin List Cards route adapter.
2. Add the `ListCardsScreen` composition and focused screen tests.
3. Update the Profile Banks and Cards row and its navigation test.
4. Run focused Jest tests, TypeScript/lint checks, and a reference-viewport
   visual comparison.
5. Roll back by removing the nested route/layout and screen module, then
   restoring the Profile row's no-op handler. No persisted data migration is
   required.
