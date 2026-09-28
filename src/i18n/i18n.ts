import { createInstance, type i18n as I18nInstance } from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";

import { getDeviceLocale } from "./locale";
import { resources, SCREEN_NAMESPACES } from "./resources";
import { getPersistedLocale, type LocaleStorage } from "./storage";
import { DEFAULT_LOCALE, type Locale } from "./types";

export const i18n = createInstance().use(initReactI18next);

void i18n.init({
  compatibilityJSON: "v4",
  fallbackLng: DEFAULT_LOCALE,
  interpolation: { escapeValue: false },
  lng: DEFAULT_LOCALE,
  defaultNS: "translation",
  ns: ["translation", ...SCREEN_NAMESPACES],
  resources,
  returnNull: false,
});

export type LocaleBootstrapOptions = {
  storage?: LocaleStorage;
  deviceLocales?: readonly string[];
};

export async function resolveInitialLocale({
  storage,
  deviceLocales,
}: LocaleBootstrapOptions = {}): Promise<Locale> {
  const savedLocale = await getPersistedLocale(storage);
  return savedLocale ?? getDeviceLocale(deviceLocales);
}

export async function initializeI18n(
  options: LocaleBootstrapOptions = {},
): Promise<Locale> {
  const locale = await resolveInitialLocale(options);

  if (!i18n.isInitialized) {
    await i18n.init({
      compatibilityJSON: "v4",
      fallbackLng: DEFAULT_LOCALE,
      interpolation: { escapeValue: false },
      lng: locale,
      defaultNS: "translation",
      ns: ["translation", ...SCREEN_NAMESPACES],
      resources,
      returnNull: false,
    });
  } else if (i18n.language !== locale) {
    await i18n.changeLanguage(locale);
  }

  return locale;
}

export function getI18nInstance(): I18nInstance {
  return i18n;
}

export function useAppTranslation(namespace: string) {
  const { t } = useTranslation(namespace);
  return { t };
}
