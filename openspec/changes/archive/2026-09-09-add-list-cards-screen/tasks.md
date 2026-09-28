## 1. Nested Settings route

- [x] 1.1 Add the nested Settings navigation boundary and route adapter for `app/(closed)/settings/list-cards.tsx`, disable headers, and verify the route resolves to the List Cards screen without changing the Settings index route.
- [x] 1.2 Hide the authenticated tab bar while the nested List Cards route is focused and restore the normal Settings tab presentation when it is not focused; verify the existing visible tabs remain unchanged.

## 2. List Cards presentation

- [x] 2.1 Create `src/cards/screens/ListCardsScreen.tsx` with Emotion Native primitives matching the supplied 375x812 reference header, spacing, colors, typography, circular back control, blue ellipsis, and bottom add-card affordance; verify the screen stays within horizontal bounds.
- [x] 2.2 Add two local static card fixtures and render both payment cards through `src/components/Card.tsx`, including the reference card details, brands, and optional visual layers; verify both shared card instances and their visible fixture values render.
- [x] 2.3 Keep only the top-left back control functional and make the ellipsis and add-card controls inert with stable accessibility labels and test IDs; verify pressing non-navigation controls causes no router call or state change.

## 3. Profile navigation

- [x] 3.1 Update the Profile Banks and Cards row to request navigation to `/settings/list-cards` while preserving all other Profile row behavior; verify the focused Profile navigation test covers the new destination and existing no-op rows.

## 4. Tests and validation

- [x] 4.1 Add `ListCardsScreen.test.tsx` coverage for reference copy, two shared payment cards, controls, back navigation, and inert affordances; verify the focused screen test passes.
- [x] 4.2 Run the Profile and List Cards focused Jest tests, TypeScript/lint checks, and the full Jest suite; verify no existing screen or navigation tests regress.
- [x] 4.3 Compare the rendered screen at a 375x812-style portrait viewport against `LIST_CARDS_SCREEN.svg`, including card placement, shared Card proportions, colors, and tab-bar visibility; record and fix any in-scope visual mismatch.
