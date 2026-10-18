import {render, screen} from "@testing-library/react";
import {describe, expect, it, vi} from "vitest";
import {WritingIndex} from "@/components/writing/writing-index";
import type {PostSummary, SearchEntry, Topic} from "@/lib/content/types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({replace: vi.fn()})
}));

const topics: Topic[] = [
  {
    key: "leadership",
    label: "Leadership",
    description: "Clarity and trust.",
    accent: "quiet-sage"
  },
  {
    key: "sport",
    label: "Sport",
    description: "Practice and recovery.",
    accent: "graphite"
  }
];

const posts: PostSummary[] = [
  {
    id: "new-featured",
    locale: "en",
    translationGroup: "new-featured",
    slug: "new-featured",
    title: "New featured note",
    summary: "A featured demonstration note.",
    topics: ["leadership"],
    publishedAt: "2026-09-18T08:00:00.000Z",
    readingMinutes: 4,
    featured: true,
    isDemo: true
  },
  {
    id: "middle-sport",
    locale: "en",
    translationGroup: "middle-sport",
    slug: "middle-sport",
    title: "A training system",
    summary: "A sport demonstration note.",
    topics: ["sport"],
    publishedAt: "2026-08-20T08:00:00.000Z",
    readingMinutes: 5,
    featured: false,
    isDemo: true
  },
  {
    id: "older-leadership",
    locale: "en",
    translationGroup: "older-leadership",
    slug: "older-leadership",
    title: "Older leadership note",
    summary: "Another leadership demonstration note.",
    topics: ["leadership"],
    publishedAt: "2026-07-10T08:00:00.000Z",
    readingMinutes: 3,
    featured: false,
    isDemo: true
  }
];

const entries: SearchEntry[] = posts.map((post) => ({
  id: post.id,
  locale: post.locale,
  kind: "post",
  href: `/en/writing/${post.slug}`,
  title: post.title,
  summary: post.summary,
  topics: post.topics,
  searchableText: `${post.title} ${post.summary} ${post.topics.join(" ")}`,
  isDemo: post.isDemo
}));

describe("WritingIndex", () => {
  it("separates featured writing from the chronological field notes", () => {
    render(
      <WritingIndex
        locale="en"
        posts={posts}
        searchEntries={entries}
        topics={topics}
        initialQuery=""
        initialTopic="all"
        translationUnavailable={false}
      />
    );

    expect(screen.getByRole("heading", {name: "Featured"})).toBeInTheDocument();
    expect(screen.getByRole("heading", {name: "All field notes"})).toBeInTheDocument();
    expect(screen.getAllByRole("article").map((article) => article.textContent)).toEqual([
      expect.stringContaining("New featured note"),
      expect.stringContaining("A training system"),
      expect.stringContaining("Older leadership note")
    ]);
  });

  it("renders one neutral filtered list and a missing-translation notice", () => {
    render(
      <WritingIndex
        locale="en"
        posts={posts}
        searchEntries={entries}
        topics={topics}
        initialQuery="leadership"
        initialTopic="leadership"
        translationUnavailable
      />
    );

    expect(
      screen.getByText("This entry is not available in the selected language.")
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading", {name: "Featured"})).not.toBeInTheDocument();
    expect(screen.getByText("2 results")).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(2);
  });

  it("explains an empty result and offers a reset button", () => {
    render(
      <WritingIndex
        locale="en"
        posts={posts}
        searchEntries={entries}
        topics={topics}
        initialQuery="missing"
        initialTopic="sport"
        translationUnavailable={false}
      />
    );

    expect(
      screen.getByText("No field notes match the active filters.")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", {name: "Reset filters"})).toBeInTheDocument();
  });
});
