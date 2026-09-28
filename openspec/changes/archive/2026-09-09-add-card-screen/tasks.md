## 1. Add Card route and screen foundation

- [x] 1.1 Add `app/(closed)/add-card.tsx` as a thin hidden sibling route adapter
  for `AddCardScreen`, and verify it renders outside the nested Settings Stack.
- [x] 1.2 Create `src/cards/screens/AddCardScreen.tsx` with the safe-area
  screen shell, centered `Add New Card` header, circular back control,
  scrollable content, and reference margins/colors; verify the screen renders
  without placeholder copy.

## 2. Add Card visual form

- [x] 2.1 Render the shared `Card` component with local initial fixtures in a
  reference-sized card slot; verify the card preview exposes the expected
  number, cardholder, expiry, CVV, and network presentation.
- [x] 2.2 Add local state and accessible inputs for Cardholder Name, Card
  Number, Expiry Date, and CVV using Emotion Native styles; verify editing
  each input updates its value and the shared card preview.
- [x] 2.3 Match the reference form spacing, muted labels, light separators,
  typography, and requested order with Card Number above the Expiry Date/CVV
  row; verify the layout remains within the 375px reference width.
- [x] 2.4 Keep the form presentational-only and wire the Add Card back control
  to request router back navigation; verify no validation, API, persistence,
  or submission behavior is introduced.

## 3. Existing card entry-point navigation

- [x] 3.1 Update the My Cards top-right plus control to request
  `/add-card` while preserving its visual treatment and unrelated
  controls; verify the focused My Cards navigation test asserts the route.
- [x] 3.2 Update the List Cards `Add New Card` button to request
  `/add-card` while keeping the ellipsis inert and preserving the
  existing Profile > Banks and Cards route; verify the focused List Cards and
  Profile navigation tests.

## 4. Tests and validation

- [x] 4.1 Add focused `AddCardScreen` tests for reference copy, all four
  accessible inputs, shared card content, field updates, requested field
  order, back navigation, and presentation-only behavior; verify the focused
  Jest test passes.
- [x] 4.2 Extend route/navigation coverage for the Add Card route and hidden
  tab-bar behavior; verify the closed-area navigation test renders the route
  and existing selectable tabs remain unchanged.
- [x] 4.3 Run focused Jest tests, the project lint command, and TypeScript
  validation; verify all pass without changes outside the requested screen,
  navigation, and test scope.
- [x] 4.4 Perform a 375x812 visual comparison against
  `ADD_CARD_SCREEN.svg`; verify header, shared card placement, field order,
  separators, typography, colors, and horizontal bounds.
