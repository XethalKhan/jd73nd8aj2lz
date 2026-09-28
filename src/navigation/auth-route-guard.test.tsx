import { render } from "@testing-library/react-native";
import type { ReactNode } from "react";

import ClosedLayout from "../../app/(closed)/_layout";
import OpenLayout from "../../app/(open)/_layout";

const mockAuthState = {
  isAuthenticated: false,
  isBootstrapping: false,
};

jest.mock("expo-router", () => {
  const { Text: MockText } = jest.requireActual<typeof import("react-native")>(
    "react-native",
  );
  const MockStack = ({ children }: { children?: ReactNode }) => (
    <MockText testID="stack">{children ?? "Stack"}</MockText>
  );
  return {
    Redirect: ({ href }: { href: string }) => (
      <MockText testID="redirect">{href}</MockText>
    ),
    Stack: MockStack,
  };
});

jest.mock("../auth/client", () => ({
  useAuthStore: jest.fn((selector: (state: typeof mockAuthState) => unknown) =>
    selector(mockAuthState),
  ),
}));

describe("auth route guards", () => {
  it("redirects unauthenticated users away from closed routes", async () => {
    const { getByTestId } = await render(<ClosedLayout />);

    expect(getByTestId("redirect").props.children).toBe("/(open)/welcome");
  });

  it("redirects authenticated users away from open routes", async () => {
    mockAuthState.isAuthenticated = true;
    const { getByTestId } = await render(<OpenLayout />);

    expect(getByTestId("redirect").props.children).toBe(
      "/(closed)/onboarding/1",
    );
    mockAuthState.isAuthenticated = false;
  });

  it("renders a route group while auth bootstrap is pending", async () => {
    mockAuthState.isBootstrapping = true;
    mockAuthState.isAuthenticated = false;

    const { getByTestId } = await render(<ClosedLayout />);

    expect(getByTestId("stack")).toBeTruthy();
    mockAuthState.isBootstrapping = false;
  });
});
