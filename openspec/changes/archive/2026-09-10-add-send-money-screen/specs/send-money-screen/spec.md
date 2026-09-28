## Purpose

Provide authenticated users with a polished, static Send Money destination
that matches the supplied mobile design while allowing them to choose between
two available source cards through horizontal swiping.

## ADDED Requirements

### Requirement: Home Send action opens Send Money

The Home screen's `Send` action SHALL navigate to the authenticated
`/send-money` route. The other Home payment actions remain presentation-only.

#### Scenario: User starts sending money from Home

- **WHEN** an authenticated user presses `Send` on the Home screen
- **THEN** the app opens the Send Money screen
- **AND** no transaction or API operation is performed

### Requirement: Send Money back control returns Home

The Send Money back control SHALL return the user to the authenticated Home
route at `/home` without submitting, persisting, or creating a transaction.

#### Scenario: User leaves Send Money

- **WHEN** the user presses the Send Money back control
- **THEN** the Home screen is opened
- **AND** no transaction or API operation is performed

### Requirement: Send Money displays the approved visual composition

The Send Money destination SHALL render the supplied reference composition at
the existing app viewport, including a back control, centered `Send Money`
title, source-card area, recipient controls, amount/details content, and a
primary `Send Money` action. It MUST use the app's existing Poppins typography,
colors, spacing, rounded surfaces, and icon treatment. The blue decorative
ellipses present in the SVG reference MUST NOT be rendered.

#### Scenario: User opens Send Money

- **WHEN** an authenticated user opens the Send Money route
- **THEN** the complete designed composition is visible
- **AND** the bottom tab bar is hidden
- **AND** the blue decorative ellipses are absent

### Requirement: User can select and clear a recipient

The recipient section SHALL initially show the available static recipient
choices. Selecting one recipient MUST replace those choices with only the
selected recipient's circular avatar, name, and account information, plus a
clear control. Clearing the selection MUST restore the recipient choices.
Recipient selection is local presentation state and MUST NOT call an API,
persist data, or create a transaction.

#### Scenario: User selects a recipient

- **WHEN** the recipient choices are visible
- **AND** the user presses a recipient
- **THEN** only that recipient summary is visible
- **AND** the recipient name and account information are shown beside the
  circular avatar
- **AND** a clear control is visible

#### Scenario: User clears a recipient

- **WHEN** a recipient is selected
- **AND** the user presses the clear control
- **THEN** the selected recipient summary is removed
- **AND** the recipient choices are visible again

### Requirement: User can enter a valid send amount

The amount card SHALL match the reference composition with an `Enter Your
Amount` label, a `Change Currency?` presentation control, a visible `USD`
currency code, and an editable amount field. The amount field MUST accept
non-negative values only and MUST retain no more than two decimal places.
Amount editing is local presentation state and MUST NOT submit, persist, or
create a transaction.

#### Scenario: User enters a valid amount

- **WHEN** the user edits the amount field
- **THEN** the entered non-negative amount remains visible
- **AND** the value contains no more than two decimal places

#### Scenario: User enters a negative amount

- **WHEN** the user enters a negative amount
- **THEN** the amount is clamped to `0`

#### Scenario: User clears the amount

- **WHEN** the user clears the amount field
- **THEN** the field remains editable
- **AND** no transaction or API operation occurs

### Requirement: Send Money reuses the shared payment card

The source-card area MUST render the existing shared payment-card presentation
rather than introducing a Send Money-specific card implementation. It MUST
contain exactly two static card fixtures, one Mastercard and one Visa, with
values suitable for the reference composition.

#### Scenario: User views available source cards

- **WHEN** the Send Money destination is rendered
- **THEN** a Mastercard card fixture is available in the source-card carousel
- **AND** a Visa card fixture is available in the source-card carousel
- **AND** both cards use the shared payment-card presentation

### Requirement: User can choose the source card by swiping

The source-card area SHALL behave as a horizontally paged carousel. The
initially visible card MUST be the Mastercard fixture. A left or right swipe
that reaches the adjacent page MUST change the visible card and selected-card
state to the corresponding fixture.

#### Scenario: User swipes from Mastercard to Visa

- **WHEN** the Mastercard page is selected
- **AND** the user swipes left to the adjacent page
- **THEN** the Visa page becomes visible
- **AND** the Visa card is represented as the selected source card

#### Scenario: User swipes from Visa to Mastercard

- **WHEN** the Visa page is selected
- **AND** the user swipes right to the adjacent page
- **THEN** the Mastercard page becomes visible
- **AND** the Mastercard card is represented as the selected source card

#### Scenario: User swipes beyond the available cards

- **WHEN** the user is on the first or last card page
- **AND** the user attempts to swipe beyond the carousel bounds
- **THEN** the carousel remains within the two available card pages
- **AND** no additional card is created or selected

### Requirement: Non-navigation, non-input Send Money controls remain
presentation-only

The currency control and primary `Send Money` action MUST be rendered with
static presentation data only. They MUST NOT navigate, call an API, persist
data, or create a transaction.

#### Scenario: User presses a presentation-only control

- **WHEN** the user presses the currency control or primary `Send Money`
  action
- **THEN** no business operation, API request, persistence operation, or
  transaction occurs
- **AND** the screen remains a static UI
