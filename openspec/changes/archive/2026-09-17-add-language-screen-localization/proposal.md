## Why

App currently exposes a Language row in Settings, but it does not navigate
or change any application text. The product now needs a real language
preference flow so users can choose English, French, or Spanish and keep that
choice across app restarts.

## What Changes

- Add a Language screen reachable from Settings > Language and match the
  supplied Figma reference at
  https://www.figma.com/design/6hKO9hsAXksBOpQjUTu3LM/Close-brothers-demo?node-id=1-7723&t=5hqnOe7E4VMzHrkg-4.
- Present exactly three selectable options: English, French, and Spanish.
- Add app-wide `react-i18next` localization with one locale directory per
  language and one JSON translation file per screen.
- Translate existing user-facing screen copy into all three supported
  languages.
- Apply a selected language immediately throughout mounted screens.
- Persist the selected language with Expo-supported device storage and restore
  it on startup, falling back to the device locale when supported and English
  otherwise.
- Update Settings to open the Language screen and display the active language.
- Add focused screen, navigation, persistence, and localization tests.

## Capabilities

### New Capabilities

- `language-selection`: Provides the Language screen, its three options,
  selection state, search presentation, and persisted user choice.
- `app-localization`: Provides the supported locale resources and applies the
  selected language to user-facing copy across every existing screen.

### Modified Capabilities

- `settings-screen`: The Language row must navigate to the Language screen and
  show the currently selected language instead of remaining a no-op.

## Impact

- Expo Router routes and the existing Settings screen module.
- A new localization module/provider used by the root app layout and all screen
  components.
- New `react-i18next`/`i18next` dependencies plus Expo SDK 56-compatible
  `expo-localization` and `expo-secure-store` packages installed through
  `npx expo install`.
- Translation JSON resources for every existing screen in English, French, and
  Spanish.
- Existing screen and navigation tests, with no backend or API changes.
