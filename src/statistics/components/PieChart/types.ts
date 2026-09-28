export interface PieChartSlice<TLabel = string> {
  label: TLabel;
  proportion: number;
  color: string;
}

export interface PieChartProps<TLabel = string> {
  data: PieChartSlice<TLabel>[];
  size?: number;
  strokeWidth?: number;
  backgroundColor?: string;
  testID?: string;
}
