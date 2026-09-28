export interface EuriborPoint {
  label: string;
  value: number;
}

export interface CategoryProportion {
  label: string;
  proportion: number;
  color: string;
}

export interface MonthlySavingsPoint {
  label: string;
  value: number;
}

export const euriborData: EuriborPoint[] = [
    { label: "Jan", value: 3.91 },
    { label: "Feb", value: 3.86 },
    { label: "Mar", value: 3.82 },
    { label: "Apr", value: 3.76 },
    { label: "May", value: 3.73 },
    { label: "Jun", value: 3.69 },
];

export const categoryProportions: CategoryProportion[] = [
  { label: "Housing", proportion: 0.34, color: "#0066FF" },
  { label: "Food", proportion: 0.23, color: "#1FAA47" },
  { label: "Transport", proportion: 0.16, color: "#F79F1A" },
  { label: "Shopping", proportion: 0.12, color: "#E16364" },
  { label: "Entertainment", proportion: 0.08, color: "#8B5CF6" },
  { label: "Other", proportion: 0.07, color: "#A2A2A7" },
];

export const monthlySavings = {
  target: 500,
  points: [
    { label: "Jan", value: 420 },
    { label: "Feb", value: 540 },
    { label: "Mar", value: 470 },
    { label: "Apr", value: 610 },
    { label: "May", value: 570 },
    { label: "Jun", value: 680 },
  ] satisfies MonthlySavingsPoint[],
};
