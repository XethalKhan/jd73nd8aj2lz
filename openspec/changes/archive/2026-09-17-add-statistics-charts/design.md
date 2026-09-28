## Context

The current Statistics route renders a centered placeholder directly from
`app/(closed)/statistics/index.tsx`. The project uses TypeScript, Expo,
`@emotion/native`, Jest, `@testing-library/react-native`, and already has
`react-native-svg` available through the existing dependency set.

The proposal and `statistics-dashboard` spec define both a reusable chart
foundation and a Statistics-specific composition. The implementation must
preserve the existing Expo Router route while moving screen logic into the
`src/statistics` module.

## Goals / Non-Goals

**Goals:**

- Keep all Statistics-specific data, state, labels, controls, card layout, and
  legends inside `src/statistics`.
- Provide independently testable LineChart, PieChart, and BarChart modules.
- Keep chart components business-agnostic and limited to geometry plus their
  explicitly agreed interaction behavior.
- Render charts with the existing SVG dependency instead of adding a charting
  library.
- Make fake data deterministic so component and screen tests are stable.

**Non-Goals:**

- Connecting to a banking API or calculating real financial data.
- Persisting selected chart periods or chart state across app launches.
- Adding general-purpose axes, grid lines, or legends to the chart components.
- Extending the existing navigation structure beyond replacing the Statistics
  placeholder route.

## Decisions

### Keep the chart modules inside the Statistics module

The chart components will live under
`src/statistics/components/<ChartName>/`, matching the requested colocated
implementation, test, and type files. This keeps the feature self-contained
while preserving a business-agnostic API; if another feature later needs the
charts, the modules can be extracted without changing their contracts.

### Use SVG geometry primitives

Each chart will use `react-native-svg` primitives. This avoids a new dependency,
fits the existing project, and provides direct control over smooth paths,
proportional pie slices, bars, and reference lines.

### Keep surrounding presentation outside chart components

The Statistics screen will render card surfaces, chart titles, period controls,
category legends, and any explanatory labels. The chart components will render
geometry only and accept generic values and visual options.

### Auto-scale numeric charts with optional overrides

LineChart and BarChart will derive a numeric domain from their data by default.
Optional minimum and maximum values will allow a caller to stabilize or
compare scales. A bar-chart reference line will use the same domain as the bar
values.

### Require normalized pie proportions

PieChart will accept proportions in the range 0..1 rather than inferring
proportions from business totals. Statistics data will perform any domain
specific aggregation and normalization before passing values to the component.

### Use monotone smooth interpolation for line paths

LineChart will convert points into a smooth SVG path using a monotone cubic
interpolation strategy. This avoids sharp joins while limiting overshoot around
interest-rate values. The chart will not add axes or labels to the SVG.

### Let LineChart own conditional horizontal scrolling

LineChart will calculate its content width from the number of points and point
spacing. It will render at least the available viewport width and use an
internal horizontal `ScrollView` only when the calculated content width is
larger. PieChart and BarChart will remain non-scrollable.

### Separate route and screen responsibilities

`app/(closed)/statistics/index.tsx` will become a thin route wrapper that
imports `StatisticsScreen` from `src/statistics/screens/StatisticsScreen.tsx`.
Statistics data and period state will remain in the screen/module, not in the
Expo Router file.

## Risks / Trade-offs

- [Risk] A custom SVG implementation requires maintaining coordinate scaling and
  touch/scroll behavior → Mitigation: keep geometry calculations local to each
  chart and cover normal, empty, single-point, and overflow datasets with tests.
- [Risk] Smooth interpolation can visually overshoot sparse data → Mitigation:
  use monotone interpolation and clamp the derived path to the chart domain.
- [Risk] Nested vertical Statistics scrolling and horizontal line scrolling may
  compete for gestures → Mitigation: use a horizontal chart scroll container
  with horizontal content sizing and keep the outer screen scroll vertical.
- [Risk] Normalized pie input can be invalid or sum below one → Mitigation:
  validate the component contract and define deterministic handling for zero or
  invalid proportions in the component tests.
- [Risk] Fake data may look like production data → Mitigation: keep it in a
  clearly named Statistics data module and avoid presenting it as live account
  data.
