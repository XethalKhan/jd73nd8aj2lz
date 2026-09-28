import { fireEvent, render } from "@testing-library/react-native";
import { Text } from "react-native";

import { IconButton } from "./IconButton";

describe("IconButton", () => {
  it("renders a labeled circular action and calls onPress", async () => {
    const onPress = jest.fn();
    const { getByRole } = await render(
      <IconButton
        accessibilityLabel="Open menu"
        backgroundColor="#F4F4F4"
        icon={<Text>Menu</Text>}
        onPress={onPress}
      />,
    );

    const button = getByRole("button", { name: "Open menu" });
    expect(button).toHaveStyle({
      backgroundColor: "#F4F4F4",
      borderRadius: 21,
      height: 42,
      width: 42,
    });
    await fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("supports a custom size and border", async () => {
    const { getByRole } = await render(
      <IconButton
        accessibilityLabel="Close"
        borderColor="#066BFF"
        icon={<Text>X</Text>}
        size={50}
      />,
    );

    expect(getByRole("button")).toHaveStyle({
      borderColor: "#066BFF",
      borderRadius: 25,
      borderWidth: 1,
      height: 50,
      width: 50,
    });
  });
});
