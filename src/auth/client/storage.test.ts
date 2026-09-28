import {
  ACCESS_TOKEN_STORAGE_KEY,
  createAuthStorage,
  REFRESH_TOKEN_STORAGE_KEY,
} from "./storage";

describe("auth storage", () => {
  it("uses browser storage on web", async () => {
    const values = new Map<string, string>();
    const browserStorage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => void values.set(key, value),
      removeItem: (key: string) => void values.delete(key),
    };
    const storage = createAuthStorage({ platform: "web", browserStorage });

    await storage.set(ACCESS_TOKEN_STORAGE_KEY, "access");
    await storage.set(REFRESH_TOKEN_STORAGE_KEY, "refresh");
    await expect(storage.get(ACCESS_TOKEN_STORAGE_KEY)).resolves.toBe("access");
    await storage.delete(ACCESS_TOKEN_STORAGE_KEY);
    await expect(storage.get(ACCESS_TOKEN_STORAGE_KEY)).resolves.toBeNull();
  });

  it("uses Secure Store on native and handles unavailable storage", async () => {
    const secureStore = {
      getItemAsync: jest.fn(async () => null),
      setItemAsync: jest.fn(async () => undefined),
      deleteItemAsync: jest.fn(async () => undefined),
      isAvailableAsync: jest.fn(async () => true),
    };
    const storage = createAuthStorage({ platform: "native", secureStore });
    await storage.set("key", "value");
    await storage.get("key");
    await storage.delete("key");
    expect(secureStore.setItemAsync).toHaveBeenCalledWith("key", "value");

    secureStore.isAvailableAsync.mockResolvedValue(false);
    await expect(storage.get("key")).rejects.toMatchObject({
      code: "UNAVAILABLE",
    });
  });

  it("normalizes browser storage failures", async () => {
    const storage = createAuthStorage({
      platform: "web",
      browserStorage: {
        getItem: () => {
          throw new Error("quota");
        },
        setItem: () => undefined,
        removeItem: () => undefined,
      },
    });
    await expect(storage.get("key")).rejects.toMatchObject({
      name: "AuthStorageError",
      code: "FAILED",
      operation: "get",
    });
    await expect(
      createAuthStorage({ platform: "web" }).get("key"),
    ).rejects.toMatchObject({ code: "UNAVAILABLE" });
  });
});
