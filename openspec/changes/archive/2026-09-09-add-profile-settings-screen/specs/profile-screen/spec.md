## Purpose

Provide authenticated users with a presentational profile page opened from Settings, using the approved mobile design while intentionally excluding account logic and external integrations.

## ADDED Requirements

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

The Profile screen MUST use static display content and MUST NOT make API calls, perform authentication, persist changes, submit edits, log events, or trigger external actions. The profile/edit action and profile rows MUST remain non-functional except for the back control.

#### Scenario: User activates a profile action

- **WHEN** the user presses the profile/edit action or any profile row
- **THEN** no API call, persistence, authentication, edit submission, logging, or external action occurs
