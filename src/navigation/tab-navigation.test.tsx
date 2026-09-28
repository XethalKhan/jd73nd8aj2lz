import { render } from "@testing-library/react-native";
import type { ReactNode } from "react";
import type { TestInstance } from "test-renderer";

import TabsLayout from "../../app/(closed)/(tabs)/_layout";
import MyCardsRoute from "../../app/(closed)/(tabs)/my-cards";
import SettingsRoute from "../../app/(closed)/(tabs)/settings";
import StatisticsRoute from "../../app/(closed)/(tabs)/statistics";

jest.mock("expo-router", () => {
  const { Text: MockText } = jest.requireActual<typeof import("react-native")>(
    "react-native",
  );
  const MockTabsScreen = ({ name }: { name: string }) => (
    <MockText testID={`tab-${name}`}>{name}</MockText>
  );
  MockTabsScreen.displayName = "MockTabsScreen";

  const MockTabs = Object.assign(
    ({ children }: { children: ReactNode }) => <>{children}</>,
    { Screen: MockTabsScreen, displayName: "MockTabs" },
  );

  return {
    Tabs: MockTabs,
    useRouter: jest.fn(() => ({ back: jest.fn(), push: jest.fn() })),
  };
});

function getTabName(tab: TestInstance): string {
  const [child] = tab.children;

  if (typeof child !== "string") {
    throw new Error("Expected a tab label");
  }

  return child;
}

describe("authenticated tab navigation", () => {
  it.each([
    ["My Cards", MyCardsRoute],
    ["Statistics", StatisticsRoute],
    ["Settings", SettingsRoute],
  ])("renders the %s destination", async (destination, Route) => {
    const { getByText } = await render(<Route />);

    expect(getByText(destination)).toBeTruthy();
  });

  it("declares exactly four selectable tabs in order", async () => {
    const { getAllByTestId } = await render(<TabsLayout />);

    expect(getAllByTestId(/^tab-/).map(getTabName)).toEqual([
      "home",
      "my-cards",
      "statistics",
      "settings",
    ]);
  });
});
