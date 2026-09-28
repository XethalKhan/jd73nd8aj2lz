## Context

The project is an Expo 56 TypeScript application using Expo Router. The current
entry file only renders `Hello world!`; the `(open)` and `(closed)` route groups
exist but contain no screens or layouts. There is no authentication provider or
session store to determine a real logged-in state.

The referenced Figma frames are 375x812 onboarding screens. They establish the
visual direction rather than an exact welcome-screen layout: white background,
blue `#06F` actions, dark navy headings, muted gray supporting text, rounded
16px controls, and a large banking illustration in the upper half.

## Goals / Non-Goals

**Goals:**

- Create a mobile-first welcome entry experience consistent with the Figma
  direction.
- Provide reliable Expo Router navigation to login and create-account
  destinations.
- Keep the route structure ready for a future authenticated/unauthenticated
  session gate.
- Use the project's existing styling and component dependencies.
- Make the two entry actions testable and accessible.

**Non-Goals:**

- Implement authentication, credential validation, account creation, password
  recovery, or persistence of a user session.
- Build the authenticated banking experience.
- Recreate all three Figma onboarding screens or add onboarding pagination.
- Depend on short-lived remote Figma asset URLs at runtime.

## Decisions

### Use the existing Expo Router route groups

The welcome, login, and create-account screens will live in the `(open)` route
group. The `(closed)` group remains reserved for authenticated screens. The
root entry is the future session-gating seam and will route the current
unauthenticated default to the welcome screen.

This uses the existing file-based routing model instead of introducing a
second navigation system. It also keeps the eventual authenticated transition
localized to the root gate and route-group layouts.

### Keep authentication state out of this change

Because the repository has no auth provider, the initial entry will treat the
application as unauthenticated by default. The design must not invent a
backend, token, or persistence mechanism. A later auth change can replace the
root default with a session-aware redirect without changing the welcome
screen's public contract.

### Use a local static illustration inspired by the third Figma frame

The third reference frame, which shows a person surrounded by money and
payment imagery, best communicates apps banking context. The
implementation will use a checked-in local asset or a simple project-owned
illustration derived from that direction, rather than embedding Figma's
temporary asset URLs.

### Use one filled and one outlined action

`Sign up` will be the filled blue primary action and `Sign in` will be an
outlined secondary action. This preserves the reference screen's strong blue
call-to-action while giving both paths equal visibility and clear hierarchy.
Both controls will use the same width, height, radius, typography, and spacing.

### Use project-approved styling and components

Screen layout will use `@emotion/native`, and interactive controls will use
`react-native-paper` where its components fit the design. Navigation will use
Expo Router. This follows the repository's project context and avoids adding a
new styling system or UI dependency.

### Test behavior at the screen boundary

Tests will render the welcome screen with navigation mocked at the router
boundary. They will assert the visible labels and that each button invokes the
correct destination. Destination screens will have smoke coverage to ensure
the routes render.

## Risks / Trade-offs

- [Risk] No real session state means every launch defaults to the open flow.
  -> [Mitigation] Keep the root entry as the documented session-gating seam and
  explicitly defer authentication to a separate change.
- [Risk] A local illustration may not exactly match the supplied Figma artwork.
  -> [Mitigation] Match the reference composition, palette, and scale while
  keeping the asset local and stable.
- [Risk] Fixed reference dimensions can clip on smaller or taller devices.
  -> [Mitigation] Use safe-area-aware flex layout, allow the illustration to
  scale, and pin actions within the usable bottom area rather than relying on
  absolute screen coordinates.
- [Risk] Introducing both Paper and Emotion patterns inconsistently could make
  later screens harder to maintain.
  -> [Mitigation] Centralize the welcome palette and button variants in the
  screen/component styles and reuse the same primitives for the destination
  screens where practical.

## Migration Plan

1. Add the open route group screens and root entry behavior.
2. Add the local illustration and welcome screen tests.
3. Run lint, TypeScript validation, and the focused Jest tests.
4. If the change is rolled back, remove the new routes and restore the starter
   entry screen; no persisted data or external service changes are involved.
