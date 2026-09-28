import { fireEvent, render } from "@testing-library/react-native";
import { useRouter } from "expo-router";

import { SignUpScreen } from "./SignUpScreen";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("expo-image", () => ({
  Image: "Image",
}));

describe("SignUpScreen", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ back: jest.fn() });
  });

  it("renders the required copy, field order, and controls", async () => {
    const { getByLabelText, getByRole, getByText } = await render(
      <SignUpScreen />,
    );

    expect(getByRole("button", { name: "Sign Up" })).toBeTruthy();
    expect(getByText("Full Name")).toBeTruthy();
    expect(getByText("Phone Number")).toBeTruthy();
    expect(getByText("Email Address")).toBeTruthy();
    expect(getByText("Password")).toBeTruthy();
    expect(getByText(/Already have an account\./)).toBeTruthy();
    expect(getByLabelText("Go back")).toBeTruthy();
    expect(getByRole("button", { name: "Show password" })).toBeTruthy();
    expect(getByLabelText("Full Name")).toBeTruthy();
    expect(getByLabelText("Phone Number")).toBeTruthy();
    expect(getByLabelText("Email Address")).toBeTruthy();
    expect(getByLabelText("Password")).toBeTruthy();
  });

  it("accepts field text without introducing account creation behavior", async () => {
    const { getByLabelText } = await render(<SignUpScreen />);

    await fireEvent.changeText(getByLabelText("Full Name"), "Any Person");
    await fireEvent.changeText(getByLabelText("Phone Number"), "5555555555");
    await fireEvent.changeText(
      getByLabelText("Email Address"),
      "any@example.com",
    );
    await fireEvent.changeText(getByLabelText("Password"), "arbitrary");

    expect(getByLabelText("Full Name").props.value).toBe("Any Person");
    expect(getByLabelText("Phone Number").props.value).toBe("5555555555");
    expect(getByLabelText("Email Address").props.value).toBe("any@example.com");
    expect(getByLabelText("Password").props.value).toBe("arbitrary");
  });
});
