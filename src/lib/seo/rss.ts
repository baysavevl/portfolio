import type {Locale} from "@/i18n/locale";
import type {PostSummary} from "@/lib/content/types";
import {absoluteUrl} from "@/lib/seo/metadata";

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;"
    };

    return entities[character] ?? character;
  });
}

interface BuildRssXmlInput {
  locale: Locale;
  siteUrl: string;
  title: string;
  description: string;
  posts: PostSummary[];
}

export function buildRssXml({
  locale,
  siteUrl,
  title,
  description,
  posts
}: BuildRssXmlInput): string {
  const writingUrl = absoluteUrl(`/${locale}/writing`, siteUrl);
  const localizedPosts = posts
    .filter((post) => post.locale === locale)
    .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
  const items = localizedPosts
    .map((post) => {
      const url = absoluteUrl(`/${locale}/writing/${post.slug}`, siteUrl);

      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `      <description>${escapeXml(post.summary)}</description>`,
        `      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>`,
        "    </item>"
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "  <channel>",
    `    <title>${escapeXml(title)}</title>`,
    `    <link>${escapeXml(writingUrl)}</link>`,
    `    <description>${escapeXml(description)}</description>`,
    `    <language>${locale === "vi" ? "vi-VN" : "en-US"}</language>`,
    `    <lastBuildDate>${new Date(localizedPosts[0]?.publishedAt ?? 0).toUTCString()}</lastBuildDate>`,
    items,
    "  </channel>",
    "</rss>",
    ""
  ]
    .filter((line) => line.length > 0)
    .join("\n");
}
