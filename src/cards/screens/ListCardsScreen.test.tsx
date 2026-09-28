import { fireEvent, render } from "@testing-library/react-native";
import { useRouter } from "expo-router";

import { ListCardsScreen } from "./ListCardsScreen";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("ListCardsScreen", () => {
  const back = jest.fn();
  const push = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ back, push });
  });

  it("renders the reference title and two shared payment cards", async () => {
    const { getAllByTestId, getAllByText, getByText, getByTestId } = await render(
      <ListCardsScreen />,
    );

    expect(getByText("Cards")).toBeTruthy();
    expect(getAllByTestId("list-cards-payment-card")).toHaveLength(2);
    expect(getByText("4562")).toBeTruthy();
    expect(getByText("1122")).toBeTruthy();
    expect(getByText("4595")).toBeTruthy();
    expect(getByText("7852")).toBeTruthy();
    expect(getByText("AR Jonson")).toBeTruthy();
    expect(getByText("24/2000")).toBeTruthy();
    expect(getByText("6986")).toBeTruthy();
    expect(getAllByText("4242")).toHaveLength(4);
    expect(getByText("Alex Morgan")).toBeTruthy();
    expect(getByText("12/29")).toBeTruthy();
    expect(getByText("123")).toBeTruthy();
    expect(getByTestId("card-mastercard-logo")).toBeTruthy();
    expect(getByTestId("card-visa-logo")).toBeTruthy();
    expect(getAllByTestId("card-contactless")).toHaveLength(2);
  });

  it("navigates to add card and keeps the other affordances inert", async () => {
    const { getByLabelText } = await render(<ListCardsScreen />);

    expect(getByLabelText("More card options")).toBeTruthy();
    expect(getByLabelText("Add new card")).toBeTruthy();

    await fireEvent.press(getByLabelText("More card options"));
    await fireEvent.press(getByLabelText("Add new card"));

    expect(back).not.toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/add-card");
    expect(push).toHaveBeenCalledTimes(1);

    await fireEvent.press(getByLabelText("Go back"));

    expect(back).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledTimes(1);
  });
});
