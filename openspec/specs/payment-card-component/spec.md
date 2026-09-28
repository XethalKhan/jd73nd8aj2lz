# payment-card-component Specification

## Purpose

Provide a reusable payment-card presentation that displays card details and
optional network and payment features consistently across the banking UI.

## Requirements

### Requirement: Card displays supplied payment details

The Card component SHALL render the supplied card number, cardholder name,
expiry date, and CVV value on every card instance. It SHALL preserve the
meaningful content of each supplied value rather than replacing it with
hard-coded sample data.

#### Scenario: Card renders dynamic details

- **WHEN** a Card is rendered with card details
- **THEN** the card number, cardholder name, expiry date, and CVV are visible
- **AND** each visible value matches the corresponding supplied prop

#### Scenario: Card values change

- **WHEN** a Card receives updated card details
- **THEN** the rendered values update to the new values
- **AND** the component does not retain the previous card details

### Requirement: Card uses the shared visual surface

Every Card SHALL use the shared `#27233D` card background, a landscape card
shape, and responsive sizing that preserves the card's proportions when its
available width changes.

#### Scenario: Card renders at different widths

- **WHEN** the same Card is rendered in containers with different available
  widths
- **THEN** the complete card remains visible without horizontal distortion
- **AND** its landscape proportions and rounded corners are preserved

#### Scenario: Card uses the standard surface

- **WHEN** a Card is rendered with any supported brand or optional feature
  combination
- **THEN** its base background is `#27233D`
- **AND** optional features do not replace the base card surface

### Requirement: Card optionally displays a network logo

The Card SHALL accept an optional brand value of Visa or MasterCard. When the
brand is Visa, it SHALL display the Visa logo. When the brand is MasterCard,
it SHALL display the MasterCard logo. When no brand is supplied, it SHALL not
display a network logo.

#### Scenario: Visa branding is selected

- **WHEN** a Card is rendered with the Visa brand
- **THEN** the Visa logo is visible in the card's network-logo position
- **AND** the MasterCard logo is not visible

#### Scenario: MasterCard branding is selected

- **WHEN** a Card is rendered with the MasterCard brand
- **THEN** the MasterCard logo is visible in the card's network-logo position
- **AND** the Visa logo is not visible

#### Scenario: No branding is selected

- **WHEN** a Card is rendered without a brand
- **THEN** no Visa or MasterCard logo is visible
- **AND** the remaining card details and optional features still render

### Requirement: Card independently controls the world map layer

The Card SHALL accept a boolean world-map option that controls only the
visibility of the world-map background layer. The option SHALL be independent
of the selected network brand.

#### Scenario: World map is enabled

- **WHEN** the world-map option is enabled for a Card
- **THEN** a subtle world-map layer is visible behind the card details
- **AND** the layer remains clipped to the card shape

#### Scenario: World map is disabled

- **WHEN** the world-map option is disabled or omitted
- **THEN** no world-map layer is visible
- **AND** the card background remains the shared `#27233D` surface

#### Scenario: World map is independent of brand

- **WHEN** the world-map option is enabled for either Visa, MasterCard, or no
  brand
- **THEN** the world-map layer is visible regardless of the brand value

### Requirement: Card independently controls contactless payment

The Card SHALL accept a boolean contactless option that controls only the
visibility of the contactless-payment icon. The option SHALL be independent of
the selected network brand.

#### Scenario: Contactless is enabled

- **WHEN** the contactless option is enabled for a Card
- **THEN** the contactless-payment icon is visible in the card's upper-right
  feature position

#### Scenario: Contactless is disabled

- **WHEN** the contactless option is disabled or omitted
- **THEN** the contactless-payment icon is not visible
- **AND** no replacement network-specific icon is shown

#### Scenario: Contactless is independent of brand

- **WHEN** the contactless option is enabled for either Visa, MasterCard, or no
  brand
- **THEN** the contactless-payment icon is visible regardless of the brand value

### Requirement: Card exposes stable semantic content

The Card SHALL expose the rendered card details and optional visual layers to
component tests and accessibility tooling without requiring consumers to
inspect SVG path data.

#### Scenario: Card details are queryable

- **WHEN** a Card is rendered in a test or accessibility-aware UI
- **THEN** the card number, cardholder name, expiry date, and CVV can be located
  as semantic text content

#### Scenario: Optional layers are queryable

- **WHEN** a brand, world map, or contactless option is enabled
- **THEN** the corresponding rendered layer can be identified independently
- **AND** disabled or omitted layers are absent from the rendered tree
