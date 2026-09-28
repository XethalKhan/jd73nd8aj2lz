## Context

The authenticated area uses Expo Router Tabs, with full-screen destinations
registered as hidden tab routes. Screens use `SafeAreaView`, Emotion Native
styled components, Poppins fonts loaded by the root layout, Phosphor icons, and
static fixture data for presentation-only banking UI.

The existing `src/components/Card` component already supports both
`mastercard` and `visa` brands and exposes brand-specific presentation through
its `brand` prop. No existing carousel or gesture abstraction is present.

## Goals / Non-Goals

**Goals:**

- Reproduce the supplied Send Money reference composition at the existing
  375px-wide portrait design scale.
- Reuse the shared payment-card component for both source cards.
- Provide a clear two-page swipe interaction with Mastercard selected first.
- Let the recipient section switch between recipient choices and a selected
  recipient summary without introducing a data service.
- Match the reference amount card with a local editable USD amount field.
- Return to Home from the Send Money back control.
- Keep the route full-screen and hidden from the authenticated tab bar.
- Reach the route from the Home screen's Send action using Expo Router.
- Keep all non-navigation, non-input controls behaviorless and static.

**Non-Goals:**

- Do not implement recipient search, card loading, transfer submission,
  navigation outcomes, API calls, persistence, or transaction state.
- Do not render the SVG's blue blurred ellipse decorations.
- Do not add a new carousel, animation, or gesture dependency.

## Decisions

### Use a native horizontal paged ScrollView

Use a horizontal `ScrollView` with paging enabled and two fixed-width pages,
one per card fixture. Track the selected page from the completed scroll event
and keep the index bounded to the two fixtures.

This uses React Native behavior already available in the project and makes the
swipe interaction predictable on iOS, Android, and web. A custom pan responder
or Reanimated gesture implementation would add complexity without improving
the required two-page presentation.

### Keep card fixtures local to the screen

Define two static fixtures in the Send Money screen: a Mastercard fixture and a
Visa fixture. Pass each fixture to the shared `Card` component with its brand
and contactless presentation enabled, using distinct test identifiers so tests
can verify both available pages.

This keeps the feature self-contained and avoids inventing a card store or
service contract for a screen explicitly scoped to visual UI.

### Register the route as a hidden closed-area destination

Add the route file under `app/(closed)/send-money.tsx` and declare it in
`app/(closed)/_layout.tsx` with `href: null` and a hidden tab-bar style, matching
the existing profile, edit-profile, add-card, and change-password destinations.

This keeps the route reachable by explicit navigation later while preserving
the four existing selectable primary tabs.

The Home screen's Send action explicitly pushes `/send-money`; the other
dashboard payment actions remain presentation-only. The Send Money back
control replaces the current route with `/home`, returning the user to Home
without leaving Send Money in the history stack.

Recipient fixtures remain local to the screen. Selecting a recipient replaces
the choices with a row containing the circular avatar, recipient name, static
account-ending information, and a clear action. Clearing the selection returns
to the recipient choices.

The amount card uses a controlled text input initialized to the reference value
`36.00`. Input is normalized locally to remove non-numeric characters, clamp
negative values to `0`, and keep no more than two decimal places.

### Match the reference with existing visual primitives

Build the screen with Emotion Native styled primitives, `SafeAreaView`, a
vertical content container, Phosphor icons, and the existing color/font
conventions. Recreate the card, recipient, details, and button surfaces from
the SVG using React Native views, text, and the controlled amount input instead
of embedding the large SVG.
Only intended card artwork and UI icons should remain; the decorative blue
ellipses are deliberately excluded.

## Risks / Trade-offs

- [Risk] A native paged ScrollView reports selection after momentum settles,
  so the selected state may lag the finger during a swipe. -> Mitigation:
  update the selected index in the completed-scroll callback, which matches
  the page that is actually visible.
- [Risk] The SVG contains vectorized text and embedded raster assets, making
  exact copy and imagery difficult to extract mechanically. -> Mitigation:
  use the visible reference labels and existing app typography, keep the
  supplied card component for card fidelity, and verify the rendered screen
  against the reference at the 375px portrait viewport.
- [Risk] The route is hidden from tabs and may not be reachable from an
  existing flow during isolated testing. -> Mitigation: test the route
  component directly and register it consistently with other hidden routes.
