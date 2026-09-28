export interface LineChartPoint<TLabel = string> {
  label: TLabel;
  value: number;
}

export interface LineChartProps<TLabel = string> {
  data: LineChartPoint<TLabel>[];
  width?: number;
  height?: number;
  pointSpacing?: number;
  padding?: number;
  minValue?: number;
  maxValue?: number;
  strokeColor?: string;
  strokeWidth?: number;
  guideColor?: string;
  labelColor?: string;
  labelFontSize?: number;
  showGuides?: boolean;
  showLabels?: boolean;
  testID?: string;
}
