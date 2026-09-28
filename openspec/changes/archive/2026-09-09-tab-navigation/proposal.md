## Why

The authenticated area currently exposes only a standalone Home route, so users
have no persistent way to move between the main banking destinations. The
Figma design defines a four-item bottom navigation that should be added now so
the closed area has the intended information architecture and visual entry
points for future card, statistics, and settings features.

## What Changes

- Replace the `(closed)` stack entry point with a four-item bottom tab
  navigator.
- Keep the existing `app/(closed)/home.tsx` route as the Home tab.
- Add dummy routes at:
  - `app/(closed)/my-cards/index.tsx`
  - `app/(closed)/statistics/index.tsx`
  - `app/(closed)/settings/index.tsx`
- Configure tab labels, icons, active/inactive colors, typography, spacing,
  and bar background to match the supplied Figma navigation.
- Keep the existing onboarding routes reachable at their current paths while
  hiding the tab bar during onboarding and excluding onboarding from tab
  selection.
- Keep the implementation in `app`; do not add tab-navigation modules under
  `src`.

## Capabilities

### New Capabilities

- `tab-navigation`: Persistent navigation for the authenticated area across
  Home, My Cards, Statistics, and Settings.

### Modified Capabilities

- None.

## Impact

- Affects the Expo Router layout at `app/(closed)/_layout.tsx` and adds three
  route files under `app/(closed)`.
- Uses the existing `expo-router`, `@emotion/native`, Poppins fonts, and
  `phosphor-react-native` dependencies; no new dependency is required.
- Changes the closed-area navigation container while preserving the existing
  onboarding URL flow and Home destination.
