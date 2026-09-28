import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import { Text, Pressable } from "react-native";
import type { ReactNode } from "react";

import {
  i18n,
  initializeI18n,
} from "./i18n";
import {
  LocalizationProvider,
  useLocalization,
} from "./provider";
import { setPersistedLocale } from "./storage";

jest.mock("react-i18next", () => ({
  I18nextProvider: ({ children }: { children: ReactNode }) => children,
}));

jest.mock("./i18n", () => {
  const mockListeners = new Set<(mockLocale: string) => void>();
  const mockI18n = {
    language: "en",
    on: jest.fn(),
    off: jest.fn(),
    changeLanguage: jest.fn(),
  };

  mockI18n.on.mockImplementation(
    (mockEvent: string, mockListener: (mockLocale: string) => void) => {
      if (mockEvent === "languageChanged") {
        mockListeners.add(mockListener);
      }
      return mockI18n;
    },
  );
  mockI18n.off.mockImplementation(
    (mockEvent: string, mockListener: (mockLocale: string) => void) => {
      if (mockEvent === "languageChanged") {
        mockListeners.delete(mockListener);
      }
      return mockI18n;
    },
  );
  mockI18n.changeLanguage.mockImplementation((mockLocale: string) => {
    mockI18n.language = mockLocale;
    for (const mockListener of mockListeners) {
      mockListener(mockLocale);
    }
    return Promise.resolve();
  });

  return {
    i18n: mockI18n,
    initializeI18n: jest.fn(),
  };
});

jest.mock("./storage", () => ({
  setPersistedLocale: jest.fn(),
}));

function LocalizationConsumer() {
  const { locale, ready, setLocale } = useLocalization();

  return (
    <>
      <Text testID="locale">{locale}</Text>
      <Text testID="ready">{String(ready)}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Set French"
        onPress={() => void setLocale("fr")}
      />
    </>
  );
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((promiseResolve) => {
    resolve = promiseResolve;
  });

  return { promise, resolve };
}

describe("LocalizationProvider", () => {
  const storage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (i18n as { language: string }).language = "en";
    jest.mocked(initializeI18n).mockResolvedValue("en");
    jest.mocked(setPersistedLocale).mockResolvedValue(true);
  });

  it("holds children until initialization completes and calls onReady", async () => {
    const initialization = deferred<"fr">();
    jest.mocked(initializeI18n).mockReturnValue(initialization.promise);
    const onReady = jest.fn();

    const { queryByTestId, getByTestId } = await render(
      <LocalizationProvider
        deviceLocales={["fr-FR"]}
        onReady={onReady}
        storage={storage}
      >
        <LocalizationConsumer />
      </LocalizationProvider>,
    );

    expect(queryByTestId("locale")).toBeNull();

    await act(async () => {
      initialization.resolve("fr");
      await initialization.promise;
    });

    expect(getByTestId("locale")).toHaveTextContent("fr");
    expect(getByTestId("ready")).toHaveTextContent("true");
    expect(onReady).toHaveBeenCalledTimes(1);
    expect(initializeI18n).toHaveBeenCalledWith({
      deviceLocales: ["fr-FR"],
      storage,
    });
  });

  it("accepts a supported current language before initialization", async () => {
    (i18n as { language: string }).language = "fr";

    const { getByTestId } = await render(
      <LocalizationProvider>
        <LocalizationConsumer />
      </LocalizationProvider>,
    );

    await waitFor(() => {
      expect(getByTestId("ready")).toHaveTextContent("true");
    });
  });

  it("updates its locale for supported language-change events", async () => {
    const { getByTestId } = await render(
      <LocalizationProvider>
        <LocalizationConsumer />
      </LocalizationProvider>,
    );

    await waitFor(() => {
      expect(getByTestId("ready")).toHaveTextContent("true");
    });

    await act(async () => {
      await i18n.changeLanguage("es");
    });

    expect(getByTestId("locale")).toHaveTextContent("es");

    await act(async () => {
      await i18n.changeLanguage("unsupported");
    });

    expect(getByTestId("locale")).toHaveTextContent("es");
  });

  it("removes its language-change listener when unmounted", async () => {
    const { unmount } = await render(
      <LocalizationProvider>
        <LocalizationConsumer />
      </LocalizationProvider>,
    );

    await unmount();

    const mockOff = (
      i18n as unknown as { off: jest.Mock }
    ).off;
    expect(mockOff).toHaveBeenCalledWith(
      "languageChanged",
      expect.any(Function),
    );
  });

  it("changes and persists the locale through the provider context", async () => {
    const { getByLabelText, getByTestId } = await render(
      <LocalizationProvider storage={storage}>
        <LocalizationConsumer />
      </LocalizationProvider>,
    );

    await waitFor(() => {
      expect(getByTestId("ready")).toHaveTextContent("true");
    });

    await fireEvent.press(getByLabelText("Set French"));

    const mockChangeLanguage = (
      i18n as unknown as { changeLanguage: jest.Mock }
    ).changeLanguage;
    const mockSetPersistedLocale = (
      setPersistedLocale as unknown as jest.Mock
    );
    expect(mockChangeLanguage).toHaveBeenCalledWith("fr");
    expect(mockSetPersistedLocale).toHaveBeenCalledWith("fr", storage);
    expect(getByTestId("locale")).toHaveTextContent("fr");
  });

  it("does not update state when initialization resolves after unmount", async () => {
    const initialization = deferred<"fr">();
    jest.mocked(initializeI18n).mockReturnValue(initialization.promise);
    const onReady = jest.fn();
    const { unmount } = await render(
      <LocalizationProvider onReady={onReady}>
        <LocalizationConsumer />
      </LocalizationProvider>,
    );

    await unmount();

    await act(async () => {
      initialization.resolve("fr");
      await initialization.promise;
    });

    expect(onReady).not.toHaveBeenCalled();
  });
});

describe("useLocalization outside LocalizationProvider", () => {
  it("provides a fallback locale and can persist locale changes", async () => {
    (i18n as { language: string }).language = "es";

    const { getByLabelText, getByTestId } = await render(
      <LocalizationConsumer />,
    );

    expect(getByTestId("locale")).toHaveTextContent("es");
    expect(getByTestId("ready")).toHaveTextContent("true");

    await fireEvent.press(getByLabelText("Set French"));

    const mockChangeLanguage = (
      i18n as unknown as { changeLanguage: jest.Mock }
    ).changeLanguage;
    const mockSetPersistedLocale = (
      setPersistedLocale as unknown as jest.Mock
    );
    expect(mockChangeLanguage).toHaveBeenCalledWith("fr");
    expect(mockSetPersistedLocale).toHaveBeenCalledWith("fr");
    expect(getByTestId("locale")).toHaveTextContent("fr");
  });

  it("falls back to English when the current language is unsupported", async () => {
    (i18n as { language: string }).language = "unsupported";

    const { getByTestId } = await render(<LocalizationConsumer />);

    expect(getByTestId("locale")).toHaveTextContent("en");
  });
});
