import type {MetadataRoute} from "next";
import {getContentRepository} from "@/lib/content";
import {locales, type Locale, type PublicSection} from "@/i18n/locale";
import {absoluteUrl, getSiteUrl} from "@/lib/seo/metadata";
import type {PostSummary, ProjectSummary} from "@/lib/content/types";

function stableRoute(
  siteUrl: string,
  locale: Locale,
  section: PublicSection
): MetadataRoute.Sitemap[number] {
  const suffix = section === "home" ? "" : `/${section}`;
  const pathname = `/${locale}${suffix}`;
  const targetLocale: Locale = locale === "en" ? "vi" : "en";
  const targetPathname = `/${targetLocale}${suffix}`;

  return {
    url: absoluteUrl(pathname, siteUrl),
    alternates: {
      languages: {
        [locale]: absoluteUrl(pathname, siteUrl),
        [targetLocale]: absoluteUrl(targetPathname, siteUrl)
      }
    }
  };
}

function contentAlternates<T extends PostSummary | ProjectSummary>(
  siteUrl: string,
  entry: T,
  entries: T[],
  section: "writing" | "work"
) {
  const counterpart = entries.find(
    (candidate) =>
      candidate.translationGroup === entry.translationGroup &&
      candidate.locale !== entry.locale
  );

  return {
    languages: {
      [entry.locale]: absoluteUrl(
        `/${entry.locale}/${section}/${entry.slug}`,
        siteUrl
      ),
      ...(counterpart
        ? {
            [counterpart.locale]: absoluteUrl(
              `/${counterpart.locale}/${section}/${counterpart.slug}`,
              siteUrl
            )
          }
        : {})
    }
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const repository = getContentRepository();
  const siteUrl = getSiteUrl();
  const [englishPosts, vietnamesePosts, englishProjects, vietnameseProjects] =
    await Promise.all([
      repository.listPosts("en"),
      repository.listPosts("vi"),
      repository.listProjects("en"),
      repository.listProjects("vi")
    ]);
  const posts = [...englishPosts, ...vietnamesePosts];
  const projects = [...englishProjects, ...vietnameseProjects];
  const stableSections: PublicSection[] = [
    "home",
    "writing",
    "work",
    "about",
    "resume"
  ];

  return [
    ...locales.flatMap((locale) =>
      stableSections.map((section) => stableRoute(siteUrl, locale, section))
    ),
    ...posts.map((post) => ({
      url: absoluteUrl(`/${post.locale}/writing/${post.slug}`, siteUrl),
      lastModified: post.publishedAt,
      alternates: contentAlternates(siteUrl, post, posts, "writing")
    })),
    ...projects.map((project) => ({
      url: absoluteUrl(`/${project.locale}/work/${project.slug}`, siteUrl),
      alternates: contentAlternates(siteUrl, project, projects, "work")
    }))
  ];
}
