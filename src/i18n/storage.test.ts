import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import {
  browserStorageAdapter,
  createLocaleStorage,
  getPersistedLocale,
  LOCALE_STORAGE_KEY,
  secureStoreAdapter,
  setPersistedLocale,
  type LocaleStorage,
} from "./storage";

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
}));

class NonErrorFailure {
  constructor(private readonly message: string) {}

  toString() {
    return this.message;
  }
}

function memoryStorage(value: string | null): LocaleStorage & {
  saved: string | null;
} {
  return {
    saved: value,
    getItem() {
      return Promise.resolve(this.saved);
    },
    setItem(_key, nextValue) {
      this.saved = nextValue;
      return Promise.resolve();
    },
  };
}

describe("locale storage", () => {
  const originalPlatformOS = Platform.OS;

  afterEach(() => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      value: originalPlatformOS,
    });
    jest.restoreAllMocks();
  });

  it("reads supported locale values and normalizes locale tags", async () => {
    expect(await getPersistedLocale(memoryStorage("fr-FR"))).toBe("fr");
    expect(
      await getPersistedLocale(memoryStorage("unsupported")),
    ).toBeUndefined();
  });

  it("returns no locale when storage is missing or fails", async () => {
    expect(await getPersistedLocale(memoryStorage(null))).toBeUndefined();
    const failingStorage: LocaleStorage = {
      getItem: () => Promise.reject(new Error("storage unavailable")),
      setItem: () => Promise.reject(new Error("storage unavailable")),
    };

    expect(await getPersistedLocale(failingStorage)).toBeUndefined();
    await expect(setPersistedLocale("fr", failingStorage)).resolves.toBe(false);
  });

  it("persists only supported locales under the namespaced key", async () => {
    const storage = memoryStorage(null);
    await expect(setPersistedLocale("es", storage)).resolves.toBe(true);
    expect(storage.saved).toBe("es");
    expect(LOCALE_STORAGE_KEY).toBe("cbsdemo.locale");
  });

  it("rejects unsupported locales before writing", async () => {
    const setItem = jest.fn();
    const storage: LocaleStorage = {
      getItem: jest.fn(),
      setItem,
    };

    await expect(
      setPersistedLocale("unsupported" as "en", storage),
    ).resolves.toBe(false);
    expect(setItem).not.toHaveBeenCalled();
  });

  it("uses the native SecureStore adapter by default", async () => {
    const getItemAsync = jest.mocked(SecureStore.getItemAsync);
    const setItemAsync = jest.mocked(SecureStore.setItemAsync);
    getItemAsync.mockResolvedValue("fr");
    setItemAsync.mockResolvedValue(undefined);

    Object.defineProperty(Platform, "OS", {
      configurable: true,
      value: "ios",
    });

    expect(createLocaleStorage()).toBe(secureStoreAdapter);
    await expect(getPersistedLocale()).resolves.toBe("fr");
    await expect(setPersistedLocale("es")).resolves.toBe(true);
    expect(getItemAsync).toHaveBeenCalledWith(LOCALE_STORAGE_KEY);
    expect(setItemAsync).toHaveBeenCalledWith(LOCALE_STORAGE_KEY, "es");
  });

  it("uses browser storage on web", async () => {
    const localStorage = {
      getItem: jest.fn(() => "fr-FR"),
      setItem: jest.fn(),
    };
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      value: "web",
    });
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: localStorage,
    });

    expect(createLocaleStorage()).toBe(browserStorageAdapter);
    await expect(getPersistedLocale()).resolves.toBe("fr");
    await expect(setPersistedLocale("es")).resolves.toBe(true);
    expect(localStorage.getItem).toHaveBeenCalledWith(LOCALE_STORAGE_KEY);
    expect(localStorage.setItem).toHaveBeenCalledWith(LOCALE_STORAGE_KEY, "es");
  });

  it("returns null when browser storage is unavailable", async () => {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      get() {
        throw new Error("localStorage unavailable");
      },
    });

    await expect(
      browserStorageAdapter.getItem(LOCALE_STORAGE_KEY),
    ).resolves.toBe(null);
  });

  it("rejects browser reads that throw", async () => {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: () => {
          throw new Error("read failed");
        },
      },
    });

    await expect(
      browserStorageAdapter.getItem(LOCALE_STORAGE_KEY),
    ).rejects.toThrow("read failed");
  });

  it("converts non-Error browser read failures to errors", async () => {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: () => {
          // Exercise the adapter's non-Error normalization branch.
          // eslint-disable-next-line @typescript-eslint/only-throw-error
          throw new NonErrorFailure("read failed");
        },
      },
    });

    await expect(
      browserStorageAdapter.getItem(LOCALE_STORAGE_KEY),
    ).rejects.toThrow("read failed");
  });

  it("rejects browser writes when storage is unavailable", async () => {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: undefined,
    });

    await expect(
      browserStorageAdapter.setItem(LOCALE_STORAGE_KEY, "fr"),
    ).rejects.toThrow("Browser storage is unavailable");
  });

  it("rejects browser writes that throw", async () => {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        setItem: () => {
          throw new Error("write failed");
        },
      },
    });

    await expect(
      browserStorageAdapter.setItem(LOCALE_STORAGE_KEY, "fr"),
    ).rejects.toThrow("write failed");
  });

  it("converts non-Error browser write failures to errors", async () => {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        setItem: () => {
          // Exercise the adapter's non-Error normalization branch.
          // eslint-disable-next-line @typescript-eslint/only-throw-error
          throw new NonErrorFailure("write failed");
        },
      },
    });

    await expect(
      browserStorageAdapter.setItem(LOCALE_STORAGE_KEY, "fr"),
    ).rejects.toThrow("write failed");
  });
});
