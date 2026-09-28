## MODIFIED Requirements

### Requirement: Authenticated area exposes four primary destinations

The authenticated area SHALL expose exactly four selectable destinations in
this order: Home, My Cards, Statistics, and Settings. Selecting a destination
SHALL make that destination the active screen without leaving the authenticated
area. Detail and onboarding routes SHALL NOT be selectable destinations in the
bottom navigation.

#### Scenario: User sees the primary destinations

- **WHEN** the authenticated area is rendered
- **THEN** the bottom navigation displays Home, My Cards, Statistics, and
  Settings in that order
- **AND** no onboarding or detail destination is presented as a selectable tab

#### Scenario: User switches between destinations

- **WHEN** the user selects My Cards, Statistics, or Settings
- **THEN** the corresponding destination screen becomes active
- **AND** the selected destination is represented as the active tab

### Requirement: Existing onboarding flow remains a full-screen flow

The existing onboarding destinations SHALL remain reachable at their current
paths and SHALL continue to advance from onboarding 1 through onboarding 3
before entering Home. The bottom navigation SHALL be absent while onboarding
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

## ADDED Requirements

### Requirement: Detail destinations use the authenticated parent stack

Authenticated detail destinations, including Profile, Edit Profile, Add Card,
Change Password, Send Money, and List Cards, SHALL be presented as routes in
the authenticated parent stack rather than as screens registered in the
bottom-tab navigator. The bottom navigation SHALL not be visible while one of
these detail destinations is active.

#### Scenario: User opens a profile detail destination

- **WHEN** the user selects My Profile from Settings
- **THEN** Profile is pushed above the authenticated tab navigator
- **AND** the bottom navigation is not visible

#### Scenario: User opens List Cards from Profile

- **WHEN** the user selects Banks and Cards from Profile
- **THEN** List Cards opens at `/settings/list-cards`
- **AND** the bottom navigation is not visible
- **AND** activating the List Cards back control returns to Profile

#### Scenario: User returns from a detail destination

- **WHEN** the user activates a detail screen's back control
- **THEN** the parent stack removes that detail destination
- **AND** the previously active authenticated destination is restored
