## MODIFIED Requirements

### Requirement: Profile content remains presentational

The Profile screen MUST use static display content and MUST NOT make API calls, perform authentication, persist changes, submit edits, or log events. The Personal Information row and the profile/edit action MUST request navigation to the authenticated Edit Profile screen. All other profile rows MUST remain non-functional.

#### Scenario: User activates a profile action

- **WHEN** the user presses the Personal Information row or the top-right profile/edit action
- **THEN** the app requests navigation to the authenticated Edit Profile screen

#### Scenario: User activates another profile action

- **WHEN** the user presses Payment Preferences, Banks and Cards, Notifications, Message Center, Address, or Settings
- **THEN** no API call, persistence, authentication, logging, edit submission, navigation, or external action occurs
