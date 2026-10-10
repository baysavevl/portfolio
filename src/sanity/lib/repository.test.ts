import {describe, expect, it, vi} from "vitest";

vi.mock("server-only", () => ({}));

import type {SanityQueryRunner} from "@/sanity/lib/fetch";
import {
  HOME_QUERY,
  POST_DETAIL_QUERY,
  POSTS_QUERY,
  RESUME_QUERY,
  SEARCH_QUERY,
  SETTINGS_QUERY,
  TRANSLATED_ROUTE_QUERY
} from "@/sanity/lib/queries";
import {createSanityContentRepository} from "@/sanity/lib/repository";
import type {RawPost} from "@/sanity/lib/raw-types";

const basePost: RawPost = {
  _id: "post-vi-independent",
  language: "vi",
  translationGroup: "post-vi-independent",
  slug: "ghi-chep-doc-lap",
  title: "Ghi chép độc lập",
  summary: "Bản tiếng Việt có thể xuất bản mà không cần bản tiếng Anh.",
  topics: ["leadership"],
  publishedAt: "2026-10-02T08:00:00.000Z",
  featured: false,
  isDemo: false,
  body: [
    {
      _key: "block-1",
      _type: "block",
      style: "normal",
      children: [
        {
          _key: "span-1",
          _type: "span",
          text: "Một quyết định rõ ràng giúp đội ngũ tiến về phía trước.",
          marks: []
        }
      ],
      markDefs: []
    }
  ],
  coverImage: null,
  seo: {
    title: "Ghi chép độc lập — Vincent Luu",
    description: "Một ghi chép tiếng Việt được xuất bản độc lập."
  }
};

function runnerReturning(
  resolve: (query: string, params: Record<string, unknown>) => unknown
) {
  return vi.fn(async (query: string, params: Record<string, unknown>) =>
    resolve(query, params)
  ) as unknown as SanityQueryRunner;
}

