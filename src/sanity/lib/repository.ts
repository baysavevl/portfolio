import type {Locale} from "@/i18n/locale";
import type {ContentRepository} from "@/lib/content/repository";
import {
  homeTags,
  localizedTags,
  resumeTags,
  searchTags,
  translatedContentTags
} from "@/sanity/lib/cache-tags";
import {
  fetchPublishedSanity,
  fetchSanityForRequest,
  type SanityQueryRunner
} from "@/sanity/lib/fetch";
import {
  mapHomeData,
  mapPost,
  mapPostSummary,
  mapProfile,
  mapProject,
  mapProjectSummary,
  mapResume,
  mapSearchEntries,
  mapSiteSettings,
  mapTopic,
  mapTranslatedRoute
} from "@/sanity/lib/mapper";
import {
  HOME_QUERY,
  POST_DETAIL_QUERY,
  POSTS_QUERY,
  PROFILE_QUERY,
  PROJECT_DETAIL_QUERY,
  PROJECTS_QUERY,
  RESUME_QUERY,
  SEARCH_QUERY,
  SETTINGS_QUERY,
  TOPICS_QUERY,
  TRANSLATED_ROUTE_QUERY
} from "@/sanity/lib/queries";
import type {
  RawEducation,
  RawExperience,
  RawHomeData,
  RawPost,
  RawProfile,
  RawProject,
  RawResumeAsset,
  RawSearchData,
  RawSiteSettings,
  RawTopic,
  RawTranslatedRoute
} from "@/sanity/lib/raw-types";

interface RawResumeData {
  resumeAsset: RawResumeAsset | null;
  experience: RawExperience[];
  education: RawEducation[];
}

function requireList<T>(value: unknown, type: string): T[] {
  if (!Array.isArray(value)) {
    throw new Error(`Invalid Sanity ${type} unknown`);
  }

  return value as T[];
}

function requireLocale<T extends {locale: Locale}>(
  value: T,
  locale: Locale,
  type: string,
  id: string
): T {
  if (value.locale !== locale) {
    throw new Error(`Invalid Sanity ${type} ${id}`);
  }

  return value;
}

function rawDocumentId(value: unknown): string {
  if (value && typeof value === "object" && "_id" in value) {
    const id = (value as {_id?: unknown})._id;
    if (typeof id === "string" && id.length > 0) {
      return id;
    }
  }

  return "unknown";
}

function requireEntryLocale<T extends {id: string; locale: Locale}>(
  value: T,
  locale: Locale,
  type: string
): T {
  return requireLocale(value, locale, type, value.id);
}

export function createSanityContentRepository(
  runQuery: SanityQueryRunner
): ContentRepository {
  return {
    async getHome(locale) {
      const raw = await runQuery<RawHomeData>(
        HOME_QUERY,
        {locale},
        homeTags(locale)
      );
      return mapHomeData(raw, locale);
    },

    async getProfile(locale) {
      const raw = await runQuery<RawProfile | null>(
        PROFILE_QUERY,
        {locale},
        localizedTags("profile", locale)
      );
      return requireLocale(
        mapProfile(raw),
        locale,
        "profile",
        rawDocumentId(raw)
      );
    },

    async getSettings(locale) {
      const raw = await runQuery<RawSiteSettings | null>(
        SETTINGS_QUERY,
        {locale},
        localizedTags("siteSettings", locale)
      );
      return requireLocale(
        mapSiteSettings(raw),
        locale,
        "siteSettings",
        rawDocumentId(raw)
      );
    },

    async getTopics(locale) {
      const raw = await runQuery<RawTopic[]>(
        TOPICS_QUERY,
        {locale},
        localizedTags("topic", locale)
      );
      return requireList<RawTopic>(raw, "topic").map(mapTopic);
    },

    async listPosts(locale) {
      const raw = await runQuery<RawPost[]>(
        POSTS_QUERY,
        {locale},
        translatedContentTags("post", locale)
      );

      return requireList<RawPost>(raw, "post")
        .map(mapPostSummary)
        .map((post) => requireEntryLocale(post, locale, "post"))
        .sort((left, right) =>
          right.publishedAt.localeCompare(left.publishedAt)
        );
    },

    async getPost(locale, slug) {
      const raw = await runQuery<RawPost | null>(
        POST_DETAIL_QUERY,
        {locale, slug},
        translatedContentTags("post", locale)
      );

      if (!raw) {
        return null;
      }

      const post = mapPost(raw);
      requireEntryLocale(post, locale, "post");

      if (post.slug !== slug) {
        throw new Error(`Invalid Sanity post ${post.id}`);
      }

      return post;
    },

    async listProjects(locale) {
      const raw = await runQuery<RawProject[]>(
        PROJECTS_QUERY,
        {locale},
        translatedContentTags("project", locale)
      );
      return requireList<RawProject>(raw, "project")
        .map(mapProjectSummary)
        .map((project) =>
          requireEntryLocale(project, locale, "project")
        );
    },

    async getProject(locale, slug) {
      const raw = await runQuery<RawProject | null>(
        PROJECT_DETAIL_QUERY,
        {locale, slug},
        translatedContentTags("project", locale)
      );

      if (!raw) {
        return null;
      }

      const project = mapProject(raw);
      requireEntryLocale(project, locale, "project");

      if (project.slug !== slug) {
        throw new Error(`Invalid Sanity project ${project.id}`);
      }

      return project;
    },

    async getResume(locale) {
      const raw = await runQuery<RawResumeData>(
        RESUME_QUERY,
        {locale},
        resumeTags(locale)
      );
      return mapResume(
        raw.resumeAsset,
        raw.experience,
        raw.education,
        locale
      );
    },

    async listSearchEntries(locale) {
      const raw = await runQuery<RawSearchData>(
        SEARCH_QUERY,
        {locale},
        searchTags(locale)
      );
      return mapSearchEntries(raw, locale);
    },

    async getTranslatedRoute(kind, translationGroup, targetLocale) {
      const raw = await runQuery<RawTranslatedRoute | null>(
        TRANSLATED_ROUTE_QUERY,
        {kind, targetLocale, translationGroup},
        translatedContentTags(kind, targetLocale)
      );
      const route = mapTranslatedRoute(raw, kind);

      if (route && route.locale !== targetLocale) {
        throw new Error(`Invalid Sanity ${kind} ${rawDocumentId(raw)}`);
      }

      return route;
    }
  };
}

export const sanityContentRepository = createSanityContentRepository(
  fetchSanityForRequest
);

export const publishedSanityContentRepository =
  createSanityContentRepository(fetchPublishedSanity);
