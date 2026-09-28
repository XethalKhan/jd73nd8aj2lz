## 1. Settings Screen Structure

- [x] 1.1 Create `src/settings/screens/SettingsScreen.tsx` with safe-area-aware layout, Figma-matched header, General and Security sections, row labels, separators, and biometric row; verify all required labels render in a screen test
- [x] 1.2 Add the back, logout, and chevron affordances using existing project assets or installed icons, with accessible labels and touch targets; verify the screen renders without adding dependencies
- [x] 1.3 Add local biometric toggle state and visual on/off behavior without persistence or side effects; verify pressing the control changes its displayed state only

## 2. Route Integration

- [x] 2.1 Replace the placeholder in `app/(closed)/settings/index.tsx` with the Settings screen component; verify the existing Settings tab route renders the designed screen
- [x] 2.2 Keep the existing closed-area tab layout and bottom navigation unchanged; verify the navigation test still declares all four selectable tabs and hides onboarding

## 3. Interaction Validation

- [x] 3.1 Add focused tests for back navigation, no-op logout, no-op non-biometric rows, and local biometric toggling using `@testing-library/react-native`; verify each requested interaction matches the Settings capability scenarios
- [x] 3.2 Run the relevant Jest tests and Expo lint checks; verify the Settings implementation passes without API calls, logging, or type/lint errors
