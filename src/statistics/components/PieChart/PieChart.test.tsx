import { render } from "@testing-library/react-native";
import { processColor } from "react-native";

import { PieChart } from "./PieChart";

describe("PieChart", () => {
  it("renders one SVG slice for every positive valid proportion", async () => {
    const { getByTestId } = await render(
      <PieChart
        data={[
          { color: "#0066FF", label: "Food", proportion: 0.4 },
          { color: "#1FAA47", label: "Travel", proportion: 0.6 },
        ]}
        testID="valid-pie"
      />,
    );

    expect(getByTestId("valid-pie-slice-0")).toBeTruthy();
    expect(getByTestId("valid-pie-slice-1")).toBeTruthy();
  });

  it("skips zero-proportion slices without failing", async () => {
    const { getByTestId, queryByTestId } = await render(
      <PieChart
        data={[
          { color: "#0066FF", label: "Food", proportion: 0 },
          { color: "#1FAA47", label: "Travel", proportion: 1 },
        ]}
        testID="zero-pie"
      />,
    );

    expect(queryByTestId("zero-pie-slice-0")).toBeNull();
    expect(getByTestId("zero-pie-slice-1")).toBeTruthy();
  });

  it("ignores proportions outside the normalized range", async () => {
    const { getByTestId, queryByTestId } = await render(
      <PieChart
        data={[
          { color: "#0066FF", label: "Invalid low", proportion: -0.1 },
          { color: "#1FAA47", label: "Valid", proportion: 0.5 },
          { color: "#E16364", label: "Invalid high", proportion: 1.1 },
        ]}
        testID="invalid-pie"
      />,
    );

    expect(getByTestId("invalid-pie-slice-0")).toBeTruthy();
    expect(queryByTestId("invalid-pie-slice-1")).toBeNull();
  });

  it("renders rounded arc segments around an empty center", async () => {
    const { getByTestId } = await render(
      <PieChart
        data={[
          { color: "#0066FF", label: "Food", proportion: 0.4 },
          { color: "#1FAA47", label: "Travel", proportion: 0.6 },
        ]}
        testID="ring-pie"
      />,
    );

    expect(getByTestId("ring-pie-background")).toBeTruthy();
    expect(getByTestId("ring-pie-slice-0")).toHaveProp("fill", null);
    expect(getByTestId("ring-pie-slice-0")).toHaveProp(
      "stroke",
      expect.objectContaining({ payload: processColor("#0066FF") }),
    );
    expect(getByTestId("ring-pie-slice-0")).toHaveProp(
      "d",
      expect.stringContaining("A"),
    );
    expect(getByTestId("ring-pie-slice-0")).toHaveProp("strokeLinecap", 1);
    expect(getByTestId("ring-pie-slice-0")).toHaveProp("strokeWidth", 18);
  });

  it("normalizes partial totals into one complete chart", async () => {
    const { getByTestId } = await render(
      <PieChart
        data={[
          { color: "#0066FF", label: "Housing", proportion: 0.3 },
          { color: "#1FAA47", label: "Food", proportion: 0.2 },
        ]}
        testID="partial-pie"
      />,
    );

    expect(getByTestId("partial-pie-slice-0")).toHaveProp(
      "d",
      expect.stringContaining("A"),
    );
    expect(getByTestId("partial-pie-slice-1")).toHaveProp(
      "d",
      expect.stringContaining("A"),
    );
  });
});
