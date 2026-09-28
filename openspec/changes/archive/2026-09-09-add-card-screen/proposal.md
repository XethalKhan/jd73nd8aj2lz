## Why

Users can view existing cards, but the current add-card affordances do
nothing. The app needs a UI-only Add Card screen that matches the supplied
`ADD_CARD_SCREEN.svg` reference and is reachable from both existing card
entry points.

## What Changes

- Add an Add Card screen at `/add-card`.
- Match the supplied 375x812 reference using native layout and the shared
  `src/components/Card.tsx` component for the card preview.
- Render Cardholder Name, Card Number, Expiry Date, and CVV fields, with Card
  Number placed above the Expiry Date and CVV row as requested.
- Make the My Cards header plus navigate to the Add Card screen.
- Make the List Cards “Add New Card” button navigate to the Add Card screen.
- Preserve the existing Settings > My Profile > Banks and Cards path to List
  Cards.
- Keep the form presentational only. Do not add validation, submission,
  persistence, API integration, or card-management logic.
- Add focused screen, route, and navigation tests.

## Capabilities

### New Capabilities

- `add-card-screen`: Present the designed static Add Card form and shared card
  preview.

### Modified Capabilities

- `my-cards-screen`: The top-right add-card affordance requests navigation to
  the Add Card screen.
- `list-cards-screen`: The Add New Card affordance requests navigation to the
  Add Card screen while remaining free of card-management logic.

## Impact

- Adds `src/cards/screens/AddCardScreen.tsx` and the hidden sibling route
  adapter `app/(closed)/add-card.tsx`.
- Registers the Add Card route as a hidden sibling of the authenticated tabs.
- Updates `MyCardsScreen` and `ListCardsScreen` navigation handlers and their
  tests.
- Adds no dependencies, APIs, persistence, validation, or data migrations.
