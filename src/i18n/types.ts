export const SUPPORTED_LOCALES = ["en", "fr", "es"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export type SupportedLanguage = {
  locale: Locale;
  name: string;
  nativeName: string;
};

export const SUPPORTED_LANGUAGES: readonly SupportedLanguage[] = [
  { locale: "en", name: "English", nativeName: "English" },
  { locale: "fr", name: "French", nativeName: "Français" },
  { locale: "es", name: "Spanish", nativeName: "Español" },
];

export function isSupportedLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" &&
    (SUPPORTED_LOCALES as readonly string[]).includes(value.toLowerCase())
  );
}

export function toSupportedLocale(value: unknown): Locale | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const languageCode = value.trim().toLowerCase().split(/[-_]/)[0];
  return isSupportedLocale(languageCode) ? languageCode : undefined;
}
