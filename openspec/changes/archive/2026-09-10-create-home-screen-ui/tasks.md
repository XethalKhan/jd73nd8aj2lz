## 1. Build the Home Screen composition

- [x] 1.1 Replace the placeholder in `app/(closed)/home.tsx` with the
  safe-area-aware, scrollable Home layout and verify the route renders without
  service data.
- [x] 1.2 Add the SVG-matched header, profile/search controls, static payment
  summary, and transaction presentation using Emotion Native and existing
  Poppins typography; verify the expected copy and visual sections render.
- [x] 1.3 Render the existing shared `Card` component with Home fixture data in
  the designed card slot; verify the shared payment-card test ID and card
  details are present.
- [x] 1.4 Add the Send, Receive, Topup, and Loan Pressable affordances with the
  designed icon surfaces and no-op handlers; verify all four controls expose
  button semantics and pressing them causes no navigation or data mutation.
- [x] 1.5 Tune responsive spacing and bottom content padding so the Home content
  remains above the existing tab bar at the reference viewport; verify the
  tab layout remains unchanged.

## 2. Add focused Home coverage

- [x] 2.1 Add a Home route rendering test covering the designed sections, shared
  card, and four action labels; verify it passes with the repository Jest and
  Testing Library setup.
- [x] 2.2 Run the focused Home test and the project lint/type checks; verify no
  regressions are introduced outside the Home route.
