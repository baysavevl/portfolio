import {describe, expect, it} from "vitest";
import {buildPersonJsonLd} from "@/lib/seo/structured-data";
import {demoContentRepository} from "@/lib/content/demo/repository";

describe("structured data", () => {
  it("identifies Vincent without manufacturing an employer", async () => {
    const profile = await demoContentRepository.getProfile("en");
    const person = buildPersonJsonLd({
      profile,
      siteUrl: "https://vincent.example"
    });
    const serialized = JSON.stringify(person);

    expect(person).toMatchObject({
      "@type": "Person",
      name: "Vincent Luu",
      url: "https://vincent.example/en/about"
    });
    expect(serialized).not.toMatch(/worksFor|employer|organization/i);
  });
});
