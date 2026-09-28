## MODIFIED Requirements

### Requirement: Settings screen presents the designed preferences layout

The Settings screen MUST present a header with a back control, a centered
Settings title, and a Log out control. It MUST present General and Security
sections with the Language, My Profile, Contact Us, Change Password, Privacy
Policy, and Biometric rows, plus the existing authenticated-area tab
navigation. The Language row MUST display the currently active language.

#### Scenario: User views Settings

- **WHEN** the Settings route is rendered
- **THEN** the user sees the designed header, section labels, row labels,
  active language value, separators, biometric control, and bottom tab
  navigation

### Requirement: Settings actions remain local and non-functional

The Settings screen MUST NOT make API calls, log events, or perform logout
when the user activates the Log out control or any non-navigation settings row.
The Language row MUST navigate to the authenticated Language screen and MUST
not change the language until the user selects an option there. The My Profile
row MUST navigate to the authenticated Profile screen. The Change Password row
MUST navigate to the authenticated Change Password screen. The Biometric
control MUST change its displayed on/off state when activated, but MUST NOT
trigger any additional behavior.

#### Scenario: User activates Log out

- **WHEN** the user presses the top-right Log out control
- **THEN** no logout action or other observable side effect occurs

#### Scenario: User opens Language

- **WHEN** the user presses the Language row
- **THEN** the user navigates to the authenticated Language screen

#### Scenario: User activates a non-biometric row

- **WHEN** the user presses Contact Us or Privacy Policy
- **THEN** the screen remains on Settings without an external action or state
  change

#### Scenario: User opens Change Password

- **WHEN** the user presses the Change Password row
- **THEN** the user navigates to the authenticated Change Password screen

#### Scenario: User opens My Profile

- **WHEN** the user presses the My Profile row
- **THEN** the user navigates to the authenticated Profile screen

#### Scenario: User changes the biometric control

- **WHEN** the user activates the Biometric control
- **THEN** its displayed state toggles and no API call, persistence, logging, or
  navigation occurs
