## 1. Generic Chart Modules

- [x] 1.1 Create the requested `src/statistics/components/LineChart/`,
  `PieChart/`, and `BarChart/` folder structures with colocated
  implementation, test, and `types.ts` files; verify all nine files exist.
- [x] 1.2 Implement `LineChart` generic types, SVG geometry, automatic numeric
  scaling, optional domain overrides, monotone smooth interpolation, and
  conditional internal horizontal scrolling; verify tests cover empty,
  single-point, fitting, overflow, scaling, and smooth-path cases.
- [x] 1.3 Implement `PieChart` generic normalized-proportion types and SVG
  slice geometry without legends or business copy; verify tests cover valid
  slices, zero proportions, and invalid input handling.
- [x] 1.4 Implement `BarChart` generic types, SVG bars, automatic numeric
  scaling, optional domain overrides, and a same-domain horizontal reference
  line; verify tests cover bars, empty data, scaling, and target-line cases.

## 2. Statistics Data And Screen

- [x] 2.1 Add deterministic Statistics fake datasets and domain types for
  Weekly, Monthly, and Yearly EURIBOR points, no more than six category
  proportions, and monthly savings with a target; verify the data module
  contains no chart-rendering code.
- [x] 2.2 Implement `StatisticsScreen` under `src/statistics/screens/` with a
  vertically scrollable three-card layout, Weekly as the initial period,
  period controls, business-specific titles and copy, category legend, and
  chart composition; verify screen tests cover card order, default period,
  period changes, category limit, and fake-data rendering.
- [x] 2.3 Apply the existing Emotion/native styling and safe-area conventions
  to the Statistics screen and ensure the bottom tab bar does not obscure the
  final card; verify the screen renders correctly with the existing test
  environment.

## 3. Route Integration And Validation

- [x] 3.1 Replace the placeholder implementation in
  `app/(closed)/statistics/index.tsx` with a thin import of
  `StatisticsScreen`; verify the route remains reachable through the existing
  Statistics tab.
- [x] 3.2 Run the Statistics component and screen tests, the full Jest suite,
  TypeScript validation, and Expo lint; verify all commands pass without
  changing unrelated navigation behavior.
