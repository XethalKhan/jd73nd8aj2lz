import { render } from "@testing-library/react-native";

import { Card } from "./Card";

const cardDetails = {
  cardNumber: "4242 4242 4242 4242",
  cardholderName: "Alex Morgan",
  expiryDate: "12/29",
  cvv: "123",
};

describe("Card", () => {
  it("renders all supplied card details as semantic text", async () => {
    const { getAllByText, getByText } = await render(<Card {...cardDetails} />);

    expect(getAllByText("4242")).toHaveLength(4);
    expect(getByText(cardDetails.cardholderName)).toBeTruthy();
    expect(getByText(cardDetails.expiryDate)).toBeTruthy();
    expect(getByText(cardDetails.cvv)).toBeTruthy();
  });

  it("updates visible values when card details change", async () => {
    const { getAllByText, getByText, queryByText, rerender } = await render(
      <Card {...cardDetails} />,
    );

    await rerender(
      <Card
        cardNumber="5555 5555 5555 4444"
        cardholderName="Jordan Lee"
        cvv="987"
        expiryDate="01/31"
      />,
    );

    expect(getAllByText("5555")).toHaveLength(3);
    expect(getByText("4444")).toBeTruthy();
    expect(getByText("Jordan Lee")).toBeTruthy();
    expect(getByText("01/31")).toBeTruthy();
    expect(getByText("987")).toBeTruthy();
    expect(queryByText(cardDetails.cardNumber)).toBeNull();
    expect(queryByText(cardDetails.cardholderName)).toBeNull();
    expect(queryByText(cardDetails.expiryDate)).toBeNull();
    expect(queryByText(cardDetails.cvv)).toBeNull();
  });

  it("renders only the selected network logo", async () => {
    const { getByTestId, queryByTestId, rerender } = await render(
      <Card {...cardDetails} brand="visa" />,
    );

    expect(getByTestId("card-visa-logo")).toBeTruthy();
    expect(queryByTestId("card-mastercard-logo")).toBeNull();

    await rerender(<Card {...cardDetails} brand="mastercard" />);

    expect(getByTestId("card-mastercard-logo")).toBeTruthy();
    expect(queryByTestId("card-visa-logo")).toBeNull();

    await rerender(<Card {...cardDetails} />);

    expect(queryByTestId("card-visa-logo")).toBeNull();
    expect(queryByTestId("card-mastercard-logo")).toBeNull();
  });

  it("controls the contactless layer", async () => {
    const { getByTestId, queryByTestId, rerender } = await render(
      <Card
        {...cardDetails}
        brand="visa"
        showContactless
      />,
    );

    expect(getByTestId("card-contactless")).toBeTruthy();

    await rerender(
      <Card
        {...cardDetails}
        brand="mastercard"
        showContactless
      />,
    );

    expect(getByTestId("card-contactless")).toBeTruthy();

    await rerender(<Card {...cardDetails} showContactless={false} />);

    expect(queryByTestId("card-contactless")).toBeNull();
  });

  it("keeps the landscape aspect ratio on the responsive wrapper", async () => {
    const { getByTestId } = await render(<Card {...cardDetails} />);

    expect(getByTestId("payment-card")).toHaveStyle({
      aspectRatio: 348 / 199,
      width: "100%",
    });
  });
});
