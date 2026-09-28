## Purpose

Provide users with a faithful, presentational Edit Profile view that exposes the approved static account details without introducing account-management behavior.

## ADDED Requirements

### Requirement: Edit Profile screen presents the approved account details design

The Edit Profile screen MUST present the approved mobile design referenced at https://www.figma.com/design/6hKO9hsAXksBOpQjUTu3LM/Close-brothers-demo?node-id=1-6952&t=5hqnOe7E4VMzHrkg-4. When Figma is unavailable, the checked-in `EDIT_PROFILE.svg` is the visual fallback reference. The screen MUST show a white 375x812-style mobile layout with a back control, centered “Edit Profile” title, profile-photo affordance, “Tanya Myroniuk”, “Senior Designer”, and the account detail copy “Full Name”, “Tanya Myroniuk”, “Email Address”, “tanya.myroniuk@gmail.com”, “Phone Number”, “+8801712663389”, “Birth Date”, “28”, “September”, “2000”, and “Joined 28 Jan 2021”. The name, email, phone, and birth-date values MUST be editable text inputs. It MUST preserve the reference’s Poppins typography, text colors, icon colors, separators, spacing, and alignment.

#### Scenario: User views Edit Profile

- **WHEN** the authenticated Edit Profile route is rendered
- **THEN** the user sees the designed header, avatar, account summary, detail rows, birth-date values, and joined date with the specified copy and visual styling

### Requirement: Edit Profile back navigation is available

The Edit Profile screen MUST request back navigation when the user activates its top-left back control.

#### Scenario: User activates the Edit Profile back control

- **WHEN** the user presses the top-left back control
- **THEN** the current Edit Profile route requests back navigation to the Profile screen

### Requirement: Edit Profile editing is local and unsaved

The Edit Profile screen MUST keep edited name, email, phone, and birth-date values in local screen state. It MUST show a disabled Save control until API support exists and MUST NOT persist changes, call an API, change authentication, log events, submit data, or perform external actions.

#### Scenario: User edits an Edit Profile detail area

- **WHEN** the user edits an account detail input
- **THEN** the visible value updates locally, while Save remains disabled and no API call, persistence, authentication, logging, submission, or external action occurs.
