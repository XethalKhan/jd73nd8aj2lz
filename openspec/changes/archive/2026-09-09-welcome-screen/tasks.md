## 1. Establish the open entry routes

- [x] 1.1 Add the `(open)` route layout and configure the root entry to send the default unauthenticated flow to the welcome route; verify Expo Router resolves the root and welcome paths without route errors.
- [x] 1.2 Add login and create-account destination screens under the `(open)` group with clear headings and placeholder content; verify each route renders independently.

## 2. Build the welcome experience

- [x] 2.1 Add a checked-in banking illustration inspired by the third supplied Figma frame and verify the asset loads from a local project path without a remote network request.
- [x] 2.2 Implement the welcome screen with Emotion styling, safe-area-aware responsive layout, branding, dark navy typography, muted supporting text, and the local illustration; verify the screen matches the specified visual direction on a mobile viewport.
- [x] 2.3 Add equal-sized accessible `Sign in` and `Sign up` controls using the approved Paper/component approach, with outlined and filled blue variants; verify both labels are exposed to accessibility queries and touch targets remain usable.
- [x] 2.4 Wire `Sign in` to the login route and `Sign up` to the create-account route; verify each action invokes the expected navigation destination in screen tests.

## 3. Add behavioral coverage

- [x] 3.1 Add welcome-screen tests with Expo Router navigation mocked at the screen boundary; verify both button labels render and each button navigates to the correct route.
- [x] 3.2 Add smoke tests for the login and create-account destination screens; verify their headings render and the welcome actions are not shown as primary content.

## 4. Validate the change

- [x] 4.1 Run the focused Jest and React Native Testing Library tests; verify all welcome-flow tests pass.
- [x] 4.2 Run Expo lint and TypeScript validation; verify the new routes, styles, asset imports, and tests introduce no lint or type errors.
