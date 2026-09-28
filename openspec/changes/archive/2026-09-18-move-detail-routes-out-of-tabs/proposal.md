## Why

Authenticated detail screens are currently registered as hidden screens inside
the bottom-tab navigator. This couples stack-style navigation to tab-bar
visibility overrides and makes back-stack behavior harder to reason about.
Moving detail routes into a parent stack will make them normal pushed screens
while preserving the four primary tabs and existing route URLs.

## What Changes

- Make the authenticated `(closed)` layout a stack navigator.
- Add a nested `(tabs)` route group containing only Home, My Cards,
  Statistics, and Settings.
- Move the Settings tab screen into the `(tabs)` group while keeping the
  existing `/settings/list-cards` stack route.
- Keep onboarding and authenticated detail screens as stack children instead
  of registering them as hidden tabs.
- Remove route-level `href: null` and tab-bar hiding overrides for detail
  screens.
- Remove the List Cards focus effect that manually hides and restores the
  parent tab bar.
- Update navigation tests and route-layout tests to reflect the stack-over-tabs
  structure.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `tab-navigation`: The authenticated navigation surface will keep exactly
  four selectable tabs, while detail and onboarding routes will be presented
  by a parent stack rather than hidden tab entries.

## Impact

- Affected route layouts under `app/(closed)/`.
- Affected route placement for the Settings tab.
- Affected List Cards route wrapper and navigation tests.
- No new dependencies, APIs, screen UI, or public route URLs are required.
