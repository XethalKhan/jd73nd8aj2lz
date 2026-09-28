## Purpose

Make all screen copy available in English, French, and Spanish so the
user's supported language preference is reflected consistently throughout the
application.

## ADDED Requirements

### Requirement: All screen copy supports the supported languages

The app MUST provide translated user-facing copy for every existing app screen
in English, French, and Spanish. This includes visible text, input
placeholders, button labels, row labels, headings, and user-facing
accessibility labels. Translation resources MUST be organized with one locale
directory per supported language and one JSON resource file per screen.

#### Scenario: User views a screen in French

- **WHEN** French is the active language and the user opens any existing screen
- **THEN** the screen displays French copy for its user-facing text and
  accessibility labels

#### Scenario: User views a screen in Spanish

- **WHEN** Spanish is the active language and the user opens any existing
  screen
- **THEN** the screen displays Spanish copy for its user-facing text and
  accessibility labels

### Requirement: Language changes apply across mounted screens

The app MUST use the active supported language for all mounted screens without
requiring an app restart or a new login session. When a translation is missing,
the app MUST fall back to English rather than displaying an untranslated key.

#### Scenario: User changes language while Settings is open

- **WHEN** the user selects French or Spanish from the Language screen and
  returns to Settings
- **THEN** the Settings screen displays its translated copy and the selected
  language value

#### Scenario: User changes language before opening another screen

- **WHEN** the user selects a supported language and then navigates to another
  screen
- **THEN** the newly opened screen displays copy in the selected language

### Requirement: Startup language follows saved preference or supported device locale

On startup, the app MUST restore a previously saved supported language before
using device locale detection. If there is no saved language, the app MUST use
the device language when it is English, French, or Spanish, and MUST use
English for unsupported or unavailable device languages.

#### Scenario: Supported device locale without a saved preference

- **WHEN** the app starts on a device configured for French and no language
  preference is saved
- **THEN** the app starts in French

#### Scenario: Unsupported device locale without a saved preference

- **WHEN** the app starts on a device configured for an unsupported language
  and no language preference is saved
- **THEN** the app starts in English
