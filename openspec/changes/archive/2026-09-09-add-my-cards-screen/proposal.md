## Why

The authenticated area currently exposes a placeholder My Cards route, so
users cannot view the card-management screen represented in the approved design. This change adds the static presentation now so the route has
the intended visual experience while leaving card data and interactions for a
later scope.

## What Changes

- Replace the My Cards route placeholder with the designed mobile screen.
- Add a cards screen module under `src/cards/screens`.
- Render the supplied shared `src/components/Card` component for the card
  presentation instead of duplicating card artwork.
- Add the designed header, card navigation controls, card summary content,
  spending-limit panel, and static copy.
- Preserve the existing bottom tab navigation and active My Cards tab.
- Add focused screen tests for the visible copy, card composition, and major
  visual sections.
- Use the Figma reference
  `https://www.figma.com/design/6hKO9hsAXksBOpQjUTu3LM/Close-brothers-demo?node-id=1-7950&t=5hqnOe7E4VMzHrkg-4`
  with `MY_CARDS_SCREEN.svg` as the checked-in fallback.

## Capabilities

### New Capabilities

- `my-cards-screen`: Static My Cards presentation for the authenticated tab
  area.

### Modified Capabilities

None.

## Impact

- Affects `app/(closed)/my-cards/index.tsx`.
- Adds screen-level UI under `src/cards/screens` and tests for that screen.
- Reuses existing Emotion Native styling, Poppins fonts, Phosphor icons, and
  `src/components/Card`.
- Adds no API calls, persistence, card state management, new dependencies, or
  routes.
