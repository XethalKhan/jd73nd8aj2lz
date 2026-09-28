## Purpose

Provide users with a focused language preference screen where they can choose
the supported language and see the active choice across app sessions.

## ADDED Requirements

### Requirement: Language screen presents the supported language choices

The authenticated app MUST provide a Language screen reachable from Settings >
Language. The screen MUST match the supplied mobile design reference,
including a back control, centered Language title, Search Language field, and
divider-separated language rows. It MUST present exactly three selectable
options: English, French, and Spanish.

Design reference:
https://www.figma.com/design/6hKO9hsAXksBOpQjUTu3LM/Close-brothers-demo?node-id=1-7723&t=5hqnOe7E4VMzHrkg-4

#### Scenario: User opens the Language screen

- **WHEN** the user activates Language from Settings
- **THEN** the app navigates to the Language screen without showing the
  authenticated bottom tab bar over the screen

#### Scenario: User views available languages

- **WHEN** the Language screen is rendered
- **THEN** the user sees English, French, and Spanish, and no additional
  selectable language options

#### Scenario: User returns from the Language screen

- **WHEN** the user activates the Language screen back control
- **THEN** the app requests back navigation to Settings

### Requirement: Selecting a language changes and persists the preference

The Language screen MUST identify the active language. When the user selects a
different supported language, the app MUST apply that language immediately,
update the active selection indicator, and persist the choice for future app
launches.

#### Scenario: User selects French

- **WHEN** the user selects French
- **THEN** French becomes the active language immediately and the selection
  indicator moves to French

#### Scenario: User selects Spanish

- **WHEN** the user selects Spanish
- **THEN** Spanish becomes the active language immediately and the selection
  indicator moves to Spanish

#### Scenario: User relaunches after selecting a language

- **WHEN** the app starts after the user previously selected French or Spanish
- **THEN** the previously selected language is restored as the active language
