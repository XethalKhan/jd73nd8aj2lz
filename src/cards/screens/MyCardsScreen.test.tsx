import { fireEvent, render } from "@testing-library/react-native";
import { useRouter } from "expo-router";

import { MyCardsScreen } from "./MyCardsScreen";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("MyCardsScreen", () => {
  const push = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push });
  });

  it("renders the reference card composition and spending limit", async () => {
    const { getByText, getByTestId, queryByText } = await render(
      <MyCardsScreen />,
    );

    expect(getByText("My Cards")).toBeTruthy();
    expect(getByText("4562")).toBeTruthy();
    expect(getByText("1122")).toBeTruthy();
    expect(getByText("4595")).toBeTruthy();
    expect(getByText("7852")).toBeTruthy();
    expect(getByText("AR Jonson")).toBeTruthy();
    expect(getByText("24/2000")).toBeTruthy();
    expect(getByText("6986")).toBeTruthy();
    expect(getByTestId("card-mastercard-logo")).toBeTruthy();
    expect(getByTestId("card-contactless")).toBeTruthy();
    expect(getByText("Apple Store")).toBeTruthy();
    expect(getByText("Entertainment")).toBeTruthy();
    expect(getByText("Spotify")).toBeTruthy();
    expect(getByText("Music")).toBeTruthy();
    expect(getByText("Grocery")).toBeTruthy();
    expect(getByText("Shopping")).toBeTruthy();
    expect(getByText("- $5,99")).toBeTruthy();
    expect(getByText("- $12,99")).toBeTruthy();
    expect(getByText("- $ 88")).toBeTruthy();
    expect(getByText("Monthly spending limit")).toBeTruthy();
    expect(getByText("Amount: $8,545.00")).toBeTruthy();
    expect(getByText("$0")).toBeTruthy();
    expect(getByText("$4,600")).toBeTruthy();
    expect(getByText("$10,000")).toBeTruthy();
    expect(getByTestId("monthly-spending-limit")).toBeTruthy();
    expect(getByTestId("spending-limit-track")).toBeTruthy();
    expect(getByTestId("spending-limit-thumb")).toBeTruthy();
    expect(queryByText("Manage your cards here.")).toBeNull();
  });

  it("navigates from the add-card header affordance", async () => {
    const { getByLabelText } = await render(<MyCardsScreen />);

    expect(getByLabelText("Back")).toBeTruthy();
    expect(getByLabelText("Add card")).toBeTruthy();

    await fireEvent.press(getByLabelText("Back"));
    await fireEvent.press(getByLabelText("Add card"));

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith("/add-card");
  });
});
