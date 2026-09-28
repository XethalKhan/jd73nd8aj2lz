## MODIFIED Requirements

### Requirement: Login submission enters the Home destination without validation

The Login screen SHALL navigate to the first onboarding screen whenever the
user submits the form, regardless of the entered values. The application MUST
NOT validate, parse, transmit, persist, or establish a session from those
values. Completing the onboarding flow SHALL then enter the Home destination.

#### Scenario: Login submits arbitrary credentials

- **WHEN** a user presses the Login screen's `Sign In` submit button with any
  field values, including empty values
- **THEN** the application navigates to the first onboarding screen
- **AND** no validation error is shown
- **AND** no authentication service, API, session, or credential-storage
  operation occurs

#### Scenario: User completes onboarding after Login

- **WHEN** a user activates the completion action on the third onboarding
  screen
- **THEN** the application navigates to the Home destination
- **AND** the onboarding screens are not left as the active destination

#### Scenario: Login back control returns to the previous destination

- **WHEN** a user activates the Login screen's back control
- **THEN** the application returns to the previous open-flow destination
- **AND** no credentials or session state are changed
