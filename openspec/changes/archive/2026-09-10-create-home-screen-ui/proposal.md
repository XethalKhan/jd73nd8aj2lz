## Why

The Home destination is currently a placeholder, so authenticated users do not
see the banking dashboard provided by the approved `HOME_SCREEN.svg` design.
This change establishes the static Home Screen presentation before any
functional banking flows are added.

## What Changes

- Replace the Home route placeholder with the designed Home Screen composition.
- Present the header, user/profile area, payment card, balance/summary content,
  transaction content, and four action affordances.
- Reuse the existing shared payment `Card` component for the card surface.
- Make Send, Receive, Topup, and Loan visible pressable affordances with no-op
  handlers.
- Keep the existing bottom tab navigation unchanged and exclude its SVG
  artwork from the Home Screen implementation.
- Keep the screen presentation-only, with no validation, API integration,
  persistence, or banking logic.

## Capabilities

### New Capabilities

- `home-screen`: Static Home Screen presentation matching `HOME_SCREEN.svg`
  within the existing authenticated tab route.

### Modified Capabilities

- None.

## Impact

- Affected route: `app/(closed)/home.tsx`.
- New Home module: `src/home/screens/HomeScreen.tsx` and its unit test.
- Reuses `src/components/Card.tsx` and existing Poppins fonts, Emotion styling,
  safe-area handling, and Phosphor icons.
- Adds focused Home Screen rendering coverage if needed by the existing Jest
  and Testing Library conventions.
- No new dependencies, APIs, data stores, navigation destinations, or changes
  to the existing tab bar.
