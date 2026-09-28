## Why

The authenticated Profile screen currently exposes “Personal Information” and “Edit profile” controls without a destination. Users need the designed Edit Profile page to view the approved account details layout from either entry point.

## What Changes

- Add an editable Edit Profile screen in the Settings module matching the supplied mobile design.
- Add a hidden authenticated route for the Edit Profile screen with the profile header and bottom tab bar behavior shown by the design.
- Make the Profile “Personal Information” row and top-right “Edit profile” action navigate to Edit Profile.
- Allow local editing of name, email, phone, birth date, and profile-photo affordance while keeping Save disabled until API support exists.
- Add focused rendering and navigation tests for the new screen and both Profile entry points.

## Capabilities

### New Capabilities

- `edit-profile-screen`: Present the designed account details screen with static profile information and no edit or submit behavior.

### Modified Capabilities

- `profile-screen`: The Personal Information row and top-right Edit profile action now navigate to the authenticated Edit Profile screen.

## Impact

- Affected source: `src/settings/screens`, `app/(closed)`, and the existing Profile screen tests.
- Affected navigation: one new hidden authenticated route; the four visible authenticated tabs remain unchanged.
- No new dependencies, APIs, persistence, authentication, analytics, or backend systems.
- Design reference: https://www.figma.com/design/6hKO9hsAXksBOpQjUTu3LM/Close-brothers-demo?node-id=1-6952&t=5hqnOe7E4VMzHrkg-4
- Figma MCP access was unavailable during discovery, so `EDIT_PROFILE.svg` is the visual fallback reference.
