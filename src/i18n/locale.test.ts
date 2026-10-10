import {describe, expect, it} from "vitest";
import {getLocalePath, localeFromCookie} from "@/i18n/locale";

describe("locale navigation", () => {
  it("falls back to English for an invalid cookie", () => {
    expect(localeFromCookie("fr")).toBe("en");
    expect(localeFromCookie(undefined)).toBe("en");
  });

  it("builds locale-prefixed routes", () => {
    expect(getLocalePath("vi", "writing", "ro-rang")).toBe(
      "/vi/writing/ro-rang"
    );
    expect(getLocalePath("en", "home")).toBe("/en");
  });
});
