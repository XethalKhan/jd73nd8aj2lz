import { fireEvent, render } from "@testing-library/react-native";
import { useRouter } from "expo-router";

import { WelcomeScreen } from "./WelcomeScreen";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("expo-image", () => ({
  Image: "Image",
}));

describe("WelcomeScreen", () => {
  const push = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push });
  });

  it("renders both accessible entry actions", async () => {
    const { getByRole } = await render(<WelcomeScreen />);

    expect(getByRole("button", { name: "Sign in" })).toBeTruthy();
    expect(getByRole("button", { name: "Sign up" })).toBeTruthy();
  });

  it("navigates to the login screen", async () => {
    const { getByRole } = await render(<WelcomeScreen />);

    await fireEvent.press(getByRole("button", { name: "Sign in" }));

    expect(push).toHaveBeenCalledWith("/(open)/login");
  });

  it("navigates to the create-account screen", async () => {
    const { getByRole } = await render(<WelcomeScreen />);

    await fireEvent.press(getByRole("button", { name: "Sign up" }));

    expect(push).toHaveBeenCalledWith("/(open)/create-account");
  });
});
