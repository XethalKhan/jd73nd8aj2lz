## MODIFIED Requirements

### Requirement: Settings actions remain local and non-functional

The Settings screen MUST NOT make API calls, log events, persist preferences, or perform logout when the user activates the Log out control or any non-navigation settings row. The My Profile row MUST navigate to the authenticated Profile screen. The Biometric control MUST change its displayed on/off state when activated, but MUST NOT trigger any additional behavior.

#### Scenario: User activates Log out

- **WHEN** the user presses the top-right Log out control
- **THEN** no logout action or other observable side effect occurs

#### Scenario: User activates a non-biometric row

- **WHEN** the user presses Language, Contact Us, Change Password, or Privacy Policy
- **THEN** the screen remains on Settings without an external action or state change

#### Scenario: User opens My Profile

- **WHEN** the user presses the My Profile row
- **THEN** the user navigates to the authenticated Profile screen

#### Scenario: User changes the biometric control

- **WHEN** the user activates the Biometric control
- **THEN** its displayed state toggles and no API call, persistence, logging, or navigation occurs
