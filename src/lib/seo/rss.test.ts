import {describe, expect, expectTypeOf, it} from "vitest";
import {demoContentRepository} from "@/lib/content/demo/repository";
import {buildRssXml} from "@/lib/seo/rss";
import type {PostSummary} from "@/lib/content/types";

describe("buildRssXml", () => {
  it("escapes XML and emits only the requested locale in newest-first order", async () => {
    const [english, vietnamese] = await Promise.all([
      demoContentRepository.listPosts("en"),
      demoContentRepository.listPosts("vi")
    ]);
    const posts: PostSummary[] = [
      {...english[1]!, title: "Training & recovery"},
      english[0]!,
      vietnamese[0]!
    ];

    const xml = buildRssXml({
      locale: "en",
      siteUrl: "https://vincent.example",
      title: "Vincent & Field Notes",
      description: "Building < thoughtfully",
      posts
    });

    expect(xml).toContain("Vincent &amp; Field Notes");
    expect(xml).toContain("Building &lt; thoughtfully");
    expect(xml).toContain("Training &amp; recovery");
    expect(xml).not.toContain(vietnamese[0]!.title);
    expect(xml.indexOf(english[0]!.title)).toBeLessThan(
      xml.indexOf("Training &amp; recovery")
    );
  });

  it("accepts only the public PostSummary contract", () => {
    type RssPost = Parameters<typeof buildRssXml>[0]["posts"][number];
    expectTypeOf<RssPost>().toEqualTypeOf<PostSummary>();
  });
});
