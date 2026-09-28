import { fireEvent, render } from "@testing-library/react-native";

import { PasswordInput } from "./PasswordInput";

describe("PasswordInput", () => {
  it("starts secure and toggles visibility through an accessible button", async () => {
    const onToggleVisibility = jest.fn();
    const { getByRole, getByTestId } = await render(
      <PasswordInput
        accessibilityLabel="Password"
        onToggleVisibility={onToggleVisibility}
        testID="password-input"
        value="secret"
      />,
    );

    const input = getByTestId("password-input");
    const showButton = getByRole("button", { name: "Show password" });
    expect(input).toHaveProp("secureTextEntry", true);
    expect(showButton.props.accessibilityState).toEqual({ expanded: false });

    await fireEvent.press(showButton);
    expect(onToggleVisibility).toHaveBeenCalledWith(true);
    expect(getByTestId("password-input")).toHaveProp(
      "secureTextEntry",
      false,
    );
    expect(getByRole("button", { name: "Hide password" })).toBeTruthy();
  });

  it("supports labels and controlled visibility", async () => {
    const { getByText, getByRole, getByTestId, rerender } = await render(
      <PasswordInput
        label="Password"
        testID="password-input"
        visible
      />,
    );

    expect(getByText("Password")).toBeTruthy();
    expect(getByTestId("password-input")).toHaveProp("secureTextEntry", false);
    expect(getByRole("button", { name: "Hide password" })).toBeTruthy();

    await rerender(
      <PasswordInput
        label="Password"
        testID="password-input"
        visible={false}
      />,
    );
    expect(getByTestId("password-input")).toHaveProp("secureTextEntry", true);
  });

  it("keeps descriptions and errors when rendered with a label", async () => {
    const { getByText } = await render(
      <PasswordInput
        description="Use at least eight characters"
        error="Password is too short"
        label="Password"
      />,
    );

    expect(getByText("Use at least eight characters")).toBeTruthy();
    expect(getByText("Password is too short")).toBeTruthy();
  });
});
