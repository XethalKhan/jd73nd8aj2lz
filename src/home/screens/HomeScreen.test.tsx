import { fireEvent, render } from "@testing-library/react-native";

import { HomeScreen } from "./HomeScreen";

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => ({ push: mockPush })),
}));

describe("HomeScreen", () => {
  it("renders the dashboard composition and shared payment card", async () => {
    const { getAllByText, getByTestId, getByText } = await render(
      <HomeScreen />,
    );

    expect(getByText("Welcome back,")).toBeTruthy();
    expect(getByText("Tanya Myroniuk")).toBeTruthy();
    expect(getByTestId("home-payment-card")).toBeTruthy();
    expect(getAllByText("Transaction")).toHaveLength(2);
    expect(getByText("Apple Store")).toBeTruthy();
    expect(getByText("Spotify")).toBeTruthy();
    expect(getByText("Money Transfer")).toBeTruthy();
    expect(getByText("Grocery")).toBeTruthy();
  });

  it("opens Send Money from the Send action", async () => {
    const { getByRole } = await render(<HomeScreen />);

    await fireEvent.press(getByRole("button", { name: "Send" }));

    expect(mockPush).toHaveBeenCalledWith("/send-money");
  });

  it("keeps other payment actions behaviorless", async () => {
    const { getByRole } = await render(<HomeScreen />);

    for (const label of ["Receive", "Topup", "Loan"]) {
      const action = getByRole("button", { name: label });

      expect(action).toBeTruthy();
      await fireEvent.press(action);
    }
  });
});
