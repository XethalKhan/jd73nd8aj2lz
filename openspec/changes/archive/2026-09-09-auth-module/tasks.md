## 1. Add local visual assets and font loading

- [x] 1.1 Add the required Poppins font weights and Figma-derived back, email, phone, lock, eye, and status/icon assets under local project asset paths; verify every runtime asset is referenced from a checked-in path and no Figma URL remains in source.
- [x] 1.2 Add the root Expo layout font-loading boundary and preserve the existing router configuration; verify the app starts with fonts loaded and TypeScript accepts the font-loading code.

## 2. Build the auth screen module

- [x] 2.1 Move `WelcomeScreen` and its test into `src/auth/screens`, update the local illustration path and imports, and remove obsolete component ownership; verify Welcome screen tests still pass and no route imports the old component path.
- [x] 2.2 Add shared Emotion Native auth primitives for the safe-area canvas, back control, field rows, local icons, footer copy, and blue rounded action button; verify the shared primitives render with accessible labels and the expected 20px/56px/16px reference dimensions.
- [x] 2.3 Implement `LoginScreen` with the exact Figma copy, field order, local email/lock/eye icons, Poppins typography, reference spacing, and responsive portrait layout; verify a screen test finds every required visible label and control.
- [x] 2.4 Implement `SignUpScreen` with the exact Figma copy, full-name/phone/email/password field order, local icons, Poppins typography, reference spacing, and responsive portrait layout; verify a screen test finds every required visible label and control.

## 3. Wire navigation behavior

- [x] 3.1 Replace the `(open)` placeholder route bodies with thin adapters for the auth-module screens and preserve the welcome routes; verify each route resolves to the intended screen without placeholder content.
- [x] 3.2 Add the minimal Home screen under `app/(closed)` as the Login destination; verify the closed route resolves independently and is clearly limited to routing-placeholder content.
- [x] 3.3 Wire back controls to return to the previous destination and wire Login submission to replace the route with Home regardless of field values; verify navigation tests cover empty and arbitrary credentials with no validation error.
- [x] 3.4 Keep Sign Up submission and exact footer copy presentational because account creation is out of scope; verify no API, session, credential-storage, or account-creation call is introduced.

## 4. Validate the complete change

- [x] 4.1 Update or add screen tests for rendering, accessibility labels, text entry, back navigation, Welcome actions, Login-to-Home navigation, and placeholder removal; verify the focused Jest suite passes.
- [x] 4.2 Run Expo lint and TypeScript validation; verify the new module, assets, routes, and font-loading code introduce no lint or type errors.
- [x] 4.3 Render Login and Sign Up at the 375x812 reference viewport and at a second supported portrait size; verify visual hierarchy, required controls, copy, icons, and primary actions are visible without clipping.
