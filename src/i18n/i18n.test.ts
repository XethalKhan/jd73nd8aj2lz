import { i18n, initializeI18n, resolveInitialLocale } from "./i18n";
import type { LocaleStorage } from "./storage";

function storageWith(value: string | null): LocaleStorage {
  return {
    getItem: () => Promise.resolve(value),
    setItem: () => Promise.resolve(),
  };
}

describe("localization bootstrap", () => {
  it("uses a saved supported locale before the device locale", async () => {
    await expect(
      resolveInitialLocale({
        deviceLocales: ["es-MX"],
        storage: storageWith("fr"),
      }),
    ).resolves.toBe("fr");
  });

  it("uses the supported device locale when no preference is saved", async () => {
    await expect(
      resolveInitialLocale({
        deviceLocales: ["de-DE", "es-ES"],
        storage: storageWith(null),
      }),
    ).resolves.toBe("es");
  });

  it("falls back to English for unavailable device locales", async () => {
    await expect(
      resolveInitialLocale({
        deviceLocales: ["de-DE"],
        storage: storageWith(null),
      }),
    ).resolves.toBe("en");
  });

  it("initializes translations with English fallback", async () => {
    await initializeI18n({
      deviceLocales: ["fr-FR"],
      storage: storageWith(null),
    });

    expect(i18n.language).toBe("fr");
    expect(i18n.t("welcome.title")).toBe(
      "Tout ce dont vous avez besoin pour gérer votre argent",
    );
    i18n.addResource(
      "en",
      "translation",
      "fallbackOnly",
      "English fallback",
    );
    expect(i18n.t("fallbackOnly", { lng: "fr" })).toBe("English fallback");
  });
});
