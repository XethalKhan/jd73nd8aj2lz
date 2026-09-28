import { fireEvent, render } from "@testing-library/react-native";
import { useRouter } from "expo-router";

import { EditProfileScreen } from "./EditProfileScreen";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("EditProfileScreen", () => {
  const back = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ back });
  });

  it("renders the approved editable account details", async () => {
    const { getAllByText, getByDisplayValue, getByLabelText, getByText } =
      await render(
      <EditProfileScreen />,
      );

    ["Edit Profile", "Senior Designer", "Full Name", "Email Address", "Phone Number", "Birth Date", "Joined 28 Jan 2021"].forEach(
      (copy) => expect(getByText(copy)).toBeTruthy(),
    );

    expect(getAllByText("Tanya Myroniuk")).toHaveLength(1);
    ["Tanya Myroniuk", "tanya.myroniuk@gmail.com", "+8801712663389", "28", "September", "2000"].forEach(
      (value) => expect(getByDisplayValue(value)).toBeTruthy(),
    );

    expect(getByLabelText("Change profile photo")).toBeTruthy();
    expect(getByLabelText("Go back")).toBeTruthy();
    expect(getByLabelText("Save profile").props.accessibilityState).toEqual({
      disabled: true,
    });
  });

  it("updates local field values while keeping Save disabled", async () => {
    const { getByDisplayValue, getByLabelText } = await render(
      <EditProfileScreen />,
    );

    await fireEvent.changeText(getByLabelText("Full Name"), "Alex Smith");
    await fireEvent.changeText(
      getByLabelText("Email Address"),
      "alex@example.com",
    );
    await fireEvent.changeText(getByLabelText("Phone Number"), "+123456789");

    expect(back).not.toHaveBeenCalled();
    expect(getByDisplayValue("Alex Smith")).toBeTruthy();
    expect(getByDisplayValue("alex@example.com")).toBeTruthy();
    expect(getByDisplayValue("+123456789")).toBeTruthy();
    expect(getByLabelText("Save profile").props.accessibilityState).toEqual({
      disabled: true,
    });
  });

  it("only requests back navigation from the header control", async () => {
    const { getByLabelText } = await render(<EditProfileScreen />);

    await fireEvent.press(getByLabelText("Go back"));

    expect(back).toHaveBeenCalledTimes(1);
  });
});
