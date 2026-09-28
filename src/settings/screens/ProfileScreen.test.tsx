import { fireEvent, render } from "@testing-library/react-native";
import { useRouter } from "expo-router";

import { ProfileScreen } from "./ProfileScreen";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("ProfileScreen", () => {
  const back = jest.fn();
  const push = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ back, push });
  });

  it("renders the account summary and profile rows", async () => {
    const { getByLabelText, getByText } = await render(<ProfileScreen />);

    expect(getByText("Profile")).toBeTruthy();
    expect(getByText("Tanya Myroniuk")).toBeTruthy();
    expect(getByText("Senior Designer")).toBeTruthy();
    expect(getByLabelText("Profile avatar")).toBeTruthy();

    [
      "Personal Information",
      "Payment Preferences",
      "Banks and Cards",
      "Notifications",
      "Message Center",
      "Address",
      "Settings",
    ].forEach((label) => expect(getByLabelText(label)).toBeTruthy());

    expect(getByLabelText("2 unread notifications")).toBeTruthy();
  });

  it("opens Edit Profile, opens Banks and Cards, and keeps other rows local", async () => {
    const { getByLabelText } = await render(<ProfileScreen />);

    await fireEvent.press(getByLabelText("Edit profile"));
    await fireEvent.press(getByLabelText("Personal Information"));
    await fireEvent.press(getByLabelText("Payment Preferences"));
    await fireEvent.press(getByLabelText("Banks and Cards"));
    await fireEvent.press(getByLabelText("Notifications"));
    await fireEvent.press(getByLabelText("Message Center"));
    await fireEvent.press(getByLabelText("Address"));
    await fireEvent.press(getByLabelText("Settings"));

    expect(back).not.toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/edit-profile");
    expect(push).toHaveBeenNthCalledWith(3, "/settings/list-cards");
    expect(push).toHaveBeenCalledTimes(3);

    await fireEvent.press(getByLabelText("Go back"));

    expect(back).toHaveBeenCalledTimes(1);
  });
});
