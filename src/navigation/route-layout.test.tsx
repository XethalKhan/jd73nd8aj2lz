import { fireEvent, render } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { useRouter } from "expo-router";

import ClosedLayout from "../../app/(closed)/_layout";
import AddCardRoute from "../../app/(closed)/add-card";
import ChangePasswordRoute from "../../app/(closed)/change-password";
import EditProfileRoute from "../../app/(closed)/edit-profile";
import OnboardingRoute from "../../app/(closed)/onboarding/1";
import ProfileRoute from "../../app/(closed)/profile";
import ListCardsRoute from "../../app/(closed)/settings/list-cards";
import SendMoneyRoute from "../../app/(closed)/send-money";

jest.mock("expo-router", () => {
  const { Text: MockText } = jest.requireActual<typeof import("react-native")>(
    "react-native",
  );
  const MockStack = ({ children }: { children?: ReactNode }) => (
    <MockText testID="stack-layout">{children ?? "Stack"}</MockText>
  );
  MockStack.displayName = "MockStack";

  return {
    Stack: MockStack,
    useRouter: jest.fn(() => ({ back: jest.fn(), push: jest.fn() })),
  };
});

describe("authenticated route layout", () => {
  it("uses a parent stack without declaring tab screens", async () => {
    const { getByTestId, queryAllByTestId } = await render(<ClosedLayout />);

    expect(getByTestId("stack-layout")).toBeTruthy();
    expect(queryAllByTestId(/^tab-/)).toHaveLength(0);
  });

  it.each([
    ["Profile", ProfileRoute],
    ["Edit Profile", EditProfileRoute],
    ["Add New Card", AddCardRoute],
    ["Change Password", ChangePasswordRoute],
    ["Cards", ListCardsRoute],
  ])("renders %s as a stack destination", async (label, Route) => {
    const { getAllByText } = await render(<Route />);

    expect(getAllByText(label).length).toBeGreaterThan(0);
  });

  it("renders onboarding outside the tab navigator", async () => {
    const { getByText } = await render(<OnboardingRoute />);

    expect(getByText("Fastest Payment in the world")).toBeTruthy();
  });

  it("renders Send Money outside the tab navigator", async () => {
    const { getByTestId } = await render(<SendMoneyRoute />);

    expect(getByTestId("send-money-title")).toBeTruthy();
  });

  it("keeps List Cards back navigation on the stack", async () => {
    const back = jest.fn();
    jest.mocked(useRouter).mockReturnValue({
      back,
      canDismiss: jest.fn(() => true),
      canGoBack: jest.fn(() => true),
      dismiss: jest.fn(),
      dismissAll: jest.fn(),
      dismissTo: jest.fn(),
      navigate: jest.fn(),
      prefetch: jest.fn(),
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      setParams: jest.fn(),
    });

    const { getByTestId } = await render(<ListCardsRoute />);
    await fireEvent.press(getByTestId("list-cards-back"));

    expect(back).toHaveBeenCalledTimes(1);
  });
});
