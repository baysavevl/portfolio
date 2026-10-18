import {describe, expect, it} from "vitest";
import {buildPageMetadata} from "@/lib/seo/metadata";

describe("buildPageMetadata", () => {
  it("adds canonical and both language alternates for paired content", () => {
    const metadata = buildPageMetadata({
      title: "Clarity before velocity",
      description: "A field note about useful speed.",
      locale: "en",
      pathname: "/en/writing/clarity-before-velocity",
      translatedPathname: "/vi/writing/ro-rang-truoc-toc-do",
      baseUrl: "https://vincent.example"
    });

    expect(metadata.alternates).toEqual({
      canonical: "https://vincent.example/en/writing/clarity-before-velocity",
      languages: {
        en: "https://vincent.example/en/writing/clarity-before-velocity",
        vi: "https://vincent.example/vi/writing/ro-rang-truoc-toc-do"
      }
    });
  });

  it("does not invent an alternate for independently published content", () => {
    const metadata = buildPageMetadata({
      title: "Quiet leadership",
      description: "A field note about attention.",
      locale: "en",
      pathname: "/en/writing/quiet-leadership",
      baseUrl: "https://vincent.example"
    });

    expect(metadata.alternates).toEqual({
      canonical: "https://vincent.example/en/writing/quiet-leadership",
      languages: {
        en: "https://vincent.example/en/writing/quiet-leadership"
      }
    });
  });
});
