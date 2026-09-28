## 1. Restructure authenticated route layouts

- [x] 1.1 Convert `app/(closed)/_layout.tsx` to a headerless `Stack` parent and verify the authenticated layout no longer declares tab screens.
- [x] 1.2 Create `app/(closed)/(tabs)/_layout.tsx` with the existing tab styling and exactly four `Tabs.Screen` entries: Home, My Cards, Statistics, and Settings; verify no detail or onboarding route is registered there.
- [x] 1.3 Move the four tab route files into `app/(closed)/(tabs)/` and move Settings to `app/(closed)/(tabs)/settings/index.tsx`; verify the generated route tree has one Settings tab route and preserves `/settings/list-cards`.

## 2. Remove hidden-tab workarounds

- [x] 2.1 Remove `href: null` and detail-specific `tabBarStyle` overrides from the old closed-area tabs layout; verify no detail route remains a `Tabs.Screen`.
- [x] 2.2 Remove `useNavigation`, `useFocusEffect`, and parent tab-bar mutation from `app/(closed)/settings/list-cards.tsx`; verify List Cards relies on stack nesting for tab-bar visibility.
- [x] 2.3 Update any internal typed route references affected by the new `(tabs)` group without changing public route URLs; verify `npx tsc --noEmit` passes.

## 3. Update navigation tests

- [x] 3.1 Update tab-navigation tests to render the new tabs layout, mock both `Stack` and `Tabs`, and assert exactly four selectable tabs; verify hidden-tab expectations are removed.
- [x] 3.2 Add or update route-layout tests for the authenticated parent stack and detail destinations, including Profile, Add Card, Send Money, onboarding, and List Cards; verify each detail route renders outside the tab declarations.
- [x] 3.3 Add navigation coverage for Settings → Profile → Banks and Cards and List Cards back navigation; verify the existing `/settings/list-cards` target remains unchanged.

## 4. Validate the complete navigation flow

- [x] 4.1 Run focused navigation and screen tests for the changed route layouts and Settings/Profile/List Cards flows; verify they pass.
- [x] 4.2 Run `npm run lint` and `npx tsc --noEmit`; verify there are no new lint or type errors.
- [x] 4.3 Run the relevant Maestro navigation flow and verify the bottom tab bar is absent on detail screens and returns when navigating back to a primary tab.
