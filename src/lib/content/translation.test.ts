import {describe, expect, it} from "vitest";
import {resolveLocaleSwitch} from "@/lib/content/translation";

describe("resolveLocaleSwitch", () => {
  it("uses an exact translated counterpart when one is published", () => {
    expect(
      resolveLocaleSwitch({
        currentLocale: "en",
        section: "writing",
        topics: ["leadership"],
        translatedRoute: {
          locale: "vi",
          href: "/vi/writing/ro-rang-truoc-toc-do"
        }
      })
    ).toEqual({
      currentLocale: "en",
      targetLocale: "vi",
      targetHref: "/vi/writing/ro-rang-truoc-toc-do",
      missingTranslation: false
    });
  });

  it("falls back to the translated collection with topic context", () => {
    expect(
      resolveLocaleSwitch({
        currentLocale: "en",
        section: "writing",
        topics: ["leadership", "mindfulness"],
        translatedRoute: null
      })
    ).toEqual({
      currentLocale: "en",
      targetLocale: "vi",
      targetHref:
        "/vi/writing?translation=unavailable&topic=leadership",
      missingTranslation: true
    });
  });

  it("keeps stable sections aligned across locales", () => {
    expect(
      resolveLocaleSwitch({currentLocale: "vi", section: "about"})
    ).toEqual({
      currentLocale: "vi",
      targetLocale: "en",
      targetHref: "/en/about",
      missingTranslation: false
    });
  });
});
