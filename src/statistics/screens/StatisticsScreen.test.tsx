import { render } from "@testing-library/react-native";

import { i18n } from "../../i18n";
import { euriborData } from "../data/statisticsData";
import { StatisticsScreen } from "./StatisticsScreen";

describe("StatisticsScreen", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("renders the three dashboard cards with a six-month EURIBOR chart", async () => {
    const { getByTestId, queryByRole } = await render(<StatisticsScreen />);

    expect(getByTestId("statistics-euribor-card")).toBeTruthy();
    expect(getByTestId("statistics-category-card")).toBeTruthy();
    expect(getByTestId("statistics-savings-card")).toBeTruthy();
    expect(queryByRole("button", { name: "Weekly" })).toBeNull();
    expect(queryByRole("button", { name: "Monthly" })).toBeNull();
    expect(queryByRole("button", { name: "Yearly" })).toBeNull();
    expect(euriborData).toHaveLength(6);
    expect(euriborData.map(({ label }) => label)).toEqual([
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
    ]);
    expect(getByTestId("statistics-line-chart-path")).toBeTruthy();
    expect(getByTestId("statistics-pie-chart-slice-0")).toBeTruthy();
    expect(getByTestId("statistics-bar-chart-bar-0")).toBeTruthy();
  });

  it("renders no more than six category legend entries", async () => {
    const { getAllByText } = await render(<StatisticsScreen />);

    expect(getAllByText(/Housing|Food|Transport|Shopping|Entertainment|Other/))
      .toHaveLength(6);
  });

  it("renders translated labels in English", async () => {
    const { getByText, unmount } = await render(<StatisticsScreen />);

    expect(getByText("Statistics")).toBeTruthy();
    expect(getByText("EURIBOR trend")).toBeTruthy();
    expect(getByText("Housing")).toBeTruthy();
    expect(getByText("Monthly target: €500")).toBeTruthy();

    await unmount();
  });

  it("renders translated labels in French", async () => {
    await i18n.changeLanguage("fr");
    const french = await render(<StatisticsScreen />);

    expect(french.getByText("Statistiques")).toBeTruthy();
    expect(french.getByText("Évolution de l’EURIBOR")).toBeTruthy();
    expect(french.getByText("Logement")).toBeTruthy();
    expect(french.getByText("Objectif mensuel : 500 €")).toBeTruthy();

    await french.unmount();
  });

  it("renders translated labels in Spanish", async () => {
    await i18n.changeLanguage("es");
    const spanish = await render(<StatisticsScreen />);

    expect(spanish.getByText("Estadísticas")).toBeTruthy();
    expect(spanish.getByText("Tendencia del EURIBOR")).toBeTruthy();
    expect(spanish.getByText("Vivienda")).toBeTruthy();
    expect(spanish.getByText("Objetivo mensual: 500 €")).toBeTruthy();
  });
});
