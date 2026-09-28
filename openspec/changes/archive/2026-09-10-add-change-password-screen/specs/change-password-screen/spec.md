## Purpose

Provide authenticated users with a visually faithful Change Password screen
while limiting the screen to local presentation and interaction behavior.

## ADDED Requirements

### Requirement: Change Password screen presents the supplied design

The authenticated Change Password route MUST render a white mobile screen
matching the supplied `CHANGE_PASSWORD_SCREEN.svg` design, including the
back control, Change Password title, three password rows, eye controls,
separators, and blue Change Password button.

#### Scenario: User opens Change Password

- **WHEN** the user navigates to the authenticated Change Password route
- **THEN** the screen shows the designed layout, labels, icons, typography,
  colors, spacing, and primary button without horizontal clipping on the
  reference portrait viewport

### Requirement: Password fields support local display interaction only

The screen MUST show empty editable fields for Current Password, New
Password, and Confirm Password. Each field MUST support local text entry and
its eye control MUST toggle only whether that field's text is masked. The
screen MUST NOT validate, submit, persist, transmit, or otherwise process the
entered values.

#### Scenario: User enters password text

- **WHEN** the user types into any password field
- **THEN** the entered text is displayed according to that field's local
  masking state and no validation or external action occurs

#### Scenario: User toggles password visibility

- **WHEN** the user activates a field's eye control
- **THEN** only that field changes between masked and visible text
- **AND** no API, persistence, navigation, or authentication action occurs

### Requirement: Change Password actions remain non-submitting

The screen MUST request back navigation when the user activates its back
control. The Change Password button MUST remain a presentational control and
MUST NOT submit, validate, persist, transmit, or otherwise process password
values.

#### Scenario: User activates the back control

- **WHEN** the user presses the Change Password screen's back control
- **THEN** the current route requests back navigation

#### Scenario: User activates the Change Password button

- **WHEN** the user presses the Change Password button with any field values
- **THEN** the screen remains presentational and performs no external action
  or password processing
