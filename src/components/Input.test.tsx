import { fireEvent, render } from "@testing-library/react-native";
import { Text } from "react-native";

import { Input } from "./Input";

describe("Input", () => {
  it("renders a controlled text input and emits changes", async () => {
    const onChangeText = jest.fn();
    const { getByTestId } = await render(
      <Input
        accessibilityLabel="Email address"
        onChangeText={onChangeText}
        testID="email-input"
        value="alex@example.com"
      />,
    );

    const input = getByTestId("email-input");
    expect(input).toHaveDisplayValue("alex@example.com");
    await fireEvent.changeText(input, "new@example.com");
    expect(onChangeText).toHaveBeenCalledWith("new@example.com");
    expect(input.props.accessibilityState).toEqual({ disabled: false });
  });

  it("supports variants, density, icons, description, and errors", async () => {
    const { getByTestId, getByText } = await render(
      <Input
        description="Use your primary email"
        density="compact"
        error="Email is invalid"
        icon={<Text testID="input-icon">@</Text>}
        testID="compact-input"
        variant="filled"
      />,
    );

    expect(getByTestId("compact-input")).toHaveStyle({ height: 44 });
    expect(getByTestId("input-icon")).toBeTruthy();
    expect(getByText("Use your primary email")).toBeTruthy();
    expect(getByText("Email is invalid")).toBeTruthy();
    expect(getByTestId("compact-input").props.accessibilityState).toEqual({
      disabled: false,
    });
  });

  it("does not render optional content when omitted", async () => {
    const { queryByText, queryByTestId } = await render(
      <Input testID="plain-input" variant="plain" />,
    );

    expect(queryByText("Use your primary email")).toBeNull();
    expect(queryByTestId("input-icon")).toBeNull();
  });
});
