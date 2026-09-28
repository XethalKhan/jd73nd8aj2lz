## Why

Authenticated users need a presentation-ready Send Money destination that
matches the supplied mobile design and lets them choose the source card before
later transaction behavior is added.

## What Changes

- Add a hidden authenticated-area Send Money route at
  `app/(closed)/send-money`.
- Open the Send Money route from the Home screen's Send action.
- Add the designed static Send Money composition, including the header,
  payment-card area, recipient controls, amount/details area, and primary
  action.
- Let users select one recipient, view its account information, and clear the
  selection.
- Replace the amount summary with an editable USD amount field that accepts
  non-negative values with at most two decimal places.
- Return to Home when the Send Money back control is pressed.
- Reuse the existing `src/components/Card` component.
- Add a two-card horizontal carousel containing one Mastercard and one Visa
  fixture, with the selected card changing when the user swipes left or right.
- Omit the blue decorative ellipses from the supplied SVG reference.
- Keep the screen presentation-only with no validation, API integration,
  persistence, or transaction behavior.

## Capabilities

### New Capabilities

- `send-money-screen`: Static Send Money UI with a swipeable source-card
  carousel and presentation-only controls.

### Modified Capabilities

None.

## Impact

- Adds a new screen module and route registration in the authenticated Expo
  Router area.
- Connects the existing Home Send action to the new route.
- Adds focused screen tests for the rendered composition, both card brands,
  hidden tab-bar behavior, and swipe selection state.
- Reuses existing dependencies and the shared payment-card component.
- Introduces no API, data model, persistence, or external-service changes.
