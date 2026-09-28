## Navigation map

```text
/
└─ Redirect → /(open)/welcome

Welcome
├─ Sign in → /(open)/login
└─ Sign up → /(open)/create-account

Login
├─ Back → Welcome
└─ Submit → replace /(closed)/onboarding/1

Create account
└─ Back → Welcome
   Submit currently does nothing

Onboarding 1 → push Onboarding 2
Onboarding 2 → push Onboarding 3
Onboarding 3 → replace Home

Authenticated tabs
├─ Home
├─ My Cards
├─ Statistics
└─ Settings

Home
└─ Send → push Send Money

My Cards
└─ Add card → push Add Card

Settings
├─ My Profile → push Profile
└─ Change Password → push Change Password

Profile
├─ Edit profile → push Edit Profile
└─ Banks and Cards → push Settings/List Cards

List Cards
└─ Add card → push Add Card
```

Back controls generally call `router.back()`. Send Money instead uses `router.replace("/home")`.

## Expo Router implementation

The project correctly uses Expo Router:

- `package.json` uses `expo-router/entry`.
- Files under `app/` define routes.
- `app/_layout.tsx` defines the root stack.
- `(open)` and `(closed)` are route groups and do not appear in URLs.
- `(closed)/_layout.tsx` defines the bottom tabs.
- Hidden routes use `href: null`, which Expo documents as the correct way to remove a route from the tab bar.
- `typedRoutes` is enabled in `app.json`.
- Screen UI is kept outside `app/`, which is a good separation.

## Main improvement opportunities

### 1. The authenticated area is not actually protected

`(closed)` is only a route group name. It does not prevent direct navigation or deep links to authenticated screens.

Expo Router v56 recommends protected routes with an auth/session provider and `Stack.Protected`.

Recommended structure:

```text
Root Stack
├─ Open routes
└─ Protected authenticated routes
   └─ Tabs
```

This should replace the current “login then manually navigate” approach once real authentication is added.

### 2. Detail screens are registered as hidden tabs

Profile, Add Card, Send Money, onboarding, and other detail routes are all children of the tab navigator with `href: null`.

This works, but it makes navigation history and tab-bar visibility harder to reason about. A cleaner structure would be:

```text
(closed)/_layout.tsx       Stack
(closed)/(tabs)/_layout.tsx Tabs
(closed)/(tabs)/home.tsx
(closed)/(tabs)/my-cards
(closed)/profile.tsx
(closed)/add-card.tsx
(closed)/send-money.tsx
```

Then detail pages are stack screens above the tabs instead of hidden tab screens. The tab bar disappears naturally without manually mutating parent options.

### 3. My Cards has an inert Back button

`MyCardsScreen.tsx` renders a visible Back control with:

```ts
onPress={() => undefined}
```

This should either call `router.back()` or be removed if My Cards is intended to be a primary tab.

### 4. Back behavior is inconsistent

Most detail screens use `router.back()`, while Send Money uses:

```ts
router.replace("/home")
```

Choose a consistent policy:

- Use `back()` for normal detail-page dismissal.
- Use `replace()` only when intentionally removing a flow from history, such as completing onboarding or abandoning a transaction.

The Settings tab also has a Back button, but its behavior may depend on tab history. Primary tabs usually should not have a back button, or should explicitly return to Home.

### 5. Absolute tab bar may cover content

The tab bar uses:

```ts
position: "absolute"
```

Expo documents that screens need their own bottom spacing when using an absolute tab bar. Current screens use inconsistent padding, so content may be obscured on smaller devices.

Use `useBottomTabBarHeight()` or a shared authenticated-screen container.

### 6. Typed route casts hide errors

Several screens use:

```ts
router.push("/(closed)/onboarding/2" as Href)
```

Typed routes are already enabled and TypeScript passes. These casts appear unnecessary and weaken route validation. Prefer direct typed literals and let the generated route types catch invalid paths.

### 7. Navigation tests are mostly mocked unit tests

Current E2E coverage only tests:

```text
Welcome → Login → Onboarding → Home
```

There are no E2E checks for:

- Tab switching
- Settings → Profile
- Profile → Cards
- Add Card back navigation
- Send Money back behavior
- Tab-bar visibility on detail screens
- Deep links or protected routes

Add a small Maestro navigation suite for those flows.

## Validation

- TypeScript check: passed.
- Focused navigation tests: passed, 10 tests.
- Full Jest run: timed out before completion.
- No files were modified.
