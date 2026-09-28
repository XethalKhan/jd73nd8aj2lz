import { render } from "@testing-library/react-native";
import { processColor } from "react-native";
import type { TestInstance } from "test-renderer";

import { LineChart } from "./LineChart";

function getProp(instance: TestInstance, name: string): unknown {
  return (instance.props as Record<string, unknown>)[name];
}

function hasChildText(value: unknown, expected: string): boolean {
  if (
    typeof value !== "object" ||
    value === null ||
    !("props" in value) ||
    typeof value.props !== "object" ||
    value.props === null ||
    !("children" in value.props)
  ) {
    return false;
  }

  return value.props.children === expected;
}

describe("LineChart", () => {
  it("renders no path for empty data", async () => {
    const { queryByTestId } = await render(
      <LineChart data={[]} testID="empty-line" />,
    );

    expect(queryByTestId("empty-line-path")).toBeNull();
  });

  it("renders a single point without requiring scrolling", async () => {
    const { getByTestId, queryByTestId } = await render(
      <LineChart
        data={[{ label: "A", value: 2 }]}
        testID="single-line"
        width={200}
      />,
    );

    expect(getByTestId("single-line-path")).toBeTruthy();
    expect(queryByTestId("single-line-scroll")).toBeNull();
  });

  it("keeps fitting data in a non-scrollable viewport", async () => {
    const { queryByTestId } = await render(
      <LineChart
        data={[
          { label: "A", value: 1 },
          { label: "B", value: 2 },
        ]}
        pointSpacing={30}
        testID="fitting-line"
        width={200}
      />,
    );

    expect(queryByTestId("fitting-line-scroll")).toBeNull();
  });

  it("uses an internal horizontal scroll view when data overflows", async () => {
    const { getByTestId } = await render(
      <LineChart
        data={[
          { label: "A", value: 1 },
          { label: "B", value: 2 },
          { label: "C", value: 3 },
        ]}
        pointSpacing={100}
        testID="overflow-line"
        width={200}
      />,
    );

    expect(getByTestId("overflow-line-scroll")).toBeTruthy();
  });

  it("supports explicit numeric scaling and creates a smooth path", async () => {
    const { getByTestId } = await render(
      <LineChart
        data={[
          { label: "A", value: 10 },
          { label: "B", value: 50 },
          { label: "C", value: 25 },
        ]}
        maxValue={100}
        minValue={0}
        testID="scaled-line"
      />,
    );

    expect(getByTestId("scaled-line-path")).toHaveProp(
      "d",
      expect.stringContaining(" C "),
    );
    expect(getByTestId("scaled-line-path")).toHaveProp(
      "d",
      expect.stringContaining("16"),
    );
  });

  it("renders labels and vertical guides without point markers", async () => {
    const { getByTestId, queryByTestId } = await render(
      <LineChart
        data={[
          { label: "Jan", value: 1 },
          { label: "Feb", value: 2 },
          { label: "Mar", value: 3 },
        ]}
        testID="styled-line"
      />,
    );

    const firstLabelChildren = getProp(
      getByTestId("styled-line-label-0"),
      "children",
    );
    const lastLabelChildren = getProp(
      getByTestId("styled-line-label-2"),
      "children",
    );

    expect(hasChildText(firstLabelChildren, "Jan")).toBe(true);
    expect(hasChildText(lastLabelChildren, "Mar")).toBe(true);
    expect(getByTestId("styled-line-guide-1")).toBeTruthy();
    expect(getByTestId("styled-line-path")).toHaveProp(
      "stroke",
      expect.objectContaining({ payload: processColor("#0066FF") }),
    );
    expect(queryByTestId("styled-line-point-1")).toBeNull();
  });
});
