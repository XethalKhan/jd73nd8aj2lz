import { SCREEN_NAMESPACES, screenResources } from "./resources";
import { SUPPORTED_LOCALES } from "./types";

describe("translation resources", () => {
  it("contains the same screen files and key inventory in every locale", () => {
    const inventories = SUPPORTED_LOCALES.map((locale) =>
      SCREEN_NAMESPACES.map((screen) => {
        return Object.keys(screenResources[locale][screen]).sort();
      }),
    );

    expect(inventories[1]).toEqual(inventories[0]);
    expect(inventories[2]).toEqual(inventories[0]);
  });
});
