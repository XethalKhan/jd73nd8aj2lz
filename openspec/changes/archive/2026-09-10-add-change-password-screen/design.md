## Context

The authenticated area uses Expo Router tabs with hidden secondary screens.
Auth screens are owned by `src/auth/screens`, use Poppins fonts loaded by the
root layout, and use `@emotion/native` plus local SVG assets for their visual
system. The existing auth primitives provide a safe-area canvas, field rows,
password icons, and a primary button, but the Change Password reference uses
a smaller title and a screen-specific three-field arrangement.

## Goals / Non-Goals

**Goals:**

- Match the supplied 375x812 Change Password reference with a responsive,
  safe-area-aware layout.
- Keep the screen implementation in the auth module and the route as a thin
  Expo Router adapter.
- Support local text entry and per-field password visibility toggles.
- Keep Settings navigation and the hidden authenticated route consistent with
  the existing closed-area routing structure.

**Non-Goals:**

- No password validation, strength checks, submission, API calls, auth
  state, persistence, analytics, or error states.
- No new dependencies, password assets, or changes to the visible tab bar.
- No changes to the existing Login or Sign Up behavior.

## Decisions

### Reuse the existing auth visual system with screen-specific layout styles

Use the existing auth colors, local back/lock/eye assets, safe-area shell,
Emotion Native styling, and primary button treatment. Add only the
screen-specific title, field spacing, header treatment, and layout needed by
the reference rather than changing shared primitives that already calibrate
Login and Sign Up.

Alternative: broaden `AuthPrimitives` to support every Change Password
variation. This would make the shared API more complex and could alter the
existing auth screens without a requirement to do so.

### Use controlled local fields and independent visibility state

Render Current Password, New Password, and Confirm Password as controlled
native text inputs initialized with empty strings. Keep one visibility state
per field so each eye control changes only its own `secureTextEntry` behavior.
The values are never read for validation or submission.

Alternative: use static masked text or an untracked form library. Static text
would contradict the confirmed editable-field behavior, while a form library
would add complexity without any submit or validation requirement.

### Keep route ownership separate from screen ownership

Add `app/(closed)/change-password.tsx` as a thin adapter for
`ChangePasswordScreen`, and register the route in the closed tab layout with
`href: null` and hidden tab-bar presentation. Update the existing Settings row
to call `router.push("/change-password")`, matching the sibling hidden route
pattern used by Profile and Edit Profile.

Alternative: nest the route under `settings`. The requested route is
`app/(closed)/change-password`, and a root-level hidden screen keeps the
navigation target consistent with the existing secondary routes.

### Leave the primary button non-functional

Render the blue Change Password button with its accessible label and no-op
press handler. Back navigation remains the only route action, while field
editing and visibility are local UI interactions.

Alternative: navigate or show a success state on press. That would introduce
observable password workflow behavior outside the requested UI-only scope.

## Risks / Trade-offs

- [Risk] Exact icon glyph metrics may differ slightly from the SVG reference.
  -> Mitigation: reuse the existing exported auth SVGs and calibrate size,
  stroke treatment, and placement at the 375x812 reference viewport.
- [Risk] Keyboard opening can reduce available vertical space.
  -> Mitigation: keep the screen scrollable and preserve the 20px horizontal
  inset so fields and the button remain reachable on shorter portrait
  devices.
- [Risk] A no-op primary button may look unfinished.
  -> Mitigation: expose the complete designed control while explicitly
  keeping its no-op behavior in tests and the capability contract.

## Migration Plan

1. Add the screen component and focused screen test.
2. Add the route adapter and hidden closed-area route registration.
3. Update Settings navigation and its focused test.
4. Run the focused Jest tests, TypeScript validation, and Expo lint.
5. Roll back by removing the new screen, route registration, and Settings
   navigation change; no persisted data or migration is involved.
