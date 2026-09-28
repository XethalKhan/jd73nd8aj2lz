## 1. Edit Profile Screen

- [x] 1.1 Read the Expo SDK 56 documentation required by the repository instructions, then create `src/settings/screens/EditProfileScreen.tsx` with a safe-area-aware native layout matching `EDIT_PROFILE.svg`; verify the screen uses the existing Emotion, Poppins, Phosphor, and static-content patterns.
- [x] 1.2 Render the exact header, avatar, account summary, detail labels and values, birth-date columns, separators, icons, and “Joined 28 Jan 2021” copy from the approved design; verify the visible text and structure match the Edit Profile spec.
- [x] 1.3 Make only the top-left back control navigate, add local inputs for name, email, phone, and birth date, and keep Save disabled pending API support; verify no persistence, API, authentication, logging, or external-action behavior is introduced.

## 2. Route and Profile Integration

- [x] 2.1 Add `app/(closed)/edit-profile.tsx` as a thin route adapter and register it as a hidden authenticated sibling route with the tab bar hidden; verify the four visible tabs remain unchanged and Edit Profile is not selectable.
- [x] 2.2 Update `ProfileScreen` so Personal Information and the top-right Edit profile action push `/edit-profile`; verify all other Profile rows remain local no-ops and the existing Profile back behavior remains unchanged.

## 3. Focused Tests

- [x] 3.1 Add Edit Profile screen tests for exact copy, design sections, local input editing, disabled Save behavior, and back navigation; verify the focused Edit Profile Jest test passes.
- [x] 3.2 Update Profile screen tests for both Edit Profile entry points and unchanged no-op rows; verify the focused Profile Jest test passes.
- [x] 3.3 Update authenticated navigation tests for the hidden Edit Profile route and unchanged visible tabs; verify the focused tab-navigation Jest test passes.

## 4. Validation

- [x] 4.1 Run the targeted settings, Profile, Edit Profile, and tab-navigation Jest tests; verify all pass.
- [x] 4.2 Run Expo lint and TypeScript validation; verify there are no lint or type errors and no new dependency or integration was introduced.
