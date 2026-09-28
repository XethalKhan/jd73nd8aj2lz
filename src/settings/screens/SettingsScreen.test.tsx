import { fireEvent, render } from "@testing-library/react-native";
import { useRouter } from "expo-router";

import { SettingsScreen } from "./SettingsScreen";

const logout = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../../auth/client", () => ({
  useAuthStore: jest.fn(),
}));

describe("SettingsScreen", () => {
  const back = jest.fn();
  const push = jest.fn();
  const replace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    logout.mockResolvedValue(undefined);
    (useRouter as jest.Mock).mockReturnValue({ back, push, replace });
    const { useAuthStore } = jest.requireMock("../../auth/client") as {
      useAuthStore: jest.Mock;
    };
    useAuthStore.mockImplementation((selector: (state: unknown) => unknown) =>
      selector({ logout }),
    );
  });

  it("renders the designed settings sections and controls", async () => {
    const { getByLabelText, getByText } = await render(<SettingsScreen />);

    expect(getByText("Settings")).toBeTruthy();
    expect(getByText("General")).toBeTruthy();
    expect(getByText("Security")).toBeTruthy();
    expect(getByText("Language")).toBeTruthy();
    expect(getByText("English")).toBeTruthy();
    expect(getByText("My Profile")).toBeTruthy();
    expect(getByText("Contact Us")).toBeTruthy();
    expect(getByText("Change Password")).toBeTruthy();
    expect(getByText("Privacy Policy")).toBeTruthy();
    expect(getByText("Biometric")).toBeTruthy();
    expect(getByLabelText("Go back")).toBeTruthy();
    expect(getByLabelText("Log out")).toBeTruthy();
  });

  it("requests back navigation, opens Profile and Change Password, and keeps other rows local", async () => {
    const { getByLabelText } = await render(<SettingsScreen />);

    await fireEvent.press(getByLabelText("Go back"));
    await fireEvent.press(getByLabelText("Log out"));
    await fireEvent.press(getByLabelText("Language"));
    await fireEvent.press(getByLabelText("Contact Us"));
    await fireEvent.press(getByLabelText("Change Password"));
    await fireEvent.press(getByLabelText("Privacy Policy"));
    await fireEvent.press(getByLabelText("My Profile"));

    expect(back).toHaveBeenCalledTimes(1);
    expect(logout).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenCalledWith("/(open)/welcome");
    expect(push).toHaveBeenNthCalledWith(1, "/settings/language");
    expect(push).toHaveBeenNthCalledWith(2, "/change-password");
    expect(push).toHaveBeenNthCalledWith(3, "/profile");
    expect(push).toHaveBeenCalledTimes(3);
  });

  it("toggles only the local biometric state", async () => {
    const { getByLabelText } = await render(<SettingsScreen />);
    const biometric = getByLabelText("Biometric");

    expect(biometric.props.accessibilityState).toEqual({ checked: false });

    await fireEvent.press(biometric);

    expect(getByLabelText("Biometric").props.accessibilityState).toEqual({
      checked: true,
    });
    expect(back).not.toHaveBeenCalled();
  });
});
