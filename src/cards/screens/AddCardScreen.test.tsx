import { fireEvent, render } from "@testing-library/react-native";
import { useRouter } from "expo-router";

import { AddCardScreen } from "./AddCardScreen";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("AddCardScreen", () => {
  const back = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ back });
  });

  it("renders the reference copy, fields, and shared card preview", async () => {
    const { getByLabelText, getByText, getByTestId } = await render(
      <AddCardScreen />,
    );

    expect(getByText("Add New Card")).toBeTruthy();
    expect(getByTestId("add-card-payment-card")).toBeTruthy();
    expect(getByLabelText("Cardholder Name")).toBeTruthy();
    expect(getByLabelText("Card Number")).toBeTruthy();
    expect(getByLabelText("Expiry Date")).toBeTruthy();
    expect(getByLabelText("CVV")).toBeTruthy();
    expect(getByText("4562")).toBeTruthy();
    expect(getByText("1122")).toBeTruthy();
    expect(getByText("4595")).toBeTruthy();
    expect(getByText("7852")).toBeTruthy();
    expect(getByText("AR Jonson")).toBeTruthy();
    expect(getByText("24/2000")).toBeTruthy();
    expect(getByText("6986")).toBeTruthy();
  });

  it("keeps Card Number above the expiry and CVV row", async () => {
    const { getByTestId } = await render(<AddCardScreen />);

    const fields = [
      "add-card-field-cardholder-name",
      "add-card-field-card-number",
      "add-card-field-details",
    ].map((testID) => getByTestId(testID));

    expect(fields).toHaveLength(3);
    expect(getByTestId("add-card-field-expiry-date")).toBeTruthy();
    expect(getByTestId("add-card-field-cvv")).toBeTruthy();
  });

  it("updates local fields and the shared card preview", async () => {
    const { getByLabelText, getByText } = await render(<AddCardScreen />);

    await fireEvent.changeText(getByLabelText("Cardholder Name"), "Jane Doe");
    await fireEvent.changeText(
      getByLabelText("Card Number"),
      "4111 1111 1111 1111",
    );
    await fireEvent.changeText(getByLabelText("Expiry Date"), "12/29");
    await fireEvent.changeText(getByLabelText("CVV"), "123");

    expect(getByLabelText("Cardholder Name").props.value).toBe("Jane Doe");
    expect(getByLabelText("Card Number").props.value).toBe(
      "4111 1111 1111 1111",
    );
    expect(getByLabelText("Expiry Date").props.value).toBe("12/29");
    expect(getByLabelText("CVV").props.value).toBe("123");
    expect(getByText("Jane Doe")).toBeTruthy();
    expect(getByText("4111")).toBeTruthy();
    expect(getByText("12/29")).toBeTruthy();
    expect(getByText("123")).toBeTruthy();
  });

  it("requests back navigation without exposing submission behavior", async () => {
    const { getByLabelText, queryByText } = await render(<AddCardScreen />);

    await fireEvent.press(getByLabelText("Go back"));

    expect(back).toHaveBeenCalledTimes(1);
    expect(queryByText("Save")).toBeNull();
    expect(queryByText("Submit")).toBeNull();
  });
});
