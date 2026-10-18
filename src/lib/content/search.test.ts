import {describe, expect, it} from "vitest";
import {filterSearchEntries, normalizeSearchText} from "@/lib/content/search";
import type {SearchEntry} from "@/lib/content/types";

const entry: SearchEntry = {
  id: "vi-leadership",
  locale: "vi",
  kind: "post",
  href: "/vi/writing/ro-rang-truoc-toc-do",
  title: "Lãnh đạo bằng sự rõ ràng",
  summary: "Một bài viết minh hoạ.",
  topics: ["leadership"],
  searchableText: "lãnh đạo rõ ràng sản phẩm",
  isDemo: true
};

describe("search", () => {
  it("normalizes Vietnamese diacritics", () => {
    expect(normalizeSearchText("Lãnh đạo")).toBe("lanh dao");
  });

  it("intersects text and topic filters", () => {
    expect(filterSearchEntries([entry], "lanh dao", "leadership")).toHaveLength(
      1
    );
    expect(filterSearchEntries([entry], "lanh dao", "sport")).toHaveLength(0);
  });
});
