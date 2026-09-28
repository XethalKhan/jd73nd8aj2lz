import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { type Locale, toSupportedLocale } from "./types";

export const LOCALE_STORAGE_KEY = "cbsdemo.locale";

export interface LocaleStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}

const secureStoreAdapter: LocaleStorage = {
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
};

function getBrowserStorage(): Storage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

const browserStorageAdapter: LocaleStorage = {
  getItem(key) {
    try {
      const storage = getBrowserStorage();
      return Promise.resolve(storage?.getItem(key) ?? null);
    } catch (error) {
      return Promise.reject(
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  },
  setItem(key, value) {
    try {
      const storage = getBrowserStorage();
      if (!storage) {
        throw new Error("Browser storage is unavailable");
      }
      storage.setItem(key, value);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  },
};

export function createLocaleStorage(): LocaleStorage {
  return Platform.OS === "web" ? browserStorageAdapter : secureStoreAdapter;
}

export async function getPersistedLocale(
  storage: LocaleStorage = createLocaleStorage(),
): Promise<Locale | undefined> {
  try {
    const value = await storage.getItem(LOCALE_STORAGE_KEY);
    return toSupportedLocale(value);
  } catch {
    return undefined;
  }
}

export async function setPersistedLocale(
  locale: Locale,
  storage: LocaleStorage = createLocaleStorage(),
): Promise<boolean> {
  if (!toSupportedLocale(locale)) {
    return false;
  }

  try {
    await storage.setItem(LOCALE_STORAGE_KEY, locale);
    return true;
  } catch {
    return false;
  }
}

export { browserStorageAdapter, secureStoreAdapter };
