## MODIFIED Requirements

### Requirement: List Cards affordances remain presentation-only

The blue ellipsis and add-card affordances MUST remain free of card-management
logic. The List Cards add-card affordance MUST request navigation to the Add
Card screen, but neither affordance may validate, create, edit, delete,
select, persist, or submit card data. The screen MUST NOT make API or payment
service calls.

#### Scenario: User sees List Cards affordances

- **WHEN** the List Cards screen is rendered
- **THEN** the blue ellipsis and `Add New Card` affordances are visible in
  their designed positions
- **AND** the controls do not imply that card data has been created or
  persisted

#### Scenario: User activates the List Cards add-card affordance

- **WHEN** the user presses the `Add New Card` affordance
- **THEN** the app requests navigation to the Add Card screen
- **AND** no card data changes, API request, persistence operation, or payment
  action occurs

#### Scenario: User activates a non-navigation affordance

- **WHEN** the user presses the blue ellipsis affordance
- **THEN** no card data changes, API request, persistence operation, payment
  action, or additional route is triggered
