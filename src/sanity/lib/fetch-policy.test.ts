import {describe, expect, it} from "vitest";

import {buildFetchPolicy} from "@/sanity/lib/fetch-policy";

describe("buildFetchPolicy", () => {
  it("caches only the published perspective for public traffic", () => {
    expect(buildFetchPolicy(false, ["post", "post:en"])).toEqual({
      perspective: "published",
      useCdn: true,
      stega: false,
      next: {revalidate: false, tags: ["post", "post:en"]}
    });
  });

  it("uses authenticated uncached drafts for preview", () => {
    expect(buildFetchPolicy(true, ["post", "post:en"])).toEqual({
      perspective: "drafts",
      useCdn: false,
      stega: {studioUrl: "/studio"},
      cache: "no-store"
    });
  });
});
