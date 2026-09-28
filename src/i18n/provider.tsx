import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { I18nextProvider } from "react-i18next";

import { i18n, initializeI18n, type LocaleBootstrapOptions } from "./i18n";
import { setPersistedLocale, type LocaleStorage } from "./storage";
import { toSupportedLocale, type Locale } from "./types";

type LocalizationContextValue = {
  locale: Locale;
  ready: boolean;
  setLocale: (locale: Locale) => Promise<boolean>;
};

const LocalizationContext = createContext<LocalizationContextValue | null>(
  null,
);

export type LocalizationProviderProps = PropsWithChildren<
  LocaleBootstrapOptions & {
    onReady?: () => void;
    storage?: LocaleStorage;
  }
>;

export function LocalizationProvider({
  children,
  deviceLocales,
  onReady,
  storage,
}: LocalizationProviderProps) {
  const [localeState, setLocaleState] = useState<Locale>(() => {
    return i18n.language === "fr" || i18n.language === "es"
      ? i18n.language
      : "en";
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const handleLanguageChanged = (nextLocale: string) => {
      if (mountedLocaleIsSupported(nextLocale)) {
        setLocaleState(nextLocale);
      }
    };

    i18n.on("languageChanged", handleLanguageChanged);
    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    void initializeI18n({ deviceLocales, storage }).then((initialLocale) => {
      if (mounted) {
        setLocaleState(initialLocale);
        setReady(true);
        onReady?.();
      }
    });

    return () => {
      mounted = false;
    };
  }, [deviceLocales, onReady, storage]);

  const setLocale = useCallback(
    async (nextLocale: Locale) => {
      await i18n.changeLanguage(nextLocale);
      if (mountedLocaleIsSupported(nextLocale)) {
        setLocaleState(nextLocale);
      }
      return setPersistedLocale(nextLocale, storage);
    },
    [storage],
  );

  const contextValue = useMemo(
    () => ({ locale: localeState, ready, setLocale }),
    [localeState, ready, setLocale],
  );

  if (!ready) {
    return null;
  }

  return (
    <LocalizationContext.Provider value={contextValue}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </LocalizationContext.Provider>
  );
}

function mountedLocaleIsSupported(locale: string): locale is Locale {
  return locale === "en" || locale === "fr" || locale === "es";
}

export function useLocalization(): LocalizationContextValue {
  const context = useContext(LocalizationContext);
  const [fallbackLocale, setFallbackLocale] = useState<Locale>(
    toSupportedLocale(i18n.language) ?? "en",
  );
  const fallbackSetLocale = useCallback(async (nextLocale: Locale) => {
    await i18n.changeLanguage(nextLocale);
    setFallbackLocale(nextLocale);
    return setPersistedLocale(nextLocale);
  }, []);

  return (
    context ?? {
      locale: fallbackLocale,
      ready: true,
      setLocale: fallbackSetLocale,
    }
  );
}

export const useLocale = useLocalization;
export const I18nProvider = LocalizationProvider;
