# my-cards-screen Specification

## Purpose

Provide the authenticated My Cards tab with the approved static card-management
presentation, including the user's card surface, supporting card information,
spending-limit summary, and existing tab navigation.

## Requirements

### Requirement: My Cards presents the approved visual design

The My Cards screen MUST present the mobile composition represented by the
Figma reference
`https://www.figma.com/design/6hKO9hsAXksBOpQjUTu3LM/Close-brothers-demo?node-id=1-7950&t=5hqnOe7E4VMzHrkg-4`.
When the Figma reference is unavailable, `MY_CARDS_SCREEN.svg` MUST be treated
as the visual fallback. The screen MUST preserve the reference's white
background, Poppins typography, colors, icon treatment, copy, spacing,
alignment, rounded surfaces, and bottom navigation relationship.

#### Scenario: User opens My Cards

- **WHEN** the authenticated My Cards tab is selected
- **THEN** the user sees the designed My Cards header, card presentation,
  supporting card content, spending-limit panel, and bottom tab navigation
- **AND** no placeholder title or placeholder description is shown

#### Scenario: Screen is rendered at the reference mobile viewport

- **WHEN** the screen is rendered in a 375x812-style portrait viewport
- **THEN** the visible sections preserve the relative positions and proportions
  of the supplied reference
- **AND** the content remains within the screen's horizontal bounds

### Requirement: My Cards renders the shared payment card

The screen MUST render the existing shared payment-card presentation for the
card artwork and details. It MUST supply static fixture values only for this
UI-only scope and MUST NOT duplicate the card artwork inside the screen.

#### Scenario: Card content is visible

- **WHEN** the My Cards screen is rendered
- **THEN** a payment card is visible with the reference's card number,
  cardholder name, expiry date, CVV, and network presentation
- **AND** the card retains the shared component's landscape proportions and
  visual surface

#### Scenario: Card artwork remains reusable

- **WHEN** the screen implementation is reviewed or the shared Card component
  is rendered independently
- **THEN** the screen uses the shared Card API rather than copying its SVG
  artwork, text overlay, or brand rendering

### Requirement: My Cards shows static card summary and spending limit

The screen MUST show the card summary and spending-limit content from the
reference, including the exact visible copy, numeric values, labels, progress
track, active progress color, and thumb styling. These values MUST be
presentation fixtures and MUST NOT imply live financial data.

#### Scenario: Spending-limit panel is visible

- **WHEN** the My Cards screen is rendered
- **THEN** the user sees the reference's rounded spending-limit panel with its
  labels, values, progress track, blue filled portion, and circular thumb
- **AND** the panel uses the reference's muted and heading text colors

#### Scenario: Static values do not perform data work

- **WHEN** the My Cards screen is mounted
- **THEN** it makes no API request, persistence operation, or financial
  calculation
- **AND** the displayed summary and limit values remain static

### Requirement: My Cards preserves existing tab navigation

The screen MUST remain inside the existing closed-area tab layout and MUST
preserve the current My Cards tab label, icon, active color, inactive colors,
and bottom navigation styling.

#### Scenario: User changes tabs

- **WHEN** the user selects another existing closed-area tab
- **THEN** the existing tab navigation behavior remains available
- **AND** the My Cards screen does not add a competing navigation system

#### Scenario: My Cards is the active tab

- **WHEN** the My Cards route is active
- **THEN** the existing My Cards tab remains visually selected
- **AND** the screen content is laid out above the existing tab bar

### Requirement: Non-navigation controls are presentation-only

The header controls and card-switching affordances shown by the reference MUST
match the design visually. The My Cards add-card affordance MUST request
navigation to the Add Card screen, but it MUST NOT introduce card-management
logic.

#### Scenario: User sees header actions

- **WHEN** the My Cards screen is rendered
- **THEN** the reference's back and add-card affordances are visible in their
  designed positions
- **AND** their presence does not require an API, persistence, or new route

#### Scenario: User activates the My Cards add-card affordance

- **WHEN** the user presses the top-right add-card affordance
- **THEN** the app requests navigation to the Add Card screen
- **AND** no card data mutation, API request, persistence operation, or
  payment action occurs

#### Scenario: User activates a non-tab affordance

- **WHEN** the user activates a header or card-switching affordance
- **THEN** no card data mutation, API call, persistence operation, or new route
  is performed in this scope
