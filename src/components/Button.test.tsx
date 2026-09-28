import { fireEvent, render } from "@testing-library/react-native";
import { Text } from "react-native";

import { Button } from "./Button";

describe("Button", () => {
  it("renders an accessible button and calls onPress", async () => {
    const onPress = jest.fn();
    const { getByRole } = await render(
      <Button accessibilityLabel="Continue" onPress={onPress}>
        Continue
      </Button>,
    );

    const button = getByRole("button", { name: "Continue" });
    expect(button).toBeTruthy();
    await fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("supports variants, full width, and an icon", async () => {
    const { getByRole } = await render(
      <Button
        accessibilityLabel="Learn more"
        fullWidth
        icon={<Text testID="button-icon">+</Text>}
        variant="outlined"
      >
        Learn more
      </Button>,
    );

    expect(getByRole("button")).toHaveStyle({
      backgroundColor: "transparent",
      borderColor: "#066BFF",
      borderWidth: 1,
      width: "100%",
    });
    expect(getByRole("button")).toBeTruthy();
  });

  it("preserves disabled accessibility state while loading", async () => {
    const onPress = jest.fn();
    const { getByRole, getByLabelText } = await render(
      <Button accessibilityLabel="Saving" loading onPress={onPress}>
        Save
      </Button>,
    );

    expect(getByRole("button").props.accessibilityState).toEqual({
      disabled: true,
    });
    expect(getByLabelText("Loading")).toBeTruthy();
    await fireEvent.press(getByRole("button"));
    expect(onPress).not.toHaveBeenCalled();
  });
});
