import {absoluteUrl} from "@/lib/seo/metadata";
import type {Post, Profile, Project, TopicKey} from "@/lib/content/types";

export type JsonLdData = Record<string, unknown>;

const topicLabels: Record<TopicKey, string> = {
  business: "Business",
  leadership: "Leadership",
  startup: "Startup",
  technology: "Technology",
  product: "Product",
  sport: "Sport",
  mindfulness: "Mindfulness"
};

export function buildPersonJsonLd({
  profile,
  siteUrl
}: {
  profile: Profile;
  siteUrl: string;
}): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: absoluteUrl(`/${profile.locale}/about`, siteUrl),
    description: profile.positioning,
    knowsAbout: Object.values(topicLabels)
  };
}

export function buildWebsiteJsonLd({
  locale,
  siteUrl,
  description
}: {
  locale: Profile["locale"];
  siteUrl: string;
  description: string;
}): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Vincent Luu — The Mindful Builder",
    url: absoluteUrl(`/${locale}`, siteUrl),
    description,
    inLanguage: locale
  };
}

export function buildArticleJsonLd({
  post,
  siteUrl
}: {
  post: Post;
  siteUrl: string;
}): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary,
    datePublished: post.publishedAt,
    inLanguage: post.locale,
    url: absoluteUrl(`/${post.locale}/writing/${post.slug}`, siteUrl),
    author: {
      "@type": "Person",
      name: "Vincent Luu",
      url: absoluteUrl(`/${post.locale}/about`, siteUrl)
    },
    keywords: post.topics.map((topic) => topicLabels[topic])
  };
}

export function buildCreativeWorkJsonLd({
  project,
  siteUrl
}: {
  project: Project;
  siteUrl: string;
}): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    inLanguage: project.locale,
    url: absoluteUrl(`/${project.locale}/work/${project.slug}`, siteUrl),
    creator: {
      "@type": "Person",
      name: "Vincent Luu",
      url: absoluteUrl(`/${project.locale}/about`, siteUrl)
    },
    keywords: project.topics.map((topic) => topicLabels[topic])
  };
}

export function buildBreadcrumbJsonLd({
  siteUrl,
  items
}: {
  siteUrl: string;
  items: Array<{name: string; pathname: string}>;
}): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.pathname, siteUrl)
    }))
  };
}
