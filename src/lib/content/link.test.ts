import {describe, expect, it} from "vitest";

import {isSafeHref} from "@/lib/content/link";
import {
  richTextBlockSchema,
  siteSettingsSchema
} from "@/lib/content/schemas";

const validSettings = {
  locale: "en",
  footerNote: "Build with attention.",
  socialLinks: [],
  contactLinks: [],
  seo: {
    title: "Vincent Luu",
    description: "The Mindful Builder"
  }
};

describe("safe content links", () => {
  it.each([
    "https://vincentluu.com",
    "mailto:hello@vincentluu.com",
    "/en/writing"
  ])("accepts %s consistently", (href) => {
    expect(isSafeHref(href)).toBe(true);
    expect(
      siteSettingsSchema.safeParse({
        ...validSettings,
        contactLinks: [{label: "Contact", href}]
      }).success
    ).toBe(true);
  });

  it.each([
    "javascript:alert(1)",
    "data:text/html,unsafe",
    "ftp://files.example",
    "//malicious.example",
    "/\\malicious.example",
    "\\malicious.example",
    "https://user:password@example.com",
    " writing/relative",
    ""
  ])("rejects %s at the shared boundary", (href) => {
    expect(isSafeHref(href)).toBe(false);
    expect(
      siteSettingsSchema.safeParse({
        ...validSettings,
        contactLinks: [{label: "Contact", href}]
      }).success
    ).toBe(false);
  });

  it("rejects unsafe Portable Text marks at domain parsing", () => {
    expect(
      richTextBlockSchema.safeParse({
        _key: "block",
        _type: "block",
        style: "normal",
        children: [
          {
            _key: "span",
            _type: "span",
            text: "Unsafe",
            marks: ["unsafe"]
          }
        ],
        markDefs: [
          {
            _key: "unsafe",
            _type: "link",
            href: "/\\malicious.example"
          }
        ]
      }).success
    ).toBe(false);
  });
});
