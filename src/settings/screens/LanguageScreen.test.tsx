import { fireEvent, render } from "@testing-library/react-native";
import { useRouter } from "expo-router";

import { i18n } from "../../i18n";
import { SettingsScreen } from "./SettingsScreen";
import { LanguageScreen } from "./LanguageScreen";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("LanguageScreen", () => {
  const back = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ back });
    await i18n.changeLanguage("en");
  });

  it("renders exactly the supported language options", async () => {
    const { getAllByRole, getByPlaceholderText, getByTestId, getByText } =
      await render(<LanguageScreen />);

    expect(getByText("Language")).toBeTruthy();
    expect(getByPlaceholderText("Search Language")).toBeTruthy();
    expect(getAllByRole("radio")).toHaveLength(3);
    expect(getByTestId("language-selected-en").props.children).toBeTruthy();
    expect(getByTestId("language-selected-fr")).toHaveProp("children", null);
    expect(getByTestId("language-selected-es")).toHaveProp("children", null);
  });

  it("navigates back and changes the active language", async () => {
    const { getByTestId } = await render(<LanguageScreen />);

    await fireEvent.press(getByTestId("language-back"));
    expect(back).toHaveBeenCalledTimes(1);

    await fireEvent.press(getByTestId("language-option-fr"));

    expect(i18n.language).toBe("fr");
    expect(getByTestId("language-option-fr").props.accessibilityState).toEqual({
      selected: true,
    });
  });

  it("updates mounted Settings copy for French and Spanish", async () => {
    const { getByTestId, getByText } = await render(
      <>
        <LanguageScreen />
        <SettingsScreen />
      </>,
    );

    await fireEvent.press(getByTestId("language-option-fr"));
    expect(getByText("Paramètres")).toBeTruthy();

    await fireEvent.press(getByTestId("language-option-es"));
    expect(getByText("Configuración")).toBeTruthy();
  });
});
