export interface BarChartDatum<TLabel = string> {
  label: TLabel;
  value: number;
}

export interface BarChartProps<TLabel = string> {
  data: BarChartDatum<TLabel>[];
  width?: number;
  height?: number;
  padding?: number;
  barGap?: number;
  minValue?: number;
  maxValue?: number;
  targetValue?: number;
  barColor?: string;
  targetColor?: string;
  testID?: string;
}
