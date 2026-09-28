## MODIFIED Requirements

### Requirement: Non-navigation controls are presentation-only

The header controls and card-switching affordances shown by the reference MUST
match the design visually. The My Cards add-card affordance MUST request
navigation to the Add Card screen, but it MUST NOT introduce card-management
logic.

#### Scenario: User sees header actions

- **WHEN** the My Cards screen is rendered
- **THEN** the reference's back and add-card affordances are visible in their
  designed positions
- **AND** their presence does not require an API, persistence, or card data
  operation

#### Scenario: User activates the My Cards add-card affordance

- **WHEN** the user presses the top-right add-card affordance
- **THEN** the app requests navigation to the Add Card screen
- **AND** no card data mutation, API request, persistence operation, or
  payment action occurs

#### Scenario: User activates a non-tab affordance

- **WHEN** the user activates a My Cards affordance other than the add-card
  control
- **THEN** no card data mutation, API call, persistence operation, payment
  action, or additional route is triggered
