import {describe, expect, it} from "vitest";

import {
  mapHomeData,
  mapPost,
  mapPostSummary,
  mapResume,
  mapSearchEntries,
  mapTranslatedRoute
} from "@/sanity/lib/mapper";
import type {RawPost} from "@/sanity/lib/raw-types";

const vietnamesePost: RawPost = {
  _id: "post-vi-attention",
  language: "vi",
  translationGroup: "translation.metadata.attention",
  slug: "su-chu-tam-la-loi-the",
  title: "Sự chú tâm là lợi thế",
  summary: "Một ghi chép về cách giữ sự rõ ràng khi xây sản phẩm.",
  topics: ["mindfulness", "product"],
  publishedAt: "2026-10-01T08:00:00.000Z",
  featured: true,
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
          text: "Sự chú tâm giúp đội ngũ nhìn thấy quyết định quan trọng.",
          marks: []
        }
      ],
      markDefs: []
    }
  ],
  coverImage: null,
  seo: {
    title: "Sự chú tâm là lợi thế — Vincent Luu",
    description: "Ghi chép về chánh niệm và quyết định sản phẩm."
  }
};

describe("Sanity content mapper", () => {
  it("maps and validates a complete Vietnamese post", () => {
    expect(mapPost(vietnamesePost)).toMatchObject({
      id: "post-vi-attention",
      locale: "vi",
      translationGroup: "translation.metadata.attention",
      slug: "su-chu-tam-la-loi-the",
      topics: ["mindfulness", "product"],
      readingMinutes: 1,
      isDemo: false
    });
  });

  it("accepts projected Sanity image metadata without leaking it into the current domain", () => {
    const mapped = mapPost({
      ...vietnamesePost,
      coverImage: {
        alt: "Một người đang ghi chú cạnh cửa sổ",
        caption: "Khoảng dừng trước một quyết định.",
        asset: {
          _id: "image-example-1200x800-jpg",
          url: "https://cdn.sanity.io/images/project/development/example.jpg",
          metadata: {
            dimensions: {width: 1200, height: 800, aspectRatio: 1.5},
            lqip: "data:image/jpeg;base64,preview"
          }
        }
      }
    });

    expect(mapped.id).toBe(vietnamesePost._id);
    expect(mapped).not.toHaveProperty("coverImage");
  });

  it("uses the document id as the translation group for an unpaired English post", () => {
    const raw = {
      ...vietnamesePost,
      _id: "post-en-independent",
      language: "en" as const,
      translationGroup: "post-en-independent",
      slug: "an-independent-note",
      title: "An independent note",
      summary: "A note that can publish without a Vietnamese counterpart."
    };

    expect(mapPostSummary(raw).translationGroup).toBe("post-en-independent");
  });

  it("preserves a shared metadata id for a translated pair", () => {
    const english = {
      ...vietnamesePost,
      _id: "post-en-attention",
      language: "en" as const,
      slug: "attention-is-an-advantage",
      title: "Attention is an advantage",
      summary: "A field note about attention and product decisions."
    };

    expect(mapPostSummary(english).translationGroup).toBe(
      mapPostSummary(vietnamesePost).translationGroup
    );
  });

  it("rejects an unknown topic without exposing the raw record", () => {
    expect(() =>
      mapPost({...vietnamesePost, topics: ["not-a-topic"]})
    ).toThrow("Invalid Sanity post post-vi-attention");
  });

  it("rejects malformed Portable Text", () => {
    expect(() =>
      mapPost({
        ...vietnamesePost,
        body: [
          {
            _key: "bad-block",
            _type: "block",
            style: "h1",
            children: [],
            markDefs: []
          }
        ]
      })
    ).toThrow("Invalid Sanity post post-vi-attention");
  });

  it("maps a published translated route and preserves an absent target", () => {
    expect(
      mapTranslatedRoute(
        {
          _id: "post-en-attention",
          language: "en",
          slug: "attention-is-an-advantage"
        },
        "post"
      )
    ).toEqual({
      locale: "en",
      href: "/en/writing/attention-is-an-advantage"
    });
    expect(mapTranslatedRoute(null, "post")).toBeNull();
  });

  it("fails with bounded errors for malformed aggregate results", () => {
    expect(() => mapHomeData(null, "vi")).toThrow(
      "Invalid Sanity home vi"
    );
    expect(() => mapSearchEntries(null, "vi")).toThrow(
      "Invalid Sanity search vi"
    );
  });

  it("fails closed when aggregate or résumé queries return another locale", () => {
    const englishPost = {
      ...vietnamesePost,
      _id: "post-en-attention",
      language: "en",
      slug: "attention-is-an-advantage",
      title: "Attention is an advantage",
      summary: "A field note about attention and product decisions."
    };

    expect(() =>
      mapSearchEntries(
        {posts: [englishPost], projects: [], topics: []},
        "vi"
      )
    ).toThrow("Invalid Sanity post post-en-attention");

    expect(() =>
      mapResume(
        {
          _id: "resume-vi",
          language: "vi",
          summary: "Hồ sơ đã xác minh sẽ được cập nhật tại đây.",
          capabilities: [],
          pdfUrl: null,
          pdfLabel: null,
          effectiveDate: null
        },
        [
          {
            _id: "experience-en",
            language: "en",
            organization: "Example",
            role: "Builder",
            location: null,
            dateRange: "2026",
            description: "A deliberately wrong-locale fixture.",
            achievements: []
          }
        ],
        [],
        "vi"
      )
    ).toThrow("Invalid Sanity experience experience-en");
  });

  it("rejects a translated route of the wrong document kind", () => {
    expect(() =>
      mapTranslatedRoute(
        {
          _id: "project-en-attention",
          _type: "project",
          language: "en",
          slug: "attention-project"
        },
        "post"
      )
    ).toThrow("Invalid Sanity post project-en-attention");
  });
});
