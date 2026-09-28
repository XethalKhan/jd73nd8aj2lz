import { getLocales } from "expo-localization";

import {
  DEFAULT_LOCALE,
  type Locale,
  toSupportedLocale,
} from "./types";

export { DEFAULT_LOCALE, type Locale, toSupportedLocale };

export function getDeviceLocale(locales?: readonly string[]): Locale {
  let availableLocales: readonly string[];

  try {
    availableLocales =
      locales ??
      getLocales().map(
        ({ languageCode, languageTag }) => languageCode ?? languageTag,
      );
  } catch {
    return DEFAULT_LOCALE;
  }

  for (const locale of availableLocales) {
    const supportedLocale = toSupportedLocale(locale);
    if (supportedLocale) {
      return supportedLocale;
    }
  }

  return DEFAULT_LOCALE;
}
