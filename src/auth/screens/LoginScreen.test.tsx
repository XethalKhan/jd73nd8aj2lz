import { fireEvent, render } from "@testing-library/react-native";
import { useRouter } from "expo-router";

import { LoginScreen } from "./LoginScreen";

const login = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../client", () => ({
  useAuthStore: jest.fn(),
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
    const { useAuthStore } = jest.requireMock("../client") as {
      useAuthStore: jest.Mock;
    };
    useAuthStore.mockImplementation((selector: (state: unknown) => unknown) =>
      selector({ login }),
    );
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

  it("submits credentials and navigates only after successful authentication", async () => {
    login.mockResolvedValueOnce({});
    const { getByLabelText, getByRole } = await render(<LoginScreen />);
    const submit = getByRole("button", { name: "Sign In" });

    await fireEvent.changeText(getByLabelText("Email Address"), "any-value");
    await fireEvent.changeText(getByLabelText("Password"), "not-a-password");
    await fireEvent.press(submit);

    expect(login).toHaveBeenCalledWith({
      username: "any-value",
      password: "not-a-password",
    });
    expect(replace).toHaveBeenCalledWith("/(closed)/onboarding/1");
  });

  it("shows an authentication failure and remains in the open flow", async () => {
    login.mockRejectedValueOnce(new Error("invalid credentials"));
    const { getByRole, getByText } = await render(<LoginScreen />);

    await fireEvent.press(getByRole("button", { name: "Sign In" }));

    expect(getByText("Authentication failed")).toBeTruthy();
    expect(replace).not.toHaveBeenCalled();
  });

  it("returns to the previous open destination", async () => {
    const { getByLabelText } = await render(<LoginScreen />);

    await fireEvent.press(getByLabelText("Go back"));

    expect(back).toHaveBeenCalledTimes(1);
  });
});
