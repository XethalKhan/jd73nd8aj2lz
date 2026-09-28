## Why

The authenticated area needs a reusable payment-card presentation instead of
screen-specific card markup. A shared component will let card lists and detail
views display consistent card data and branding while keeping visual options
such as the world map and contactless mark independently configurable.

## What Changes

- Add a reusable payment Card component for the Expo UI.
- Render dynamic card number, cardholder name, expiry date, and CVV values.
- Support optional Visa and MasterCard branding, with no logo when branding is
  omitted.
- Support independent world-map and contactless-payment visibility flags.
- Recreate the supplied card visual language with `react-native-svg`, using the
  shared `#27233D` background and responsive landscape-card sizing.
- Add component tests covering content, branding, and optional visual layers.

## Capabilities

### New Capabilities

- `payment-card-component`: Reusable, configurable payment-card rendering for
  Visa, MasterCard, or unbranded cards.

### Modified Capabilities

None.

## Impact

- Adds a shared component module, SVG visual primitives, and focused tests.
- Uses the existing `react-native-svg`, Emotion Native, Poppins fonts, Jest, and
  React Native Testing Library dependencies.
- Uses the supplied `MASTER_CARD.svg` and `VISA_CARD.svg` files as visual
  references rather than rendering their fixed card text directly.
- Does not change navigation, authentication, persistence, or card data storage.
