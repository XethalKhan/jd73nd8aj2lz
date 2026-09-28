## Context

The authenticated area already keeps Profile in `src/settings/screens/ProfileScreen.tsx`, exposes it through a hidden sibling route, and hides the bottom tab bar for that route. The current Profile controls are presentational no-ops. The new screen must follow the repository’s existing Expo Router, `@emotion/native`, safe-area, Poppins font, Phosphor icon, and Jest testing patterns.

The visual source is the Figma node in the proposal. Figma MCP access was rate-limited during discovery, so the checked-in `EDIT_PROFILE.svg` is the fallback source of truth for the 375x812 composition, copy, colors, spacing, and icon placement.

## Goals / Non-Goals

**Goals:**

- Add a visually faithful Edit Profile screen under the existing Settings module boundary.
- Preserve the 375x812 reference hierarchy while allowing the detail content to remain usable on smaller or taller devices.
- Provide navigation into the screen from both existing Profile entry points and back to Profile.
- Keep the account details accessible and locally editable, without persistence or API behavior.
- Preserve the existing four visible authenticated tabs.

**Non-Goals:**

- No validation, enabled save/submit action, account mutation, API, authentication, persistence, analytics, or logging. Save remains disabled until API support exists.
- No new package, image pipeline, account model, or shared profile-data abstraction.
- No changes to unrelated Profile rows, Settings behavior, or visible tab destinations.

## Decisions

### Keep the screen in the Settings module

Create `EditProfileScreen` under `src/settings/screens` and keep its route adapter thin. This matches the existing screen organization and keeps the Settings/Profile feature boundary intact.

### Use a hidden authenticated sibling route

Add `app/(closed)/edit-profile.tsx` and register it in `app/(closed)/_layout.tsx` with `href: null` and a hidden tab-bar style. Profile can push `/edit-profile`, and the Edit Profile back control can use the existing router back behavior.

An authenticated nested route under `settings` was considered, but it would require extra nesting and could retain the tab chrome unless additional layout behavior were introduced. A sibling route follows the existing Profile solution and matches the reference’s full-screen presentation.

### Rebuild the SVG as native UI primitives

Use `SafeAreaView`, styled native layout/text primitives, and Phosphor icons for the back, person, email, and phone glyphs. Render the avatar and all account values as native views and text rather than embedding `EDIT_PROFILE.svg`.

This keeps text accessible and testable, permits responsive sizing, and avoids treating a design export with text converted to paths as the application UI. The SVG remains the visual reference for exact copy and proportions.

### Make the back control and local inputs interactive

The Personal Information row and top-right profile action will call `router.push("/edit-profile")`. Edit Profile will expose one accessible back control that calls `router.back()`, local text inputs for the approved account values, a profile-photo affordance, and a disabled Save control. No input will submit or persist data.

### Keep static copy localized to the screen

Use the reference values directly in the screen: Tanya Myroniuk, Senior Designer, tanya.myroniuk@gmail.com, +8801712663389, 28, September, 2000, and Joined 28 Jan 2021. This intentionally avoids introducing data loading or persistence that is outside the approved scope.

### Test at the screen and route-integration boundaries

Add focused tests for Edit Profile rendering, exact copy, back navigation, and absence of edit behavior. Update Profile tests to verify both entry points push the Edit Profile route while the remaining rows stay no-op. Update tab-navigation coverage to confirm the new route is hidden and the four visible tabs remain unchanged.

## Risks / Trade-offs

- [Risk] Native icon glyphs may differ slightly from the exported Figma icons. -> Mitigation: use the existing Phosphor family with the reference stroke weight, tint, and size, consistent with the current Profile screen.
- [Risk] The fixed reference canvas may not fit every device height exactly. -> Mitigation: use safe-area-aware layout and a scrollable content region while preserving reference margins and vertical rhythm.
- [Risk] Static placeholder account values can diverge from future account data. -> Mitigation: keep them explicitly localized and document data integration as out of scope.
- [Risk] A hidden sibling route could be accidentally exposed as a tab. -> Mitigation: register it with `href: null`, hide its tab bar, and assert route visibility through navigation tests.
