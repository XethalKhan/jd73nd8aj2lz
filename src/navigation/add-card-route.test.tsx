import { render } from "@testing-library/react-native";

import AddCardRoute from "../../app/(closed)/add-card";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => ({ back: jest.fn() })),
}));

describe("AddCardRoute", () => {
  it("renders the Add Card stack destination", async () => {
    const { getByText } = await render(<AddCardRoute />);

    expect(getByText("Add New Card")).toBeTruthy();
  });
});
