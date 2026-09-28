## Purpose

Provide authenticated users with a polished, static banking dashboard at the
Home destination, matching the supplied visual design without introducing
transaction behavior or data integration.

## ADDED Requirements

### Requirement: Home displays the approved visual composition

The Home destination MUST present the visual composition from `HOME_SCREEN.svg`
above the existing bottom tab navigation, including the header, profile/search
area, payment-card area, action area, balance content, and transaction content.
The screen MUST use the existing visual language of the application for
typography, colors, spacing, and iconography.

#### Scenario: User opens Home

- **WHEN** the authenticated user selects the Home tab
- **THEN** the Home destination displays the designed dashboard composition
- **AND** the existing bottom tab navigation remains visible and unchanged

### Requirement: Home uses the shared payment card

The Home destination MUST display the supplied payment-card presentation using
the existing shared payment-card component, with static fixture values suitable
for the visual design.

#### Scenario: User views the Home payment card

- **WHEN** the Home destination is rendered
- **THEN** a payment card is visible in the card area
- **AND** the card uses the shared payment-card presentation
- **AND** no second Home-specific card implementation is introduced

### Requirement: Home exposes presentation-only payment actions

The Home destination MUST display four distinct pressable affordances labeled
Send, Receive, Topup, and Loan in the action area.

#### Scenario: User sees Home actions

- **WHEN** the Home destination is rendered
- **THEN** Send, Receive, Topup, and Loan are visible and individually
  identifiable

#### Scenario: User presses a Home action

- **WHEN** the user presses Send, Receive, Topup, or Loan
- **THEN** the press has no externally observable business effect
- **AND** no navigation, validation, API request, persistence operation, or
  transaction occurs

### Requirement: Home remains static and presentation-only

The Home destination MUST use static presentation data and MUST NOT perform
validation, call an API, persist banking data, or implement transaction logic.

#### Scenario: Home renders without service data

- **WHEN** the Home destination renders without a network or banking service
- **THEN** the complete designed composition remains visible using its static
  presentation values
- **AND** no service request is required for rendering
