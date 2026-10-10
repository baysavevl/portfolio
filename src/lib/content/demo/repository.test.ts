import {describe, expect, it} from "vitest";
import {demoContentRepository} from "@/lib/content/demo/repository";

describe("demoContentRepository", () => {
  it("returns only the requested locale", async () => {
    const posts = await demoContentRepository.listPosts("vi");

    expect(posts.length).toBeGreaterThanOrEqual(3);
    expect(posts.every((post) => post.locale === "vi")).toBe(true);
  });

  it("links translated entries by translation group", async () => {
    const post = await demoContentRepository.getPost(
      "en",
      "clarity-before-velocity"
    );

    expect(post?.translationGroup).toBe("clarity-before-velocity");

    const target = await demoContentRepository.getTranslatedRoute(
      "post",
      "clarity-before-velocity",
      "vi"
    );

    expect(target).toEqual({
      locale: "vi",
      href: "/vi/writing/ro-rang-truoc-toc-do"
    });
  });

  it("returns null when a translation is intentionally absent", async () => {
    const target = await demoContentRepository.getTranslatedRoute(
      "post",
      "quiet-leadership",
      "vi"
    );

    expect(target).toBeNull();
  });

  it("marks illustrative records as demonstration content", async () => {
    const posts = await demoContentRepository.listPosts("en");
    const projects = await demoContentRepository.listProjects("en");

    expect([...posts, ...projects].every((entry) => entry.isDemo)).toBe(true);
  });
});
