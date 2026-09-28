## Purpose

Provide a reusable charting foundation and a Statistics dashboard that presents
fake financial insights through three clear, vertically stacked visualizations.

## Requirements

### Requirement: Statistics dashboard layout

The Statistics screen SHALL replace the placeholder content with three vertically
stacked dashboard cards in this order: EURIBOR line chart, transaction-category
pie chart, and monthly-savings bar chart.

#### Scenario: User opens Statistics

- **WHEN** the user selects the Statistics tab
- **THEN** the screen displays the three dashboard cards in the required order
- **AND** the screen remains vertically scrollable when the cards exceed the
  available viewport height

### Requirement: Business-agnostic chart components

The chart components SHALL render generic numeric chart geometry and SHALL NOT
contain banking concepts, transaction categories, EURIBOR terminology, savings
terminology, dashboard titles, legends, or business-specific explanatory copy.

The chart components SHALL be organized as separate modules, each with its own
implementation, test, and type files:

- `src/statistics/components/LineChart/LineChart.tsx`
- `src/statistics/components/LineChart/LineChart.test.tsx`
- `src/statistics/components/LineChart/types.ts`
- `src/statistics/components/PieChart/PieChart.tsx`
- `src/statistics/components/PieChart/PieChart.test.tsx`
- `src/statistics/components/PieChart/types.ts`
- `src/statistics/components/BarChart/BarChart.tsx`
- `src/statistics/components/BarChart/BarChart.test.tsx`
- `src/statistics/components/BarChart/types.ts`

#### Scenario: Chart receives generic data

- **WHEN** a caller supplies valid generic chart data and visual options
- **THEN** the corresponding chart renders only the requested geometry
- **AND** the caller can provide surrounding titles, labels, legends, and copy
  independently

### Requirement: EURIBOR line chart

The first dashboard card SHALL display a smooth line chart driven by the
currently selected Weekly, Monthly, or Yearly dataset. The Weekly dataset SHALL
be selected initially.

The line chart SHALL provide Weekly, Monthly, and Yearly controls in the
Statistics screen. Selecting a control SHALL update the displayed dataset
without leaving the Statistics screen.

#### Scenario: Weekly range is initially selected

- **WHEN** the user opens the Statistics screen
- **THEN** the Weekly control is selected
- **AND** the line chart displays the Weekly fake dataset

#### Scenario: User changes the EURIBOR range

- **WHEN** the user selects Monthly or Yearly
- **THEN** the selected control becomes active
- **AND** the line chart displays the corresponding fake dataset

#### Scenario: Line data exceeds the visible width

- **WHEN** the number of line-chart points requires more width than the visible
  chart area
- **THEN** the line chart allows horizontal scrolling from left to right

#### Scenario: Line data fits the visible width

- **WHEN** all line-chart points fit within the visible chart area
- **THEN** the line chart does not require horizontal scrolling

#### Scenario: Line transitions are rendered smoothly

- **WHEN** adjacent line-chart points have different values
- **THEN** the connecting path uses smooth, non-sharp transitions rather than
  visibly angular point-to-point segments

### Requirement: Transaction-category pie chart

The second dashboard card SHALL display category proportions using no more than
six slices. Pie-chart input values SHALL be normalized proportions in the
inclusive range from zero to one, and the chart SHALL render each valid
proportion as its corresponding slice.

#### Scenario: Categories are displayed

- **WHEN** the Statistics screen supplies valid category proportions
- **THEN** the pie chart displays one slice per supplied category
- **AND** the Statistics screen displays the category names and colors outside
  the geometry-only chart component

#### Scenario: Category count is bounded

- **WHEN** the Statistics screen prepares category data
- **THEN** it supplies no more than six categories to the pie chart

### Requirement: Monthly-savings bar chart

The third dashboard card SHALL display one bar per supplied monthly savings
datum. It SHALL also display a horizontal reference line at the supplied
monthly target value.

#### Scenario: Savings and target are displayed

- **WHEN** the Statistics screen supplies monthly savings values and a target
  value
- **THEN** the chart displays a bar for each month
- **AND** the chart displays a horizontal line at the target value in the same
  numeric scale as the bars

### Requirement: Deterministic demonstration data

The Statistics screen SHALL use deterministic fake datasets for all three
charts. The data SHALL be owned by the Statistics module and SHALL be kept out
of the reusable chart components.

#### Scenario: Screen renders without a data service

- **WHEN** the user opens the Statistics screen without a connected data
  service
- **THEN** all three charts still render using the local fake datasets
