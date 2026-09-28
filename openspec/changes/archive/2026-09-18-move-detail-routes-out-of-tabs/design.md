## Context

The current `app/(closed)/_layout.tsx` combines the bottom-tab navigator with
onboarding and authenticated detail routes. Those routes use `href: null` and
screen-level tab-bar overrides to imitate stack navigation. The existing
Settings layout already provides a stack for `/settings/list-cards`, and screen
components already request normal back navigation.

## Goals / Non-Goals

**Goals:**

- Make the authenticated area a stack containing a nested four-tab navigator.
- Keep the four primary tab labels, styling, and public route URLs unchanged.
- Make detail routes normal stack destinations whose tab bar disappears through
  navigator hierarchy.
- Preserve the existing `/settings/list-cards` path and back behavior.
- Remove manual parent tab-bar mutation from the List Cards route.

**Non-Goals:**

- Adding authentication or protected routes.
- Changing screen UI, tab styling, or business behavior.
- Changing Send Money completion behavior.
- Refactoring unrelated back-button behavior.

## Decisions

### Use a parent Stack with a nested `(tabs)` group

Change `app/(closed)/_layout.tsx` to render `Stack`, and create
`app/(closed)/(tabs)/_layout.tsx` with the existing `Tabs` configuration.
Move only the four primary tab route files into `(tabs)`. This follows Expo
Router's nested navigator model and makes detail routes siblings of the tabs
navigator.

An alternative was to keep one `Tabs` navigator and continue hiding screens
with `href: null`; that preserves the current coupling and does not solve the
navigation-history problem. Another alternative was to put a stack inside each
tab, but that leaves detail navigation owned by an individual tab and does not
provide one shared stack above all authenticated tabs.

### Preserve the Settings detail path

Move `app/(closed)/settings/index.tsx` into
`app/(closed)/(tabs)/settings/index.tsx`, but retain
`app/(closed)/settings/_layout.tsx` and `list-cards.tsx`. The Settings
directory then remains a stack route for `/settings/list-cards` without
retaining a duplicate Settings index route.

This preserves existing navigation calls and deep-link paths while separating
the Settings tab leaf from its detail stack.

### Remove manual tab-bar visibility management

Delete the `useNavigation` and `useFocusEffect` logic from the List Cards
route. Because List Cards is rendered by the authenticated parent stack, its
tab-bar visibility is determined by navigator nesting rather than focus
callbacks.

### Update route and layout tests

Move tab-layout assertions to the new `(tabs)` layout, add parent-stack
assertions, and remove expectations for hidden tab entries. Keep screen
rendering tests for detail routes and add coverage for Settings/Profile/List
Cards navigation and tab-bar absence.

## Risks / Trade-offs

- [Typed route references may include the new `(tabs)` group] → Run the
  TypeScript check after moving files and update only affected internal route
  literals, while keeping URL paths unchanged.
- [A stale `settings/index.tsx` could create duplicate Settings routes] →
  Remove the old Settings tab file and verify the generated route tree before
  implementation is complete.
- [Tests may depend on mocking only `Tabs`] → Update mocks to represent both
  `Stack` and `Tabs`, and keep route-wrapper tests focused on observable
  screen rendering.
