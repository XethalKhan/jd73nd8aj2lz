import { fireEvent, render } from "@testing-library/react-native";
import { useRouter } from "expo-router";

import { LoginScreen } from "./LoginScreen";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("expo-image", () => ({
  Image: "Image",
}));

describe("LoginScreen", () => {
  const back = jest.fn();
  const replace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ back, replace });
  });

  it("renders the required copy and accessible controls", async () => {
    const { getByLabelText, getByRole, getByText } = await render(
      <LoginScreen />,
    );

    expect(getByRole("button", { name: "Sign In" })).toBeTruthy();
    expect(getByText("Email Address")).toBeTruthy();
    expect(getByText("Password")).toBeTruthy();
    expect(getByText(/I’m a new user\./)).toBeTruthy();
    expect(getByLabelText("Go back")).toBeTruthy();
    expect(getByRole("button", { name: "Show password" })).toBeTruthy();
    expect(getByLabelText("Email Address")).toBeTruthy();
    expect(getByLabelText("Password")).toBeTruthy();
  });

  it("accepts text and replaces the route on empty or arbitrary submission", async () => {
    const { getByLabelText, getByRole } = await render(<LoginScreen />);
    const submit = getByRole("button", { name: "Sign In" });

    await fireEvent.press(submit);
    await fireEvent.changeText(getByLabelText("Email Address"), "any-value");
    await fireEvent.changeText(getByLabelText("Password"), "not-a-password");
    await fireEvent.press(submit);

    expect(replace).toHaveBeenCalledTimes(2);
    expect(replace).toHaveBeenLastCalledWith("/(closed)/onboarding/1");
  });

  it("returns to the previous open destination", async () => {
    const { getByLabelText } = await render(<LoginScreen />);

    await fireEvent.press(getByLabelText("Go back"));

    expect(back).toHaveBeenCalledTimes(1);
  });
});
