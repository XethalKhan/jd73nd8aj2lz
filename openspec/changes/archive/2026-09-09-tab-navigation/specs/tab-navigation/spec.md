## Purpose

Provide a consistent authenticated-area navigation surface that lets users
switch between the primary banking destinations while leaving room for each
destination to receive its own feature implementation later.

## ADDED Requirements

### Requirement: Authenticated area exposes four primary destinations

The authenticated area SHALL expose exactly four selectable destinations in
this order: Home, My Cards, Statistics, and Settings. Selecting a destination
SHALL make that destination the active screen without leaving the authenticated
area.

#### Scenario: User sees the primary destinations

- **WHEN** the authenticated area is rendered
- **THEN** the bottom navigation displays Home, My Cards, Statistics, and
  Settings in that order
- **AND** no onboarding destination is presented as a selectable tab

#### Scenario: User switches between destinations

- **WHEN** the user selects My Cards, Statistics, or Settings
- **THEN** the corresponding destination screen becomes active
- **AND** the selected destination is represented as the active tab

### Requirement: Home and placeholder destinations are reachable

The Home tab SHALL render the existing Home destination. The My Cards,
Statistics, and Settings tabs SHALL each render a distinct reachable
placeholder screen with its matching destination name until feature-specific
content is implemented.

#### Scenario: Home tab preserves the existing destination

- **WHEN** the user selects Home
- **THEN** the existing Home screen is rendered
- **AND** its existing placeholder copy remains available

#### Scenario: Placeholder tabs render distinct screens

- **WHEN** the user selects My Cards, Statistics, or Settings
- **THEN** a screen associated with the selected destination is rendered
- **AND** the screen identifies the selected destination by name

### Requirement: Navigation matches the supplied visual design

The bottom navigation SHALL match the supplied Figma navigation at the
reference 375px-wide portrait viewport. It SHALL use a `#F4F4F4` background,
an active `#0066FF` color, inactive `#8B8B94` colors, Poppins typography, and
outline icons representing Home, cards, statistics, and settings. The active
icon and label SHALL use the active color; inactive icons and labels SHALL use
the inactive color.

#### Scenario: Home is the active destination

- **WHEN** Home is the active tab
- **THEN** its house icon and label use `#0066FF`
- **AND** the other three icons and labels use `#8B8B94`
- **AND** the navigation background uses `#F4F4F4`

#### Scenario: A non-Home destination is active

- **WHEN** the user selects My Cards, Statistics, or Settings
- **THEN** the selected destination's icon and label use `#0066FF`
- **AND** Home and the other inactive destinations use `#8B8B94`

### Requirement: Existing onboarding flow remains a full-screen flow

The existing onboarding destinations SHALL remain reachable at their current
paths and SHALL continue to advance from onboarding 1 through onboarding 3
before entering Home. The bottom navigation SHALL be hidden while onboarding
is active, and onboarding SHALL not be selectable as a primary destination.

#### Scenario: User enters onboarding from Login

- **WHEN** Login sends the user to the first onboarding screen
- **THEN** the first onboarding screen is rendered without the bottom
  navigation
- **AND** the existing onboarding path remains usable

#### Scenario: User completes onboarding

- **WHEN** the user completes the third onboarding screen
- **THEN** the user enters the Home destination
- **AND** the bottom navigation is visible with Home active
