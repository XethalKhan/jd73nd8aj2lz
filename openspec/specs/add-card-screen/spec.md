## Purpose

Provide users with a visually faithful, UI-only Add Card screen where they
can view a live preview while entering card information.

## Requirements

### Requirement: Add Card presents the approved visual composition

The Add Card screen MUST match the supplied `ADD_CARD_SCREEN.svg` reference at
a 375x812-style portrait viewport. It MUST preserve the white background,
centered `Add New Card` title, circular back control, dark payment-card
preview, Poppins typography, muted labels, light separators, and reference
spacing. The Card Number field MUST appear above the row containing Expiry
Date and CVV.

#### Scenario: User opens Add Card

- **WHEN** the Add Card route is opened
- **THEN** the user sees the designed header, card preview, Cardholder Name
  field, Card Number field, Expiry Date field, and CVV field
- **AND** the Card Number field is positioned above the Expiry Date and CVV
  row
- **AND** the visible composition remains within the portrait viewport's
  horizontal bounds

### Requirement: Add Card displays a shared payment-card preview

The Add Card screen MUST display the entered card details in the payment-card
preview using the existing shared payment-card presentation. The initial
values MAY be static presentation fixtures for this UI-only scope.

#### Scenario: User views the card preview

- **WHEN** the Add Card screen is rendered
- **THEN** the preview shows card number, cardholder name, expiry date, and
  CVV content
- **AND** the preview retains the shared landscape card proportions and
  visual treatment

### Requirement: Add Card fields are editable but presentation-only

The Cardholder Name, Card Number, Expiry Date, and CVV controls MUST accept
local text input and update the visible preview. The screen MUST NOT validate,
submit, persist, or send the entered values to an API or payment service.

#### Scenario: User edits card information

- **WHEN** the user changes any Add Card field
- **THEN** the corresponding local field value and card preview update
- **AND** no validation error, persistence operation, API request, or payment
  action occurs

### Requirement: Add Card provides route navigation controls

The Add Card screen MUST request back navigation when the user activates its
top-left back control. The screen MUST be reachable from both existing
card-add affordances.

#### Scenario: User leaves Add Card

- **WHEN** the user presses the top-left back control
- **THEN** the current Add Card route requests navigation back to the
  previous screen

#### Scenario: User enters Add Card from My Cards

- **WHEN** the user presses the top-right plus control on My Cards
- **THEN** the app requests navigation to the Add Card screen

#### Scenario: User enters Add Card from List Cards

- **WHEN** the user presses the List Cards `Add New Card` button
- **THEN** the app requests navigation to the Add Card screen
