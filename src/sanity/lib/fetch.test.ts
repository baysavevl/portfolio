import {beforeEach, describe, expect, it, vi} from "vitest";

const mocks = vi.hoisted(() => ({
  draftMode: vi.fn(),
  fetch: vi.fn(),
  getServerSanityEnv: vi.fn()
}));

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({draftMode: mocks.draftMode}));
vi.mock("@/sanity/env/server", () => ({
  getServerSanityEnv: mocks.getServerSanityEnv
}));
vi.mock("@/sanity/lib/client", () => ({
  getSanityClient: () => ({
    withConfig: ({token}: {token: string}) => {
      expect(token).toBe("viewer-token");
      return {fetch: mocks.fetch};
    }
  })
}));

import {
  fetchPublishedSanity,
  fetchSanityForRequest
} from "@/sanity/lib/fetch";

describe("Sanity query runners", () => {
  beforeEach(() => {
    mocks.draftMode.mockReset();
    mocks.fetch.mockReset().mockResolvedValue({ok: true});
    mocks.getServerSanityEnv.mockReset().mockReturnValue({
      readToken: "viewer-token",
      writeToken: null,
      revalidateSecret: null
    });
  });

  it("uses request state only for the request-aware runner", async () => {
    mocks.draftMode.mockResolvedValue({isEnabled: false});

    await fetchSanityForRequest("*[]", {locale: "vi"}, ["post:vi"]);

    expect(mocks.draftMode).toHaveBeenCalledOnce();
    expect(mocks.fetch).toHaveBeenCalledWith(
      "*[]",
      {locale: "vi"},
      {
        perspective: "published",
        useCdn: true,
        stega: false,
        next: {revalidate: false, tags: ["post:vi"]}
      }
    );
  });

  it("never reads request state for the published runner", async () => {
    await fetchPublishedSanity("*[]", {}, ["sitemap"]);

    expect(mocks.draftMode).not.toHaveBeenCalled();
    expect(mocks.fetch).toHaveBeenCalledWith("*[]", {}, {
      perspective: "published",
      useCdn: true,
      stega: false,
      next: {revalidate: false, tags: ["sitemap"]}
    });
  });

  it("uses uncached drafts with stega in preview", async () => {
    mocks.draftMode.mockResolvedValue({isEnabled: true});

    await fetchSanityForRequest("*[]", {}, ["post"]);

    expect(mocks.fetch).toHaveBeenCalledWith("*[]", {}, {
      perspective: "drafts",
      useCdn: false,
      stega: {studioUrl: "/studio"},
      cache: "no-store"
    });
  });

  it("fails before querying when preview authorization is absent", async () => {
    mocks.draftMode.mockResolvedValue({isEnabled: true});
    mocks.getServerSanityEnv.mockReturnValue({
      readToken: null,
      writeToken: null,
      revalidateSecret: null
    });

    await expect(
      fetchSanityForRequest("*[]", {}, ["post"])
    ).rejects.toThrow("Preview authorization is not configured");
    expect(mocks.fetch).not.toHaveBeenCalled();
  });
});
