import type {QueryOptions} from "next-sanity";

export type SanityFetchPolicy = Pick<
  QueryOptions,
  "cache" | "next" | "perspective" | "stega" | "useCdn"
>;

export function buildFetchPolicy(
  preview: boolean,
  tags: string[]
): SanityFetchPolicy {
  if (preview) {
    return {
      perspective: "drafts",
      useCdn: false,
      stega: {studioUrl: "/studio"},
      cache: "no-store"
    };
  }

  return {
    perspective: "published",
    useCdn: true,
    stega: false,
    next: {revalidate: false, tags}
  };
}
