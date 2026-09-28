## Context

See `proposal.md` for the motivation and `specs/` for the observable
requirements. The app is an Expo SDK 56 TypeScript application using Expo
Router, Emotion Native, Poppins fonts, and Jest with React Native Testing
Library. The root layout currently loads fonts and renders the router without a
localization provider. Screen components contain hard-coded English copy.

The authenticated shell is a Tabs layout. Settings already has a nested Stack
boundary, and its existing List Cards route hides the parent tab bar while a
child screen is focused. The Settings Language row currently has a no-op
handler.

## Goals / Non-Goals

**Goals:**

- Establish one app-wide localization source that can rerender mounted screens
  immediately when the active language changes.
- Keep locale resources organized as `en`, `fr`, and `es` directories with one
  JSON file for each screen component or route-level screen.
- Restore a saved locale before the app becomes interactive, with device-locale
  detection and English fallback.
- Add the Language screen within the existing Settings navigation boundary and
  preserve the current tab-bar behavior.
- Keep translation lookup and persistence testable without native device state.

**Non-Goals:**

- Do not translate card fixture data, account fixture data, currency values, or
  other domain data that is not user-interface copy.
- Do not add server-side language profiles, account synchronization, or API
  calls.
- Do not expand the language list beyond English, French, and Spanish.
- Do not replace the existing Emotion Native styling or router architecture.
- Do not persist the biometric setting as part of this change.

## Decisions

### Use React i18next with Expo localization and SecureStore

Add `react-i18next` and its `i18next` peer dependency for translation lookup
and React rerendering. Add the Expo SDK 56-compatible `expo-localization` and
`expo-secure-store` packages through `npx expo install`, rather than using a
generic React Native storage library.

Use `expo-localization` to read the initial device language. Use
`expo-secure-store` to save the selected locale under a single namespaced key.
Only the two-letter locale code is stored, so the value remains small and does
not require biometric authentication.

An adapter boundary will keep persistence platform-aware: native builds use
SecureStore, while the web target can use its browser storage equivalent when
SecureStore is unavailable. Both adapters expose the same async get/set
contract, and invalid or unavailable values fall back safely to English.

Using only device locale is rejected because a user-selected preference must
survive device settings and app restarts. Using AsyncStorage is rejected
because the requirement specifically calls for Expo packages and the app does
not already depend on AsyncStorage.

### Bootstrap localization before hiding the splash screen

Create a localization bootstrap/provider under the existing source tree and
initialize it from the root layout. The bootstrap sequence will:

1. Read and validate the saved locale.
2. If no valid saved locale exists, read the first device locale.
3. Select English when the device locale is unsupported.
4. Initialize i18next with the selected locale and its resources.
5. Allow the root layout to render the router only after fonts and localization
   are ready.

Keeping the splash screen visible until both font and locale initialization
finish avoids an English flash followed by a translated screen. Runtime
selection uses i18next's language change operation and updates the provider
without restarting the router.

### Keep resources screen-scoped and explicit

Store resources in a structure equivalent to:

```text
src/i18n/
  locales/
    en/
      welcome.json
      login.json
      create-account.json
      onboarding-1.json
      onboarding-2.json
      onboarding-3.json
      home.json
      my-cards.json
      statistics.json
      settings.json
      language.json
      profile.json
      edit-profile.json
      list-cards.json
      add-card.json
      change-password.json
      send-money.json
    fr/
      ...
    es/
      ...
```

The exact resource list follows the current route/screen inventory. Shared
translation keys are duplicated only where they belong to separate screen
contracts; a screen must not reach into another screen's resource file.
Translation keys, rather than English strings, will be passed to visible text,
placeholders, and user-facing accessibility labels.

### Implement Language as a nested Settings screen

Add a thin route adapter at
`app/(closed)/settings/language.tsx` and a presentational
`LanguageScreen` under `src/settings/screens`. Reuse the existing nested
Settings Stack and the focus-based parent tab-bar hide/show pattern used by
List Cards. Keep the route adapter responsible for route/focus behavior and
the screen responsible for rendering and selection.

Build the screen with Emotion Native primitives and existing Phosphor icons.
Use the Figma spacing, typography, search field, row dividers, circular
language artwork area, and active check indicator as the visual reference, but
render only English, French, and Spanish. The search field is a presentational
control unless filtering behavior is required by the final screen tests.

The Settings Language row will push `/settings/language` and read the active
locale through the localization hook. Its displayed value will therefore
update when the language changes and when the user returns from the child
screen.

### Test through storage and locale seams

Add focused tests for:

- Language screen rendering, exactly three options, active indicator, back
  navigation, and selection.
- Settings navigation to Language and active-language display.
- Locale bootstrap precedence: saved locale, supported device locale, and
  English fallback.
- SecureStore/browser-storage success and failure paths through the adapter.
- Immediate translation updates on mounted Settings and a second screen.
- Existing screen tests with the English resource set as the deterministic
  default.

Native modules will be mocked at the seam rather than requiring SecureStore or
device locale state in Jest.

## Risks / Trade-offs

- **[Risk]** SecureStore is a native Expo API and is not available in the same
  way on the web target. **Mitigation:** isolate storage behind a platform-aware
  adapter and use browser storage only for the web build.
- **[Risk]** Delayed locale initialization can flash untranslated content.
  **Mitigation:** keep the existing splash screen visible until fonts and
  localization are both ready.
- **[Risk]** Migrating hard-coded copy across all screens can leave a key
  untranslated or make accessibility labels inconsistent. **Mitigation:** use
  a complete route inventory, require all three resource files per screen, and
  add translation-key coverage tests.
- **[Risk]** Existing tests query English literals and may fail after
  localization. **Mitigation:** initialize tests with English resources and
  update assertions to use the translated English output while adding language
  switch coverage separately.
- **[Risk]** The supplied Figma frame references image assets that are not
  currently checked into the repository. **Mitigation:** keep visual assets
  local or use existing icon primitives rather than depending on expiring
  remote Figma asset URLs.

## Migration Plan

1. Install the i18next packages and Expo SDK 56 packages with `npx expo
   install`, then add the localization bootstrap/provider and resource
   directories.
2. Add English resources from the current screen copy, then add French and
   Spanish resources and migrate every screen to translation keys.
3. Add the nested Language route, hide the parent tab bar on focus, and update
   Settings navigation/value rendering.
4. Add focused localization, Language, Settings, route, and persistence tests,
   then run the full Jest, TypeScript, and Expo lint checks.
5. Roll back by removing the Language route/screen, localization provider and
   resources, Expo dependencies/configuration, and restoring Settings' current
   Language no-op. No server or data migration is required.
