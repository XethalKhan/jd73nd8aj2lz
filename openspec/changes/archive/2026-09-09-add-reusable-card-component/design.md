## Context

See `proposal.md` for the motivation and scope. The current Expo app has no
shared component directory and the My Cards route is still a placeholder. The
project already depends on `react-native-svg`, uses Emotion Native for styling,
loads Poppins globally, and tests UI with Jest and React Native Testing
Library.

The supplied Visa SVG is a 348x199 landscape composition with fixed card
details. The supplied MasterCard SVG contains the visible card artwork in the
top portion of a larger 355x450 canvas and embeds its world map as a large
base64 raster image. Neither file can be rendered as the component's complete
surface because their text is fixed and their optional layers are coupled to
the exported artwork.

## Goals / Non-Goals

**Goals:**

- Define a stable, typed Card API for dynamic payment-card details.
- Preserve a responsive landscape-card ratio based on the supplied visible
  artwork.
- Recreate the card surface and feature layers with `react-native-svg`.
- Keep Visa, MasterCard, world-map, and contactless rendering independently
  controllable.
- Keep dynamic details accessible and compatible with the globally loaded
  Poppins fonts.
- Add focused rendering tests for all public behavior combinations.

**Non-Goals:**

- Persist, validate, tokenize, or encrypt card data.
- Implement card editing, selection, payment processing, or navigation.
- Render the supplied SVG files as complete opaque images.
- Add additional card networks or arbitrary custom logos.
- Change the existing My Cards screen beyond what a later consumer integration
  requires.

## Decisions

### Use a layered `react-native-svg` composition

Build the visual surface from an SVG with a stable internal viewBox matching
the landscape card artwork. Use a rounded card path or rect for the
`#27233D` surface, clipped optional map artwork, chip and contactless
primitives, and dedicated logo groups. Scale the SVG uniformly through its
viewBox so consumers can place the card at different widths without changing
the drawing coordinates.

Use regular React Native text elements in an absolutely positioned overlay for
the four dynamic values. This keeps the Poppins font behavior consistent with
the rest of the app and avoids depending on platform-specific SVG text
rendering for important card data. The overlay scales with the same card
container as the SVG.

The alternative of rendering `MASTER_CARD.svg` or `VISA_CARD.svg` directly is
rejected because those assets contain fixed values, brand-specific optional
layers, and incompatible root bounds. A pure React Native View composition is
also rejected because the supplied chip, map, logos, and contactless artwork
are graphic layers that benefit from SVG scaling.

### Keep the public API small and explicit

Expose required string props for card number, cardholder name, expiry date, and
CVV. Expose an optional `brand` union with `visa` and `mastercard`, plus
independent boolean flags for the world map and contactless icon. Omitted
brand and omitted flags represent the unbranded, no-map, no-contactless
variant. Do not infer the brand from card-number prefixes.

This avoids hidden behavior and makes every visual combination testable. A
consumer can compose the component with its own layout and data model without
the Card owning banking state.

### Reuse the supplied SVG paths as visual references

Extract the relevant Visa and MasterCard logo path groups and the contactless
shape into small local SVG subcomponents. The MasterCard world map should be
represented as a dedicated clipped map layer rather than importing the entire
oversized SVG export. If the source map remains raster, it can be placed
through an SVG image layer with the existing opacity treatment; it must not
alter card dimensions or make the map mandatory.

### Follow existing styling and test conventions

Place the shared component under `src/components` with neighboring test
coverage. Use Emotion Native for the card container and text overlay styles.
Use React Native Testing Library to assert visible values, selected logos,
independent optional layers, and responsive container behavior where practical.
Mock or isolate SVG primitives in tests only when necessary; the tests should
still verify the component's conditional tree.

## Risks / Trade-offs

- **[Risk]** The embedded MasterCard map is a large base64 image and can add
  bundle weight. **Mitigation:** isolate the map as a dedicated reusable asset
  or lightweight SVG layer instead of importing the complete export.
- **[Risk]** SVG and native text overlays can drift if their scaling containers
  use different dimensions. **Mitigation:** use one shared aspect-ratio wrapper
  and absolute positioning based on the same reference canvas.
- **[Risk]** Card data such as CVV is sensitive. **Mitigation:** the component
  only presents values supplied by the caller, performs no persistence or
  logging, and leaves masking decisions to a future explicit requirement.
- **[Risk]** Recreated logo paths may differ slightly from the Figma export.
  **Mitigation:** compare the rendered component against the supplied SVG
  references and keep logo groups isolated for visual adjustment.

## Migration Plan

1. Add the shared component and its focused tests without changing existing
   routes.
2. Run type checking, linting, and the component test suite.
3. Integrate the component into a card-bearing screen in a later scoped change.
4. Roll back by removing the component module and its tests; no persisted data
   or navigation migration is required.

## Open Questions

None. The background color, SVG rendering approach, optional-layer semantics,
and initial public brand set are defined for implementation.
