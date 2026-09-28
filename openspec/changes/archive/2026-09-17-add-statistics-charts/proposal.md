## Why

The Statistics tab currently shows only placeholder copy, so users cannot review
interest-rate movement, spending categories, or monthly savings progress. This
change adds a useful statistics dashboard while establishing reusable,
business-agnostic chart components for future screens.

## What Changes

- Add a Statistics screen composed of three vertically stacked dashboard cards:
  - A smooth, horizontally scrollable EURIBOR line chart with Weekly, Monthly,
    and Yearly selections, defaulting to Weekly.
  - A transaction-category pie chart with no more than six categories.
  - A monthly-savings bar chart with a horizontal monthly-target reference line.
- Add deterministic fake data for the Statistics screen.
- Add reusable chart components under `src/statistics/components/`, with each
  component in its own folder containing its implementation, tests, and local
  types:
  - `LineChart/LineChart.tsx`, `LineChart.test.tsx`, `types.ts`
  - `PieChart/PieChart.tsx`, `PieChart.test.tsx`, `types.ts`
  - `BarChart/BarChart.tsx`, `BarChart.test.tsx`, `types.ts`
- Keep chart components business-agnostic; Statistics owns dashboard titles,
  labels, legends, controls, and domain-specific data.
- Replace the placeholder Statistics route with the Statistics screen module.

## Capabilities

### New Capabilities

- `statistics-dashboard`: Provide reusable chart rendering and a Statistics
  dashboard for EURIBOR trends, transaction categories, and monthly savings.

### Modified Capabilities

<!-- No existing capability requirements are modified. -->

## Impact

- Affects `app/(closed)/statistics/index.tsx` and new modules under
  `src/statistics/`.
- Uses the existing `react-native-svg` dependency for chart rendering; no new
  charting dependency is required.
- Adds unit and component coverage using the existing Jest and
  `@testing-library/react-native` setup.
- Preserves the existing Statistics tab route and bottom navigation behavior.
