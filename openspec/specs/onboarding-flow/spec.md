## Purpose

Provide a faithful three-screen banking introduction after screen-only login,
allowing users to review the supplied product messaging before entering Home.

## Requirements

### Requirement: Onboarding presents the three supplied screens in order

The application SHALL present exactly three onboarding screens in this flow.
Each screen SHALL show its corresponding supplied illustration and exact
visible copy:

- Onboarding 1: `Fastest Payment in the world` and
  `Integrate multiple payment methoods to help you up the process quickly`
- Onboarding 2: `The most Secure Platfrom for Customer` and
  `Built-in Fingerprint, face recognition and more, keeping you completely safe`
- Onboarding 3: `Paying for Everything is Easy and Convenient` and
  `Built-in Fingerprint, face recognition and more, keeping you completely safe`

#### Scenario: First onboarding screen is shown

- **WHEN** the post-login onboarding flow opens
- **THEN** the application displays the first illustration, first heading,
  first supporting copy, first pagination state, and a `Next` action

#### Scenario: User advances through onboarding

- **WHEN** the user activates `Next` on Onboarding 1 or Onboarding 2
- **THEN** the application displays the next onboarding screen in sequence
- **AND** the previous onboarding screen is no longer the active screen

### Requirement: Onboarding matches the supplied visual design

Each onboarding screen SHALL match its supplied Figma frame at the reference
375x812 portrait viewport, including the white canvas, local illustration,
status-bar presentation, Poppins typography, dark `#1E1E2D` headings, muted
`#7E848D` supporting copy, blue `#0066FF` action and active indicator, muted
pagination indicators, 16px button radius, 20px horizontal inset, and
335x56 primary button.

#### Scenario: Onboarding screen renders at reference size

- **WHEN** any onboarding screen is rendered at 375x812
- **THEN** its illustration, pagination, copy, button, colors, typography,
  and relative placement match the corresponding supplied Figma frame

#### Scenario: Onboarding uses local visual assets

- **WHEN** any onboarding screen is rendered
- **THEN** its illustration is available from the checked-in local project
  assets
- **AND** the screen does not depend on a temporary remote Figma asset URL

### Requirement: Final onboarding screen enters Home

The application SHALL enter the existing Home destination after the user
completes Onboarding 3.

#### Scenario: User completes onboarding

- **WHEN** the user activates `Next` on Onboarding 3
- **THEN** the application navigates to Home
- **AND** the onboarding screens are not left as the active destination

#### Scenario: User returns during onboarding

- **WHEN** the user uses the platform back action from an onboarding screen
- **THEN** the application follows the normal navigation history
- **AND** no onboarding data or authentication state is created or changed
