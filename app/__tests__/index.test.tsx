import { render } from "@testing-library/react-native";

import Index from "../index";

const mockAuthState = {
  isAuthenticated: false,
};

jest.mock("expo-router", () => {
  const { Text: MockText } =
    jest.requireActual<typeof import("react-native")>("react-native");

  return {
    Redirect: ({ href }: { href: string }) => (
      <MockText testID="redirect">{href}</MockText>
    ),
  };
});

jest.mock("../../src/auth/client", () => ({
  useAuthStore: jest.fn((selector: (state: typeof mockAuthState) => unknown) =>
    selector(mockAuthState),
  ),
}));

describe("root route", () => {
  it("redirects authenticated users to Home", async () => {
    mockAuthState.isAuthenticated = true;
    const { getByTestId } = await render(<Index />);

    expect(getByTestId("redirect").props.children).toBe(
      "/(closed)/(tabs)/home",
    );

    mockAuthState.isAuthenticated = false;
  });

  it("redirects unauthenticated users to Welcome", async () => {
    const { getByTestId } = await render(<Index />);

    expect(getByTestId("redirect").props.children).toBe("/(open)/welcome");
  });
});
