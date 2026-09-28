import { fireEvent, render } from "@testing-library/react-native";
import { Text } from "react-native";

import { IconButton } from "./IconButton";
import { ScreenHeader } from "./ScreenHeader";

describe("ScreenHeader", () => {
  it("renders a centered title and custom actions", async () => {
    const { getByRole, getByText, getByTestId } = await render(
      <ScreenHeader
        leftAction={
          <IconButton accessibilityLabel="Back" icon={<Text>‹</Text>} />
        }
        rightAction={
          <IconButton accessibilityLabel="Help" icon={<Text>?</Text>} />
        }
        testID="screen-header"
        title="Settings"
      />,
    );

    expect(getByText("Settings")).toHaveProp("pointerEvents", "none");
    expect(getByTestId("screen-header")).toHaveStyle({
      height: 42,
      paddingHorizontal: 20,
    });
    expect(getByRole("button", { name: "Back" })).toBeTruthy();
    expect(getByRole("button", { name: "Help" })).toBeTruthy();
  });

  it("provides an optional accessible back action", async () => {
    const onBackPress = jest.fn();
    const { getByRole } = await render(
      <ScreenHeader onBackPress={onBackPress} title="Details" />,
    );

    const backButton = getByRole("button", { name: "Go back" });
    await fireEvent.press(backButton);
    expect(onBackPress).toHaveBeenCalledTimes(1);
  });
});
