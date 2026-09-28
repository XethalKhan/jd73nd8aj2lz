## 1. Localization foundation

- [x] 1.1 Install `react-i18next` and `i18next`, then install the Expo SDK 56-compatible `expo-localization` and `expo-secure-store` packages with `npx expo install`; verify the dependency tree resolves without Expo version warnings.
- [x] 1.2 Create the locale type, supported-language list, translation resource loader, and platform-aware persisted-locale adapter; verify unit tests cover valid values, invalid values, missing storage, and storage failures.
- [x] 1.3 Add i18next initialization and a React provider to the root layout, using the saved locale before supported device locale and English fallback; keep the splash screen visible until fonts and localization are ready, and verify bootstrap precedence tests pass.
- [x] 1.4 Configure translation fallback behavior so missing French or Spanish keys resolve to English rather than a raw key; verify a missing-key test returns English copy.

## 2. Translation resources

- [x] 2.1 Create `src/i18n/locales/en`, `src/i18n/locales/fr`, and `src/i18n/locales/es` with one JSON file per existing screen: welcome, login, create-account, onboarding-1, onboarding-2, onboarding-3, home, my-cards, statistics, settings, language, profile, edit-profile, list-cards, add-card, change-password, and send-money; verify every locale has the same file and key inventory.
- [x] 2.2 Populate English resources from the current screen copy, including visible text, placeholders, button labels, headings, and accessibility labels; verify the English resource coverage test finds no hard-coded user-facing key omissions.
- [x] 2.3 Add French translations for every English resource key and verify representative auth, onboarding, Settings, and money-transfer screens render French copy.
- [x] 2.4 Add Spanish translations for every English resource key and verify representative auth, onboarding, Settings, and money-transfer screens render Spanish copy.

## 3. Existing screen migration

- [x] 3.1 Migrate welcome, login, create-account, and change-password screens to translation keys while preserving their current navigation and form behavior; verify the focused auth tests pass in English.
- [x] 3.2 Migrate onboarding screens and shared onboarding accessibility labels to translation keys while preserving slide navigation; verify onboarding tests pass in English and a language-switch assertion renders translated copy.
- [x] 3.3 Migrate Home, My Cards, List Cards, and Add Card screens to translation keys while leaving fixture data and currency values unchanged; verify focused home/cards tests pass.
- [x] 3.4 Migrate Profile, Edit Profile, Settings, Statistics, and Send Money screens to translation keys, including user-facing accessibility labels; verify focused settings/profile/send-money tests pass in English and translated text appears after a locale change.

## 4. Language screen and navigation

- [x] 4.1 Create `LanguageScreen` under `src/settings/screens` with the Figma-referenced header, search presentation, three language rows, dividers, circular artwork areas, active check indicator, Emotion Native styling, and back behavior; verify its screen test renders exactly English, French, and Spanish.
- [x] 4.2 Add `app/(closed)/settings/language.tsx` as a thin nested Settings route and hide the authenticated tab bar while focused, restoring it when leaving; verify the route and tab-bar navigation tests pass.
- [x] 4.3 Connect language row selection to i18next, update the active indicator immediately, and persist the selected locale through the Expo storage adapter; verify selecting French and Spanish updates mounted copy and calls persistence.
- [x] 4.4 Update Settings Language navigation and active-language value rendering without changing existing Profile, Change Password, biometric, logout, or no-op row behavior; verify the Settings interaction test covers all existing behaviors plus `/settings/language`.

## 5. Validation

- [x] 5.1 Add coverage for startup restoration, supported device locale detection, unsupported-locale English fallback, immediate mounted-screen updates, and persistence failure recovery; verify the localization test suite passes.
- [x] 5.2 Run the focused Language, Settings, navigation, and localization Jest tests, then run the full Jest suite; verify no existing tests regress.
- [x] 5.3 Run TypeScript checks and `npm run lint`; verify there are no type, lint, or Expo dependency validation errors.
- [x] 5.4 Compare the Language route at a 375x812 portrait viewport against the supplied Figma frame, including header spacing, search field, row dividers, option count, selection indicator, and hidden tab bar; record and fix any in-scope visual mismatch.
