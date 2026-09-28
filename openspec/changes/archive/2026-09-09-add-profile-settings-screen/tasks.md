## 1. Profile Screen UI

- [x] 1.1 Create `src/settings/screens/ProfileScreen.tsx` with a safe-area-aware white layout, reference-matched header, static avatar and account summary, seven profile rows, separators, icons, chevrons, and notification badge; verify the Profile screen test renders the required visible content.
- [x] 1.2 Add accessible press targets for the Profile back control, edit/profile action, and profile rows, with only the back control requesting router back navigation; verify the interaction test confirms back navigation and no-op behavior for all other controls.

## 2. Settings and Route Integration

- [x] 2.1 Add `app/(closed)/profile.tsx` as a thin route adapter and register it in `app/(closed)/_layout.tsx` as a non-selectable route with the tab bar hidden while active; verify the navigation tests preserve the four visible tabs and exclude Profile from tab selection.
- [x] 2.2 Update `SettingsScreen` so only the My Profile row pushes the hidden Profile route while Language, Contact Us, Change Password, Privacy Policy, Log out, and the local Biometric behavior remain unchanged; verify the Settings interaction test asserts the Profile push and existing local behaviors.

## 3. Validation

- [x] 3.1 Add or update focused Jest and React Native Testing Library coverage for Profile rendering, Profile back navigation, static profile actions, Settings-to-Profile navigation, and unchanged Settings interactions; verify the targeted settings, profile, and tab-navigation tests pass.
- [x] 3.2 Run the relevant Jest suite, Expo lint, and TypeScript validation; verify there are no test, lint, or type errors and no new dependency or API integration was introduced.
