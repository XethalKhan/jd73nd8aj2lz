## Purpose

Provide a polished unauthenticated entry point for app that helps users
understand the product and move directly into sign-in or account creation.

## ADDED Requirements

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
for the welcome actions, even though credential validation and account
creation are outside this change.

#### Scenario: Login destination is reachable

- **WHEN** navigation reaches the login destination
- **THEN** the application renders a login screen with a clear login heading
- **AND** the screen does not display the welcome screen actions as its primary
  content

#### Scenario: Create-account destination is reachable

- **WHEN** navigation reaches the create-account destination
- **THEN** the application renders a create-account screen with a clear
  account-creation heading
- **AND** the screen does not display the welcome screen actions as its primary
  content

### Requirement: Welcome actions are accessible

The sign-in and sign-up controls SHALL be accessible as distinct interactive
elements with readable labels and touch targets suitable for mobile use.

#### Scenario: Assistive technology identifies both actions

- **WHEN** an accessibility or screen-reader query inspects the welcome screen
- **THEN** it can distinguish the `Sign in` control from the `Sign up` control
- **AND** each control exposes its visible label
