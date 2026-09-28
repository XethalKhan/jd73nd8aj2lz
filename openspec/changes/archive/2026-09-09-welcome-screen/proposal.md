## Why

App currently opens to the Expo starter screen and has no clear entry point for users who are not authenticated. A branded welcome screen will establish the banking app's visual language and give new or returning users an obvious path to sign in or create an account.

## What Changes

- Replace the starter entry screen with an unauthenticated welcome screen.
- Add clear `Sign in` and `Sign up` actions.
- Navigate `Sign in` to a login screen route and `Sign up` to a create-account screen route.
- Establish the initial route structure for open (unauthenticated) and closed (authenticated) areas without implementing a backend authentication provider.
- Apply the visual direction from the referenced Figma onboarding screens: white canvas, blue primary actions, dark navy headings, rounded controls, and a banking-themed illustration.
- Add screen-level tests for rendering and both navigation actions.

## Capabilities

### New Capabilities

- `welcome-auth-entry`: Provides the unauthenticated welcome screen and navigation entry points for signing in or creating an account.

### Modified Capabilities

<!-- No existing requirements are present in the starter project. -->

## Impact

- Affected Expo Router screens under `app/`, including the root entry and open/closed route groups.
- New reusable presentation and navigation code may be added under the project source paths.
- Existing dependencies are sufficient: `@emotion/native`, `react-native-paper`, `expo-router`, and the configured Jest/testing-library stack.
- No API, backend, credential storage, or authenticated-session behavior is introduced by this change.
