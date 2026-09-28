## MODIFIED Requirements

### Requirement: Login and create-account destinations exist

The application SHALL expose navigable login and create-account destinations
for the welcome actions. The destinations SHALL render the screen-only
authentication entry experiences described by the supplied Figma references.
Login SHALL use the authentication service to establish a session; create
account remains presentational and does not create an account.

#### Scenario: Login destination is reachable

- **WHEN** navigation reaches the login destination
- **THEN** the application renders a Login screen with the exact visible copy
  `Sign In`, `Email Address`, `Password`, `Sign In`, and
  `I’m a new user. Sign In`
- **AND** the screen does not display the welcome screen actions as its primary
  content
- **AND** the screen includes the Figma-aligned back control, email field,
  password field, password visibility control, and blue rounded submit button

#### Scenario: Create-account destination is reachable

- **WHEN** navigation reaches the create-account destination
- **THEN** the application renders a Sign Up screen with the exact visible
  copy `Sign Up`, `Full Name`, `Phone Number`, `Email Address`, `Password`,
  `Sign Up`, and `Already have an account. Sign Up`
- **AND** the screen does not display the welcome screen actions as its primary
  content
- **AND** the screen includes the Figma-aligned back control, name, phone,
  email, and password fields, password visibility control, and blue rounded
  submit button

#### Scenario: Authentication destination controls remain usable

- **WHEN** a user interacts with a Login or Sign Up field
- **THEN** the field accepts ordinary text input
- **AND** the screen preserves readable labels and mobile-sized touch targets

### Requirement: Login submission enters the Home destination without validation

The Login screen SHALL submit the entered credentials to the authentication
service. It SHALL navigate to the first onboarding screen only after successful
authentication, regardless of client-side validation rules. Failed
authentication SHALL keep the user in the open flow and display an
authentication failure without establishing a session.

#### Scenario: Login submits valid demo credentials

- **WHEN** a user submits the configured demo credentials
- **THEN** the client calls the login endpoint
- **AND** it securely stores the returned session tokens
- **AND** it navigates to the first onboarding screen

#### Scenario: Login rejects invalid credentials

- **WHEN** a user submits credentials rejected by the login endpoint
- **THEN** the client does not establish an authenticated session
- **AND** it remains in the open flow
- **AND** it displays an authentication failure

#### Scenario: Login submits arbitrary credentials

- **WHEN** a user presses the Login screen's `Sign In` submit button with
  arbitrary field values
- **THEN** the client sends those values to the login endpoint
- **AND** it enters onboarding only if the values match the configured demo
  credentials
- **AND** invalid values do not establish a session or bypass authentication

#### Scenario: User completes onboarding after Login

- **WHEN** a user activates the completion action on the third onboarding
  screen after successful login
- **THEN** the application navigates to the Home destination
- **AND** the onboarding screens are not left as the active destination

#### Scenario: Login back control returns to the previous destination

- **WHEN** a user activates the Login screen's back control
- **THEN** the application returns to the previous open-flow destination
- **AND** no credentials or session state are changed

## ADDED Requirements

### Requirement: User can leave the authenticated flow

The authenticated settings surface SHALL provide an actionable logout control
that ends the local session and returns the user to the unauthenticated entry
flow.

#### Scenario: User logs out from Settings

- **WHEN** an authenticated user activates the Settings logout control
- **THEN** the client calls the logout endpoint with the active refresh token
- **AND** it clears both locally stored tokens
- **AND** it redirects the user to the open welcome screen
