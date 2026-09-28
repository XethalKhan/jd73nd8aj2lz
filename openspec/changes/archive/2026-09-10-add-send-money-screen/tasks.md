## 1. Route and screen structure

- [x] 1.1 Add the Send Money screen module and route at
  `app/(closed)/send-money.tsx`, then verify the route renders the screen
  component directly.
- [x] 1.2 Register `send-money` in `app/(closed)/_layout.tsx` as a hidden
  non-selectable tab route, then verify the existing four primary tabs remain
  unchanged and the Send Money tab-bar style is hidden.

## 2. Send Money presentation

- [x] 2.1 Build the Send Money composition with Emotion Native, SafeAreaView,
  Poppins typography, existing colors, Phosphor icons, and static reference
  copy, then verify the header, recipient area, amount/details panel, and
  primary action render at the target portrait viewport.
- [x] 2.2 Add the horizontal paged source-card carousel using two local
  fixtures and the shared `src/components/Card`, with Mastercard initially
  selected and Visa as the adjacent page; verify both card brand test IDs
  render and no blue decorative ellipse is present.
- [x] 2.3 Keep currency and primary Send Money controls behaviorless,
  then verify pressing them produces no navigation, persistence, API call, or
  transaction effect.

## 3. Verification

- [x] 3.1 Add Send Money screen tests covering the reference composition,
  hidden route behavior, shared Mastercard and Visa card rendering, and
  presentation-only controls; verify the focused Jest test suite passes.
- [x] 3.2 Add a swipe-selection test that simulates settled horizontal page
  changes in both directions and verifies the selected card state stays within
  the two-card bounds.
- [x] 3.3 Run the repository lint and relevant Jest tests, then manually
  compare the rendered screen with `SEND_MONEY_SCREEN.svg` at the 375x812
  portrait viewport and verify the blue ellipse decorations remain omitted.

## 4. Home entry point

- [x] 4.1 Wire Home > Send to navigate to `/send-money`, add a regression
  test, and verify the other Home payment actions remain presentation-only.

## 5. Recipient selection

- [x] 5.1 Make the recipient choices interactive with local selection state,
  selected-recipient summary content, account information, and a clear control.
- [x] 5.2 Add selection and cancellation tests, then run the complete
  validation suite.

## 6. Amount input

- [x] 6.1 Replace the amount summary with the reference amount card and a
  controlled USD input that clamps negatives and limits values to two decimals.
- [x] 6.2 Add amount normalization tests and run the complete validation suite.

## 7. Send Money back navigation

- [x] 7.1 Navigate from the Send Money back control to `/home` without
  retaining Send Money in the history stack.
- [x] 7.2 Add a back-navigation regression test and run the complete
  validation suite.
