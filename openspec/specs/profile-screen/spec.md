## Purpose

Provide authenticated users with a presentational profile page opened from Settings, using the approved mobile design while intentionally excluding account logic and external integrations.

## Requirements

### Requirement: Profile screen presents the designed account overview

The Profile screen MUST present the approved mobile profile design referenced at https://www.figma.com/design/6hKO9hsAXksBOpQjUTu3LM/Close-brothers-demo?node-id=1-5471&t=5hqnOe7E4VMzHrkg-4. It MUST show a profile header with a back control, a centered Profile title, and a profile/edit action. It MUST show a static avatar and account summary, followed by the designed profile rows with leading icons, labels, separators, trailing chevrons, and the notification badge where shown.

#### Scenario: User views Profile

- **WHEN** the authenticated profile route is rendered
- **THEN** the user sees the designed Profile header, static account summary, profile rows, separators, icons, chevrons, and notification badge

### Requirement: Profile back navigation is available

The Profile screen MUST request back navigation when the user activates its top-left back control.

#### Scenario: User activates the Profile back control

- **WHEN** the user presses the top-left back control
- **THEN** the current profile route requests back navigation to Settings

### Requirement: Profile content remains presentational

The Profile screen MUST use static display content and MUST NOT make API calls, perform authentication, persist changes, submit edits, or log events. The Personal Information row and the profile/edit action MUST request navigation to the authenticated Edit Profile screen. The Banks and Cards row MUST request navigation to the authenticated nested List Cards screen. All other profile rows MUST remain non-functional.

#### Scenario: User activates a profile action

- **WHEN** the user presses the Personal Information row or the top-right profile/edit action
- **THEN** the app requests navigation to the authenticated Edit Profile screen

#### Scenario: User opens Banks and Cards

- **WHEN** the user presses the Banks and Cards row
- **THEN** the app requests navigation to the authenticated nested List Cards screen

#### Scenario: User activates another profile action

- **WHEN** the user presses Payment Preferences, Notifications, Message Center, Address, or Settings
- **THEN** no API call, persistence, authentication, logging, edit submission, navigation, or external action occurs
