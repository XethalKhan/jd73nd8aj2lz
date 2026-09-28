import { render } from "@testing-library/react-native";

import { BarChart } from "./BarChart";

describe("BarChart", () => {
  it("renders one bar for each numeric datum", async () => {
    const { getByTestId } = await render(
      <BarChart
        data={[
          { label: "Jan", value: 100 },
          { label: "Feb", value: 140 },
        ]}
        testID="bars"
      />,
    );

    expect(getByTestId("bars-bar-0")).toBeTruthy();
    expect(getByTestId("bars-bar-1")).toBeTruthy();
  });

  it("renders an empty SVG for empty data", async () => {
    const { queryByTestId } = await render(
      <BarChart data={[]} testID="empty-bars" />,
    );

    expect(queryByTestId("empty-bars-bar-0")).toBeNull();
  });

  it("supports explicit numeric scaling", async () => {
    const { getByTestId } = await render(
      <BarChart
        data={[{ label: "Jan", value: 50 }]}
        maxValue={100}
        minValue={0}
        testID="scaled-bars"
      />,
    );

    expect(getByTestId("scaled-bars-bar-0").props.height).toBeGreaterThan(1);
  });

  it("renders a target line in the same chart scale", async () => {
    const { getByTestId } = await render(
      <BarChart
        data={[{ label: "Jan", value: 50 }]}
        targetValue={75}
        testID="target-bars"
      />,
    );

    expect(getByTestId("target-bars-target")).toBeTruthy();
    expect(getByTestId("target-bars-target").props.y1).toBe(
      getByTestId("target-bars-target").props.y2,
    );
  });
});
