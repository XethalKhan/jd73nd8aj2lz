# welcome-auth-entry Specification

## Purpose

Provide a polished unauthenticated entry point for app that helps users
understand the product and move directly into sign-in or account creation.

## Requirements

### Requirement: Unauthenticated users see the welcome screen

When the application has no authenticated session, the entry experience SHALL
display a welcome screen instead of the Expo starter content or an
authenticated application screen.

#### Scenario: Fresh launch without an authenticated session

- **WHEN** a user launches the application without an authenticated session
- **THEN** the application displays the welcome screen
- **AND** the screen includes branding, a banking-themed visual, and
  clear entry actions

#### Scenario: Welcome screen follows the reference visual direction

- **WHEN** the welcome screen is rendered on a supported mobile viewport
- **THEN** it uses a light background, dark navy primary text, blue primary
  actions, rounded controls, and spacing that keeps the illustration and
  actions visible without clipping

### Requirement: Welcome screen exposes sign-in and sign-up actions

The welcome screen SHALL display two independently actionable buttons labeled
exactly `Sign in` and `Sign up`.

#### Scenario: User chooses sign in

- **WHEN** the user activates the `Sign in` button
- **THEN** the application navigates to the login screen
- **AND** the welcome screen is not left as the active destination

#### Scenario: User chooses sign up

- **WHEN** the user activates the `Sign up` button
- **THEN** the application navigates to the create-account screen
- **AND** the welcome screen is not left as the active destination

### Requirement: Login and create-account destinations exist

The application SHALL expose navigable login and create-account destinations
for the welcome actions. The destinations SHALL render the screen-only
authentication entry experiences described by the supplied Figma references,
without requiring authentication services or account data.

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
- **THEN** the field accepts ordinary text input without requiring a backend
  or client-side validation
- **AND** the screen preserves readable labels and mobile-sized touch targets

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

### Requirement: Authentication entry screens follow the supplied visual design

The Login and Sign Up screens SHALL match the supplied Figma frames on
supported portrait mobile viewports, including their white canvas, Poppins
typography, dark navy headings and text, muted gray labels, blue `#06F`
actions and links, rounded 16px submit buttons, reference spacing, exact
visible copy, and matching line-icon treatment. Required fonts and icons
MUST be available locally at runtime rather than loaded from temporary remote
design URLs.

#### Scenario: Login matches the reference frame

- **WHEN** the Login screen is rendered at the reference 375x812 viewport
- **THEN** its heading, fields, button, footer copy, back control, icons,
  colors, typography, and relative placement match the supplied Sign-In frame

#### Scenario: Sign Up matches the reference frame

- **WHEN** the Sign Up screen is rendered at the reference 375x812 viewport
- **THEN** its heading, fields, button, footer copy, back control, icons,
  colors, typography, and relative placement match the supplied Sign-Up frame

#### Scenario: Authentication screens remain usable across portrait sizes

- **WHEN** either screen is rendered on a supported portrait mobile viewport
  that differs from 375x812
- **THEN** the screen preserves the visual hierarchy and keeps its fields,
  primary action, and navigation controls visible without horizontal clipping

### Requirement: Welcome actions are accessible

The sign-in and sign-up controls SHALL be accessible as distinct interactive
elements with readable labels and touch targets suitable for mobile use.

#### Scenario: Assistive technology identifies both actions

- **WHEN** an accessibility or screen-reader query inspects the welcome screen
- **THEN** it can distinguish the `Sign in` control from the `Sign up` control
- **AND** each control exposes its visible label
