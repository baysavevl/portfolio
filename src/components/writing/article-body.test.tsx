import {render, screen} from "@testing-library/react";
import {describe, expect, it} from "vitest";
import {ArticleBody} from "@/components/writing/article-body";
import {postSchema} from "@/lib/content/schemas";
import type {Post, RichTextBlock} from "@/lib/content/types";

const body: RichTextBlock[] = [
  {
    _key: "intro",
    _type: "block",
    style: "normal",
    children: [
      {_key: "strong", _type: "span", text: "Build", marks: ["strong"]},
      {_key: "plain", _type: "span", text: " with ", marks: []},
      {_key: "em", _type: "span", text: "attention", marks: ["em"]},
      {_key: "link", _type: "span", text: " and context", marks: ["context-link"]}
    ],
    markDefs: [
      {
        _key: "context-link",
        _type: "link",
        href: "/en/writing"
      }
    ]
  },
  {
    _key: "heading",
    _type: "block",
    style: "h2",
    children: [
      {_key: "heading-text", _type: "span", text: "A clear heading", marks: []}
    ],
    markDefs: []
  },
  {
    _key: "quote",
    _type: "block",
    style: "blockquote",
    children: [
      {_key: "quote-text", _type: "span", text: "Attention is a practice.", marks: []}
    ],
    markDefs: []
  }
];

describe("ArticleBody", () => {
  it("renders only the supported semantic rich-text elements", () => {
    render(<ArticleBody blocks={body} />);

    expect(screen.getByText("Build", {selector: "strong"})).toBeInTheDocument();
    expect(screen.getByText("attention", {selector: "em"})).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "and context"})).toHaveAttribute(
      "href",
      "/en/writing"
    );
    expect(
      screen.getByRole("heading", {level: 2, name: "A clear heading"})
    ).toBeInTheDocument();
    expect(screen.getByText("Attention is a practice.").closest("blockquote"))
      .toBeInTheDocument();
  });

  it("rejects an unsafe link at the content boundary", () => {
    const unsafePost: Post = {
      id: "unsafe-post",
      locale: "en",
      translationGroup: "unsafe-post",
      slug: "unsafe-post",
      title: "Unsafe post",
      summary: "A fixture that must not reach rendering.",
      topics: ["technology"],
      publishedAt: "2026-10-01T08:00:00.000Z",
      readingMinutes: 1,
      featured: false,
      isDemo: true,
      body: [
        {
          _key: "unsafe-block",
          _type: "block",
          style: "normal",
          children: [
            {_key: "unsafe-span", _type: "span", text: "Do not open", marks: ["unsafe-link"]}
          ],
          markDefs: [
            {_key: "unsafe-link", _type: "link", href: "javascript:alert(1)"}
          ]
        }
      ],
      seo: {title: "Unsafe post", description: "Unsafe fixture"}
    };

    expect(postSchema.safeParse(unsafePost).success).toBe(false);
  });
});
