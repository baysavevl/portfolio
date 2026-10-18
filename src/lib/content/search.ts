import type {SearchEntry, TopicKey} from "@/lib/content/types";

export function normalizeSearchText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function filterSearchEntries(
  entries: SearchEntry[],
  query: string,
  topic: TopicKey | "all"
): SearchEntry[] {
  const normalizedQuery = normalizeSearchText(query);

  return entries.filter((entry) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      normalizeSearchText(entry.searchableText).includes(normalizedQuery);
    const matchesTopic = topic === "all" || entry.topics.includes(topic);

    return matchesQuery && matchesTopic;
  });
}
