## Purpose

Provide users with a static Banks and Cards view that presents their payment
cards and the surrounding card-management affordances in the approved mobile
design without introducing card-management behavior.

## ADDED Requirements

### Requirement: List Cards presents the approved visual composition

The List Cards screen MUST match the supplied `LIST_CARDS_SCREEN.svg`
reference at a 375x812-style portrait viewport. It MUST present the white
screen background, centered `Cards` title, circular back control, blue
ellipsis affordance on the right, two stacked payment-card surfaces, the
reference card labels and static details, and the blue add-card affordance
with the reference spacing, colors, typography, and rounded treatment.

#### Scenario: User opens List Cards

- **WHEN** the user navigates from Profile to Banks and Cards
- **THEN** the user sees the designed `Cards` header, two payment cards, the
  blue ellipsis, the reference static card content, and the blue add-card
  affordance
- **AND** the visible composition remains within the portrait viewport's
  horizontal bounds

### Requirement: List Cards uses the shared payment-card presentation

The List Cards screen MUST show each payment card with the shared payment-card
visual treatment and the reference's static card details and network
presentation. The displayed values MUST be local presentation fixtures and
MUST NOT be treated as live financial data.

#### Scenario: User views the payment cards

- **WHEN** the List Cards screen is rendered
- **THEN** both reference payment cards are visible with their card number,
  cardholder, expiry, CVV, and network artwork
- **AND** no card artwork is replaced with a placeholder or opaque full-screen
  reference image

### Requirement: List Cards provides back navigation

The List Cards screen MUST request back navigation when the user activates the
top-left back control.

#### Scenario: User activates the List Cards back control

- **WHEN** the user presses the top-left back control
- **THEN** the current List Cards route requests navigation back to Profile

### Requirement: List Cards affordances remain presentation-only

The blue ellipsis and add-card affordances MUST remain presentation-only in
this scope. They MUST NOT validate, create, edit, delete, select, persist, or
submit card data, and the screen MUST NOT make API or payment-service calls.

#### Scenario: User activates a non-navigation affordance

- **WHEN** the user presses the blue ellipsis or add-card affordance
- **THEN** no card data changes, API request, persistence operation, payment
  action, or additional route is triggered
