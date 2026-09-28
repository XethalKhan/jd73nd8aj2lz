## Why

Users can open Profile from Settings, but the Banks and Cards row currently
has no destination. The app needs a presentational List Cards screen that
matches the supplied mobile reference and completes that navigation path
without introducing card data, validation, or payment integrations.

## What Changes

- Add a UI-only List Cards screen at the nested Settings route
  `app/(closed)/settings/list-cards.tsx`.
- Match the supplied `LIST_CARDS_SCREEN.svg` layout, colors, typography,
  spacing, card surfaces, static labels, back control, blue ellipsis, and
  add-card affordance.
- Render each payment card through the existing shared `src/components/Card.tsx`
  component with local presentation fixtures.
- Navigate from Profile > Banks and Cards to the nested List Cards route.
- Keep all List Cards controls presentation-only except for the back navigation
  affordance.
- Add focused screen and navigation tests without adding API, persistence,
  validation, or payment logic.

## Capabilities

### New Capabilities

- `list-cards-screen`: Present the designed static list of payment cards and
  card-management affordances.

### Modified Capabilities

- `profile-screen`: Make the Banks and Cards row request navigation to the
  authenticated nested List Cards screen instead of remaining a no-op.

## Impact

- Adds a cards screen module and focused tests under `src/cards/screens`.
- Adds the nested Expo Router route under `app/(closed)/settings`.
- Updates the authenticated Settings route configuration as needed to present
  the nested screen without the tab bar shown in the reference.
- Updates Profile screen behavior and tests.
- Uses existing Expo, Emotion Native, Phosphor, React Native SVG, and shared
  Card dependencies. No new packages, APIs, persistence, or external systems
  are required.
