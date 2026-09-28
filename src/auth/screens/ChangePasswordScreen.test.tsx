import { fireEvent, render } from "@testing-library/react-native";
import { useRouter } from "expo-router";

import { ChangePasswordScreen } from "./ChangePasswordScreen";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("expo-image", () => ({
  Image: "Image",
}));

describe("ChangePasswordScreen", () => {
  const back = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ back });
  });

  it("renders the designed fields, controls, and accessible labels", async () => {
    const { getAllByText, getByLabelText, getByRole, getByText } = await render(
      <ChangePasswordScreen />,
    );

    expect(getAllByText("Change Password")).toHaveLength(2);
    expect(getByRole("button", { name: "Change Password" })).toBeTruthy();
    expect(getByLabelText("Go back")).toBeTruthy();

    ["Current Password", "New Password", "Confirm Password"].forEach(
      (label) => {
        expect(getByText(label)).toBeTruthy();
        expect(getByLabelText(label)).toBeTruthy();
        expect(
          getByRole("button", { name: `Show ${label}` }),
        ).toBeTruthy();
      },
    );
  });

  it("keeps password fields editable and visibility state independent", async () => {
    const { getByLabelText, getByRole } = await render(
      <ChangePasswordScreen />,
    );
    const currentPassword = getByLabelText("Current Password");
    const newPassword = getByLabelText("New Password");
    const confirmPassword = getByLabelText("Confirm Password");

    expect(currentPassword.props.value).toBe("");
    expect(newPassword.props.value).toBe("");
    expect(confirmPassword.props.value).toBe("");
    expect(currentPassword.props.secureTextEntry).toBe(true);
    expect(newPassword.props.secureTextEntry).toBe(true);
    expect(confirmPassword.props.secureTextEntry).toBe(true);

    await fireEvent.changeText(currentPassword, "current");
    await fireEvent.changeText(newPassword, "new");

    expect(getByLabelText("Current Password").props.value).toBe("current");
    expect(getByLabelText("New Password").props.value).toBe("new");
    expect(getByLabelText("Confirm Password").props.value).toBe("");

    await fireEvent.press(getByRole("button", { name: "Show Current Password" }));
    await fireEvent.press(getByRole("button", { name: "Show New Password" }));

    expect(getByLabelText("Current Password").props.secureTextEntry).toBe(false);
    expect(getByLabelText("New Password").props.secureTextEntry).toBe(false);
    expect(getByLabelText("Confirm Password").props.secureTextEntry).toBe(true);
    expect(
      getByRole("button", { name: "Hide Current Password" }),
    ).toBeTruthy();
    expect(getByRole("button", { name: "Hide New Password" })).toBeTruthy();
  });

  it("only requests back navigation and keeps the primary button non-functional", async () => {
    const { getByLabelText, getByRole } = await render(
      <ChangePasswordScreen />,
    );

    await fireEvent.press(getByLabelText("Go back"));
    await fireEvent.press(getByRole("button", { name: "Change Password" }));

    expect(back).toHaveBeenCalledTimes(1);
  });
});
