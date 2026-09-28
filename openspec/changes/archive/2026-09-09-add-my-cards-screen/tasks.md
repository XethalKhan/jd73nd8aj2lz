## 1. Screen foundation

- [x] 1.1 Create `src/cards/screens/MyCardsScreen.tsx` with the safe-area screen shell, reference background, header, and static presentation fixtures; verify the module exports without TypeScript errors.
- [x] 1.2 Replace the placeholder contents of `app/(closed)/my-cards/index.tsx` with the cards screen module; verify the route renders the designed screen instead of placeholder copy.

## 2. Card and summary composition

- [x] 2.1 Place `src/components/Card.tsx` using static reference card details, brand, and optional visual flags; verify the rendered tree exposes the shared card details and does not contain duplicated card artwork.
- [x] 2.2 Implement the card summary, navigation affordances, and spending-limit panel with the reference copy, colors, spacing, track, fill, and thumb styling; verify the major sections and labels are visible within the portrait layout.
- [x] 2.3 Preserve the existing closed-area tab layout and make non-tab controls presentation-only; verify the current tab-navigation test still passes and no new route or data operation is introduced.

## 3. Tests and visual validation

- [x] 3.1 Add `src/cards/screens/MyCardsScreen.test.tsx` covering title, reference copy, shared card details, spending-limit content, stable affordance identifiers, and absence of placeholder copy; verify the focused screen test passes.
- [x] 3.2 Run the project's lint, TypeScript, and relevant Jest checks; verify the new screen and existing test suites pass without unrelated changes.
- [ ] 3.3 Compare the rendered 375x812-style screen against `MY_CARDS_SCREEN.svg`; verify typography, colors, card placement, panel proportions, icon positions, and bottom-tab relationship are visually aligned.
