import { fireEvent, render } from "@testing-library/react-native";

import { SendMoneyScreen } from "./SendMoneyScreen";

const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => ({ replace: mockReplace })),
}));

describe("SendMoneyScreen", () => {
  it("renders the designed composition and both shared source cards", async () => {
    const { getByTestId, getByText, queryByTestId } = await render(
      <SendMoneyScreen />,
    );

    expect(getByTestId("send-money-title")).toBeTruthy();
    expect(getByText("Choose recipient")).toBeTruthy();
    expect(getByText("Enter Your Amount")).toBeTruthy();
    expect(getByText("Change Currency?")).toBeTruthy();
    expect(getByText("USD")).toBeTruthy();
    expect(getByTestId("send-money-amount-input").props.value).toBe("36.00");
    expect(getByTestId("send-money-card-mastercard")).toBeTruthy();
    expect(getByTestId("send-money-card-visa")).toBeTruthy();
    expect(
      getByTestId("send-money-card-page-mastercard").props.accessibilityState,
    ).toEqual({ selected: true });
    expect(
      getByTestId("send-money-card-page-visa").props.accessibilityState,
    ).toEqual({ selected: false });
    expect(queryByTestId("send-money-decorative-ellipse")).toBeNull();
  });

  it("returns to Home from the back control", async () => {
    const { getByTestId } = await render(<SendMoneyScreen />);

    await fireEvent.press(getByTestId("send-money-back"));

    expect(mockReplace).toHaveBeenCalledWith("/home");
  });

  it("keeps other non-input controls presentation-only", async () => {
    const { getByTestId } = await render(<SendMoneyScreen />);

    await fireEvent.press(getByTestId("send-money-add-recipient"));
    await fireEvent.press(getByTestId("send-money-change-currency"));
    await fireEvent.press(getByTestId("send-money-submit"));

    expect(getByTestId("send-money-title")).toBeTruthy();
    expect(getByTestId("send-money-submit")).toBeTruthy();
  });

  it("selects one recipient and clears the selection", async () => {
    const { getByTestId, getByText, queryByTestId } = await render(
      <SendMoneyScreen />,
    );

    await fireEvent.press(getByTestId("send-money-recipient-alex"));

    expect(getByTestId("send-money-selected-recipient")).toBeTruthy();
    expect(getByTestId("send-money-selected-avatar-alex")).toBeTruthy();
    expect(getByText("Alex")).toBeTruthy();
    expect(getByText("Account ending in 4582")).toBeTruthy();
    expect(queryByTestId("send-money-recipient-maria")).toBeNull();
    expect(queryByTestId("send-money-recipient-john")).toBeNull();
    expect(queryByTestId("send-money-recipient-sofia")).toBeNull();

    await fireEvent.press(getByTestId("send-money-clear-recipient"));

    expect(queryByTestId("send-money-selected-recipient")).toBeNull();
    expect(getByTestId("send-money-recipient-alex")).toBeTruthy();
  });

  it("accepts non-negative amounts with at most two decimals", async () => {
    const { getByTestId } = await render(<SendMoneyScreen />);
    const amountInput = getByTestId("send-money-amount-input");

    await fireEvent.changeText(amountInput, "12.345");
    expect(amountInput.props.value).toBe("12.34");

    await fireEvent.changeText(amountInput, "-8.50");
    expect(amountInput.props.value).toBe("0");

    await fireEvent.changeText(amountInput, "0.5");
    expect(amountInput.props.value).toBe("0.5");
  });

  it("selects the adjacent card after settled swipes and stays bounded", async () => {
    const { getByTestId } = await render(<SendMoneyScreen />);
    let carousel = getByTestId("send-money-card-mastercard").parent;
    while (
      carousel &&
      typeof carousel.props.onMomentumScrollEnd !== "function"
    ) {
      carousel = carousel.parent;
    }

    expect(carousel).toBeTruthy();

    await fireEvent(carousel!, "momentumScrollEnd", {
      nativeEvent: { contentOffset: { x: 10000 } },
    });
    expect(
      getByTestId("send-money-card-page-visa").props.accessibilityState,
    ).toEqual({ selected: true });
    expect(
      getByTestId("send-money-card-page-mastercard").props.accessibilityState,
    ).toEqual({ selected: false });

    await fireEvent(carousel!, "momentumScrollEnd", {
      nativeEvent: { contentOffset: { x: 0 } },
    });
    expect(
      getByTestId("send-money-card-page-mastercard").props.accessibilityState,
    ).toEqual({ selected: true });

    await fireEvent(carousel!, "momentumScrollEnd", {
      nativeEvent: { contentOffset: { x: 9999 } },
    });
    expect(
      getByTestId("send-money-card-page-visa").props.accessibilityState,
    ).toEqual({ selected: true });
    await fireEvent(carousel!, "momentumScrollEnd", {
      nativeEvent: { contentOffset: { x: -9999 } },
    });
    expect(
      getByTestId("send-money-card-page-mastercard").props.accessibilityState,
    ).toEqual({ selected: true });
  });
});
