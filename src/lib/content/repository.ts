import type {Locale} from "@/i18n/locale";
import type {
  HomeData,
  Post,
  PostSummary,
  Profile,
  Project,
  ProjectSummary,
  Resume,
  SearchEntry,
  SiteSettings,
  Topic,
  TranslatedRoute
} from "@/lib/content/types";

export interface ContentRepository {
  getHome(locale: Locale): Promise<HomeData>;
  getProfile(locale: Locale): Promise<Profile>;
  getSettings(locale: Locale): Promise<SiteSettings>;
  getTopics(locale: Locale): Promise<Topic[]>;
  listPosts(locale: Locale): Promise<PostSummary[]>;
  getPost(locale: Locale, slug: string): Promise<Post | null>;
  listProjects(locale: Locale): Promise<ProjectSummary[]>;
  getProject(locale: Locale, slug: string): Promise<Project | null>;
  getResume(locale: Locale): Promise<Resume>;
  listSearchEntries(locale: Locale): Promise<SearchEntry[]>;
  getTranslatedRoute(
    kind: "post" | "project",
    translationGroup: string,
    targetLocale: Locale
  ): Promise<TranslatedRoute | null>;
}
