import {describe, expect, it} from "vitest";
import {defaultLocale, isLocale, locales} from "@/i18n/locale";

describe("locale contract", () => {
  it("supports English and Vietnamese with English as default", () => {
    expect(locales).toEqual(["en", "vi"]);
    expect(defaultLocale).toBe("en");
  });

  it.each([
    ["en", true],
    ["vi", true],
    ["fr", false],
    ["", false],
    [undefined, false]
  ])("validates %s", (value, expected) => {
    expect(isLocale(value)).toBe(expected);
  });
});
