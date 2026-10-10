import {beforeEach, describe, expect, it, vi} from "vitest";

const mocks = vi.hoisted(() => ({
  getContentSource: vi.fn(),
  requestRepository: {kind: "request"},
  publishedRepository: {kind: "published"}
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/content/source", () => ({
  getContentSource: mocks.getContentSource
}));
vi.mock("@/sanity/lib/repository", () => ({
  sanityContentRepository: mocks.requestRepository,
  publishedSanityContentRepository: mocks.publishedRepository
}));

import {
  getContentRepository,
  getPublishedContentRepository
} from "@/lib/content";
import {demoContentRepository} from "@/lib/content/demo/repository";

describe("content repository selection", () => {
  beforeEach(() => mocks.getContentSource.mockReset());

  it("uses the demonstration repository for both access paths in demo mode", () => {
    mocks.getContentSource.mockReturnValue("demo");

    expect(getContentRepository()).toBe(demoContentRepository);
    expect(getPublishedContentRepository()).toBe(demoContentRepository);
  });

  it("separates request-aware and published-only Sanity access", () => {
    mocks.getContentSource.mockReturnValue("sanity");

    expect(getContentRepository()).toBe(mocks.requestRepository);
    expect(getPublishedContentRepository()).toBe(mocks.publishedRepository);
  });
});
