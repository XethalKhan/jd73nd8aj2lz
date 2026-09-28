## 1. Component foundation

- [x] 1.1 Create the shared `src/components` Card module and define the typed
  props for card number, cardholder name, expiry date, CVV, optional brand,
  world-map visibility, and contactless visibility; verify the module has no
  TypeScript errors.
- [x] 1.2 Add the responsive landscape-card wrapper and Emotion Native styles
  using the `#27233D` surface, shared aspect ratio, clipping, and scaled
  content layers; verify the card remains proportionally sized at multiple
  rendered widths.

## 2. SVG visual layers

- [x] 2.1 Implement the base card, chip, and shared decorative SVG primitives
  using a stable viewBox and the supplied assets as visual references; verify
  the card renders with the standard background and rounded shape.
- [x] 2.2 Implement isolated Visa and MasterCard logo subcomponents and render
  only the logo selected by the optional brand prop; verify Visa, MasterCard,
  and unbranded variants each show the expected logo state.
- [x] 2.3 Implement the independently clipped world-map layer and
  contactless-payment icon layer; verify each flag works for Visa, MasterCard,
  and unbranded cards without enabling or disabling the other feature.
- [x] 2.4 Add the native text overlay for card number, cardholder name, expiry
  date, and CVV using the existing Poppins font family; verify all supplied
  values are visible and update when props change.

## 3. Tests and validation

- [x] 3.1 Add React Native Testing Library coverage for dynamic values, brand
  selection, omitted brand behavior, optional map/contactless layers, and
  semantic layer queries; verify the focused Card test suite passes.
- [x] 3.2 Run the project's TypeScript/lint checks and the full Jest suite;
  verify all checks pass without changing existing route behavior.
- [x] 3.3 Compare the rendered component against the supplied Visa and
  MasterCard references at a representative portrait viewport; verify the
  visible card ratio, logo placement, feature placement, and typography are
  visually aligned.
