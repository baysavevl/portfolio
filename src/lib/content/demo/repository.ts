import type {z} from "zod";
import type {Locale} from "@/i18n/locale";
import {
  demoPosts,
  demoProfiles,
  demoProjects,
  demoResumes,
  demoSettings,
  demoTopics
} from "@/lib/content/demo/data";
import type {ContentRepository} from "@/lib/content/repository";
import {
  homeDataSchema,
  postSchema,
  postSummarySchema,
  profileSchema,
  projectSchema,
  projectSummarySchema,
  resumeSchema,
  searchEntrySchema,
  siteSettingsSchema,
  topicSchema,
  translatedRouteSchema
} from "@/lib/content/schemas";
import type {
  Post,
  PostSummary,
  Project,
  ProjectSummary,
  SearchEntry,
  Topic,
  TranslatedRoute
} from "@/lib/content/types";

function parseRecord<T>(schema: z.ZodType<T>, value: unknown, label: string): T {
  const result = schema.safeParse(value);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => {
        const path = issue.path.length > 0 ? issue.path.join(".") : "root";
        return `${path}: ${issue.message}`;
      })
      .join("; ");

    throw new Error(`Invalid demonstration content (${label}): ${details}`);
  }

  return result.data;
}

function getValidatedPosts(): Post[] {
  return demoPosts.map((post) =>
    parseRecord(postSchema, post, `post ${post.id}`)
  );
}

function getValidatedProjects(): Project[] {
  return demoProjects.map((project) =>
    parseRecord(projectSchema, project, `project ${project.id}`)
  );
}

function toPostSummary(post: Post): PostSummary {
  const summary: PostSummary = {
    id: post.id,
    locale: post.locale,
    translationGroup: post.translationGroup,
    slug: post.slug,
    title: post.title,
    summary: post.summary,
    topics: post.topics,
    publishedAt: post.publishedAt,
    readingMinutes: post.readingMinutes,
    featured: post.featured,
    isDemo: post.isDemo
  };

  return parseRecord(postSummarySchema, summary, `post summary ${post.id}`);
}

function toProjectSummary(project: Project): ProjectSummary {
  const summary: ProjectSummary = {
    id: project.id,
    locale: project.locale,
    translationGroup: project.translationGroup,
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    topics: project.topics,
    featured: project.featured,
    isDemo: project.isDemo
  };

  return parseRecord(
    projectSummarySchema,
    summary,
    `project summary ${project.id}`
  );
}

function localizedTopics(locale: Locale): Topic[] {
  return demoTopics[locale].map((topic) =>
    parseRecord(topicSchema, topic, `topic ${locale}/${topic.key}`)
  );
}

function topicLabels(locale: Locale): Map<Topic["key"], string> {
  return new Map(
    localizedTopics(locale).map((topic) => [topic.key, topic.label])
  );
}

function buildPostSearchEntry(post: Post): SearchEntry {
  const labels = topicLabels(post.locale);
  const bodyText = post.body.flatMap((block) =>
    block.children.map((span) => span.text)
  );

  return parseRecord(
    searchEntrySchema,
    {
      id: post.id,
      locale: post.locale,
      kind: "post",
      href: `/${post.locale}/writing/${post.slug}`,
      title: post.title,
      summary: post.summary,
      topics: post.topics,
      searchableText: [
        post.title,
        post.summary,
        ...post.topics.map((topic) => labels.get(topic) ?? topic),
        ...bodyText
      ].join(" "),
      isDemo: post.isDemo
    },
    `search entry ${post.id}`
  );
}

function buildProjectSearchEntry(project: Project): SearchEntry {
  const labels = topicLabels(project.locale);

  return parseRecord(
    searchEntrySchema,
    {
      id: project.id,
      locale: project.locale,
      kind: "project",
      href: `/${project.locale}/work/${project.slug}`,
      title: project.title,
      summary: project.summary,
      topics: project.topics,
      searchableText: [
        project.title,
        project.summary,
        ...project.topics.map((topic) => labels.get(topic) ?? topic),
        project.context,
        project.role,
        ...project.decisions,
        project.outcome,
        project.reflection
      ].join(" "),
      isDemo: project.isDemo
    },
    `search entry ${project.id}`
  );
}

async function listPosts(locale: Locale): Promise<PostSummary[]> {
  return getValidatedPosts()
    .filter((post) => post.locale === locale)
    .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt))
    .map(toPostSummary);
}

async function listProjects(locale: Locale): Promise<ProjectSummary[]> {
  return getValidatedProjects()
    .filter((project) => project.locale === locale)
    .map(toProjectSummary);
}

export const demoContentRepository: ContentRepository = {
  async getHome(locale) {
    const [profile, posts, projects, resume, topics, settings] =
      await Promise.all([
        this.getProfile(locale),
        this.listPosts(locale),
        this.listProjects(locale),
        this.getResume(locale),
        this.getTopics(locale),
        this.getSettings(locale)
      ]);

    return parseRecord(
      homeDataSchema,
      {
        profile,
        featuredPost: posts.find((post) => post.featured) ?? null,
        featuredProjects: projects.filter((project) => project.featured),
        resume,
        topics,
        settings
      },
      `home ${locale}`
    );
  },

  async getProfile(locale) {
    return parseRecord(
      profileSchema,
      demoProfiles[locale],
      `profile ${locale}`
    );
  },

  async getSettings(locale) {
    return parseRecord(
      siteSettingsSchema,
      demoSettings[locale],
      `settings ${locale}`
    );
  },

  async getTopics(locale) {
    return localizedTopics(locale);
  },

  listPosts,

  async getPost(locale, slug) {
    const post = getValidatedPosts().find(
      (entry) => entry.locale === locale && entry.slug === slug
    );

    return post ?? null;
  },

  listProjects,

  async getProject(locale, slug) {
    const project = getValidatedProjects().find(
      (entry) => entry.locale === locale && entry.slug === slug
    );

    return project ?? null;
  },

  async getResume(locale) {
    return parseRecord(
      resumeSchema,
      demoResumes[locale],
      `resume ${locale}`
    );
  },

  async listSearchEntries(locale) {
    const posts = getValidatedPosts()
      .filter((post) => post.locale === locale)
      .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt))
      .map(buildPostSearchEntry);
    const projects = getValidatedProjects()
      .filter((project) => project.locale === locale)
      .map(buildProjectSearchEntry);

    return [...posts, ...projects];
  },

  async getTranslatedRoute(kind, translationGroup, targetLocale) {
    let route: TranslatedRoute | null = null;

    if (kind === "post") {
      const post = getValidatedPosts().find(
        (entry) =>
          entry.translationGroup === translationGroup &&
          entry.locale === targetLocale
      );

      if (post) {
        route = {
          locale: targetLocale,
          href: `/${targetLocale}/writing/${post.slug}`
        };
      }
    } else {
      const project = getValidatedProjects().find(
        (entry) =>
          entry.translationGroup === translationGroup &&
          entry.locale === targetLocale
      );

      if (project) {
        route = {
          locale: targetLocale,
          href: `/${targetLocale}/work/${project.slug}`
        };
      }
    }

    return route
      ? parseRecord(
          translatedRouteSchema,
          route,
          `${kind} translation ${translationGroup}/${targetLocale}`
        )
      : null;
  }
};
