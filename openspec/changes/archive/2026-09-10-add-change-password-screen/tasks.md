## 1. Change Password screen

- [x] 1.1 Create `src/auth/screens/ChangePasswordScreen.tsx` with the
  safe-area-aware white layout, screen-specific title/header, three
  password rows, local back control, eye controls, separators, and primary
  button; verify the component renders the required labels and reference
  hierarchy at the 375x812 portrait size.
- [x] 1.2 Add controlled local state for the three empty password fields and
  independent visibility toggles; verify text entry updates only its field,
  eye presses toggle only that field's masking, and no submit or external
  action is introduced.

## 2. Authenticated route and Settings navigation

- [x] 2.1 Add `app/(closed)/change-password.tsx` as the route adapter and
  register the route in `app/(closed)/_layout.tsx` as hidden from the tab bar;
  verify the route resolves at `/change-password` without adding a visible
  tab.
- [x] 2.2 Update the Change Password row in
  `src/settings/screens/SettingsScreen.tsx` to navigate to
  `/change-password`; verify Settings still preserves its existing back,
  Profile, biometric, and no-op row behaviors.

## 3. Tests and validation

- [x] 3.1 Add focused `ChangePasswordScreen` tests for rendering,
  accessibility labels, empty editable fields, local text entry, visibility
  toggles, back navigation, and the non-functional primary button; verify the
  focused Jest test passes.
- [x] 3.2 Update `SettingsScreen` tests to assert Change Password navigation
  while retaining existing no-op and biometric assertions; verify the focused
  Settings test passes.
- [x] 3.3 Run the focused Jest suites, TypeScript validation, and Expo lint;
  verify the new screen, route, and navigation changes introduce no test,
  type, or lint errors.