describe("createSanityContentRepository", () => {
  it("fails closed instead of leaking or hiding a mixed-locale list", async () => {
    const english = {
      ...basePost,
      _id: "post-en-independent",
      language: "en" as const,
      slug: "independent-note",
      title: "Independent note",
      summary: "An independently published English note."
    };
    const runQuery = runnerReturning((query) =>
      query === POSTS_QUERY ? [english, basePost] : null
    );
    const repository = createSanityContentRepository(runQuery);

    await expect(repository.listPosts("vi")).rejects.toThrow(
      "Invalid Sanity post post-en-independent"
    );
    expect(runQuery).toHaveBeenCalledWith(
      POSTS_QUERY,
      {locale: "vi"},
      ["post", "post:vi", "translation"]
    );
  });

  it("returns null instead of falling back when the requested locale is absent", async () => {
    const runQuery = runnerReturning((query) =>
      query === POST_DETAIL_QUERY ? null : null
    );
    const repository = createSanityContentRepository(runQuery);

    await expect(repository.getPost("vi", "shared-slug")).resolves.toBeNull();
    expect(runQuery).toHaveBeenCalledWith(
      POST_DETAIL_QUERY,
      {locale: "vi", slug: "shared-slug"},
      ["post", "post:vi", "translation"]
    );
  });

  it("rejects a wrong-locale detail returned in breach of the query contract", async () => {
    const english = {
      ...basePost,
      _id: "post-en-only",
      language: "en" as const,
      slug: "shared-slug",
      title: "English only",
      summary: "The Vietnamese document is absent or still a draft."
    };
    const runQuery = runnerReturning((query) =>
      query === POST_DETAIL_QUERY ? english : null
    );
    const repository = createSanityContentRepository(runQuery);

    await expect(repository.getPost("vi", "shared-slug")).rejects.toThrow(
      "Invalid Sanity post post-en-only"
    );
  });

  it("returns null when a translated target is not published", async () => {
    const runQuery = runnerReturning((query) =>
      query === TRANSLATED_ROUTE_QUERY ? null : null
    );
    const repository = createSanityContentRepository(runQuery);

    await expect(
      repository.getTranslatedRoute(
        "post",
        "translation.metadata.attention",
        "en"
      )
    ).resolves.toBeNull();
    expect(runQuery).toHaveBeenCalledWith(
      TRANSLATED_ROUTE_QUERY,
      {
        kind: "post",
        targetLocale: "en",
        translationGroup: "translation.metadata.attention"
      },
      ["post", "post:en", "translation"]
    );
  });

  it("rejects a translated target returned for the wrong locale", async () => {
    const runQuery = runnerReturning((query) =>
      query === TRANSLATED_ROUTE_QUERY
        ? {
            _id: "post-vi-attention",
            _type: "post",
            language: "vi",
            slug: "su-chu-tam-la-loi-the"
          }
        : null
    );
    const repository = createSanityContentRepository(runQuery);

    await expect(
      repository.getTranslatedRoute(
        "post",
        "translation.metadata.attention",
        "en"
      )
    ).rejects.toThrow("Invalid Sanity post post-vi-attention");
  });

  it("serves one Vietnamese document without translation metadata", async () => {
    const runQuery = runnerReturning((query) =>
      query === POST_DETAIL_QUERY ? basePost : null
    );
    const repository = createSanityContentRepository(runQuery);

    await expect(
      repository.getPost("vi", "ghi-chep-doc-lap")
    ).resolves.toMatchObject({
      id: "post-vi-independent",
      locale: "vi",
      translationGroup: "post-vi-independent"
    });
  });

  it("fails closed when a raw record does not pass domain validation", async () => {
    const runQuery = runnerReturning((query) =>
      query === POSTS_QUERY ? [{...basePost, topics: ["unknown"]}] : null
    );
    const repository = createSanityContentRepository(runQuery);

    await expect(repository.listPosts("vi")).rejects.toThrow(
      "Invalid Sanity post post-vi-independent"
    );
  });

  it("fails with a bounded error when a list result is malformed", async () => {
    const runQuery = runnerReturning((query) =>
      query === POSTS_QUERY ? null : null
    );
    const repository = createSanityContentRepository(runQuery);

    await expect(repository.listPosts("vi")).rejects.toThrow(
      "Invalid Sanity post unknown"
    );
  });

  it("attaches deterministic home, resume, and search tag sets", async () => {
    const resumeAsset = {
      _id: "resume-vi",
      language: "vi",
      summary: "Hồ sơ đã xác minh sẽ được cập nhật tại đây.",
      capabilities: [],
      pdfUrl: null,
      pdfLabel: null,
      effectiveDate: null
    };
    const runQuery = runnerReturning((query) => {
      if (query === HOME_QUERY) {
        return {
          settings: {
            _id: "settings-vi",
            language: "vi",
            footerNote: "Xây dựng với sự chú tâm.",
            socialLinks: [],
            contactLinks: [],
            seo: {title: "Vincent Luu", description: "The Mindful Builder"},
            featuredPost: null,
            featuredProjects: []
          },
          profile: {
            _id: "profile-vi",
            language: "vi",
            name: "Vincent Luu",
            descriptor: "The Mindful Builder",
            positioning: "Xây sản phẩm và đội ngũ tạo giá trị lâu dài.",
            introduction: "Ghi chép về kiến tạo và sự chú tâm.",
            heroInitialMode: "split",
            currentQuestions: [],
            principles: []
          },
          topics: [],
          posts: [],
          projects: [],
          resumeAsset,
          experience: [],
          education: []
        };
      }

      if (query === RESUME_QUERY) {
        return {resumeAsset, experience: [], education: []};
      }

      if (query === SEARCH_QUERY) {
        return {posts: [], projects: [], topics: []};
      }

      return null;
    });
    const repository = createSanityContentRepository(runQuery);

    await repository.getHome("vi");
    await repository.getResume("vi");
    await repository.listSearchEntries("vi");

    expect(runQuery).toHaveBeenNthCalledWith(
      1,
      HOME_QUERY,
      {locale: "vi"},
      [
        "siteSettings",
        "siteSettings:vi",
        "profile",
        "profile:vi",
        "topic",
        "topic:vi",
        "post",
        "post:vi",
        "translation",
        "project",
        "project:vi",
        "resumeAsset",
        "resumeAsset:vi",
        "experience",
        "experience:vi",
        "education",
        "education:vi"
      ]
    );
    expect(runQuery).toHaveBeenNthCalledWith(
      2,
      RESUME_QUERY,
      {locale: "vi"},
      [
        "resumeAsset",
        "resumeAsset:vi",
        "experience",
        "experience:vi",
        "education",
        "education:vi"
      ]
    );
    expect(runQuery).toHaveBeenNthCalledWith(
      3,
      SEARCH_QUERY,
      {locale: "vi"},
      ["post", "post:vi", "project", "project:vi", "topic", "topic:vi"]
    );
  });
});

describe("localized GROQ contracts", () => {
  it("constrains localized lists, details, and featured references", () => {
    expect(POSTS_QUERY).toContain("language == $locale");
    expect(POST_DETAIL_QUERY).toContain("slug.current == $slug");
    expect(POST_DETAIL_QUERY).toContain("language == $locale");
    expect(
      SETTINGS_QUERY.match(/language == \$locale/g)?.length
    ).toBeGreaterThanOrEqual(3);
  });

  it("targets a locale-specific published translation reference", () => {
    expect(TRANSLATED_ROUTE_QUERY).toContain(
      "language == $targetLocale"
    );
    expect(TRANSLATED_ROUTE_QUERY).toContain("_type == $kind");
  });
});
