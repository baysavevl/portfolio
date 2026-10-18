import type {z} from "zod";
import {stegaClean} from "next-sanity";

import type {Locale} from "@/i18n/locale";
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
import type {RawTranslatedRoute} from "@/sanity/lib/raw-types";

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function invalidSanity(type: string, id: string): Error {
  return new Error(`Invalid Sanity ${type} ${id}`);
}

function requireRecord(
  value: unknown,
  type: string,
  id: string
): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw invalidSanity(type, id);
  }

  return value as Record<string, unknown>;
}

function requireArray(
  value: unknown,
  type: string,
  id: string
): unknown[] {
  if (!Array.isArray(value)) {
    throw invalidSanity(type, id);
  }

  return value;
}

function documentId(value: unknown): string {
  const id = cleanString(asRecord(value)._id);
  return typeof id === "string" && id.length > 0 ? id : "unknown";
}

function cleanString(value: unknown): unknown {
  return typeof value === "string" ? stegaClean(value) : value;
}

function cleanStringArray(value: unknown): unknown {
  return Array.isArray(value) ? value.map(cleanString) : value;
}

function assertRawLocale(
  value: unknown,
  locale: Locale,
  type: string
): void {
  if (cleanString(asRecord(value).language) !== locale) {
    throw invalidSanity(type, documentId(value));
  }
}

function assertMappedLocale(
  value: {id: string; locale: Locale},
  locale: Locale,
  type: string
): void {
  if (value.locale !== locale) {
    throw invalidSanity(type, value.id);
  }
}

function parseSanity<T>(
  schema: z.ZodType<T>,
  candidate: unknown,
  type: string,
  id: string
): T {
  const parsed = schema.safeParse(candidate);

  if (!parsed.success) {
    throw invalidSanity(type, id);
  }

  return parsed.data;
}

function mappedArray(
  value: unknown,
  mapItem: (item: unknown) => unknown
): unknown {
  return Array.isArray(value) ? value.map(mapItem) : value;
}

function mapPortableText(value: unknown): unknown {
  return mappedArray(value, (rawBlock) => {
    const block = asRecord(rawBlock);

    return {
      _key: cleanString(block._key),
      _type: cleanString(block._type),
      style: cleanString(block.style),
      children: mappedArray(block.children, (rawSpan) => {
        const span = asRecord(rawSpan);
        return {
          _key: cleanString(span._key),
          _type: cleanString(span._type),
          text: span.text,
          marks: cleanStringArray(span.marks)
        };
      }),
      markDefs: mappedArray(block.markDefs, (rawDefinition) => {
        const definition = asRecord(rawDefinition);
        return {
          _key: cleanString(definition._key),
          _type: cleanString(definition._type),
          href: cleanString(definition.href)
        };
      })
    };
  });
}

function readingMinutes(value: unknown): number {
  if (!Array.isArray(value)) {
    return Number.NaN;
  }

  const words = value.flatMap((rawBlock) => {
    const children = asRecord(rawBlock).children;
    if (!Array.isArray(children)) {
      return [];
    }

    return children.flatMap((rawSpan) => {
      const text = asRecord(rawSpan).text;
      return typeof text === "string"
        ? (text.match(/[\p{L}\p{N}]+/gu) ?? [])
        : [];
    });
  });

  return Math.max(1, Math.ceil(words.length / 200));
}

function mapSeo(value: unknown) {
  const seo = asRecord(value);
  return {title: seo.title, description: seo.description};
}

function mapLinks(value: unknown): unknown {
  return mappedArray(value, (rawLink) => {
    const link = asRecord(rawLink);
    return {label: link.label, href: cleanString(link.href)};
  });
}

export function mapPost(raw: unknown): Post {
  const post = asRecord(raw);
  const candidate = {
    id: cleanString(post._id),
    locale: cleanString(post.language),
    translationGroup: cleanString(post.translationGroup),
    slug: cleanString(post.slug),
    title: post.title,
    summary: post.summary,
    topics: cleanStringArray(post.topics),
    publishedAt: cleanString(post.publishedAt),
    readingMinutes: readingMinutes(post.body),
    featured: post.featured,
    isDemo: post.isDemo,
    body: mapPortableText(post.body),
    seo: mapSeo(post.seo)
  };

  return parseSanity(postSchema, candidate, "post", documentId(raw));
}

export function mapPostSummary(raw: unknown): PostSummary {
  const post = mapPost(raw);
  const candidate = {
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

  return parseSanity(postSummarySchema, candidate, "post", post.id);
}

export function mapProject(raw: unknown): Project {
  const project = asRecord(raw);
  const candidate = {
    id: cleanString(project._id),
    locale: cleanString(project.language),
    translationGroup: cleanString(project.translationGroup),
    slug: cleanString(project.slug),
    title: project.title,
    summary: project.summary,
    topics: cleanStringArray(project.topics),
    featured: project.featured,
    isDemo: project.isDemo,
    context: project.context,
    role: project.role,
    decisions: project.decisions,
    outcome: project.outcome,
    reflection: project.reflection,
    seo: mapSeo(project.seo)
  };

  return parseSanity(
    projectSchema,
    candidate,
    "project",
    documentId(raw)
  );
}

export function mapProjectSummary(raw: unknown): ProjectSummary {
  const project = mapProject(raw);
  const candidate = {
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

  return parseSanity(
    projectSummarySchema,
    candidate,
    "project",
    project.id
  );
}

export function mapProfile(raw: unknown): Profile {
  const profile = asRecord(raw);
  const candidate = {
    locale: cleanString(profile.language),
    name: cleanString(profile.name),
    descriptor: cleanString(profile.descriptor),
    positioning: profile.positioning,
    introduction: profile.introduction,
    heroInitialMode: cleanString(profile.heroInitialMode),
    currentQuestions: profile.currentQuestions,
    principles: mappedArray(profile.principles, (rawPrinciple) => {
      const principle = asRecord(rawPrinciple);
      return {title: principle.title, description: principle.description};
    })
  };

  return parseSanity(
    profileSchema,
    candidate,
    "profile",
    documentId(raw)
  );
}

export function mapSiteSettings(raw: unknown): SiteSettings {
  const settings = asRecord(raw);
  const candidate = {
    locale: cleanString(settings.language),
    footerNote: settings.footerNote,
    socialLinks: mapLinks(settings.socialLinks),
    contactLinks: mapLinks(settings.contactLinks),
    seo: mapSeo(settings.seo)
  };

  return parseSanity(
    siteSettingsSchema,
    candidate,
    "siteSettings",
    documentId(raw)
  );
}

export function mapTopic(raw: unknown): Topic {
  const topic = asRecord(raw);
  return parseSanity(
    topicSchema,
    {
      key: cleanString(topic.key),
      label: topic.label,
      description: topic.description,
      accent: cleanString(topic.accent)
    },
    "topic",
    documentId(raw)
  );
}

export function mapResume(
  rawAsset: unknown,
  rawExperience: unknown,
  rawEducation: unknown,
  locale: Locale
): Resume {
  const asset = asRecord(rawAsset);
  if (Array.isArray(rawExperience)) {
    rawExperience.forEach((entry) =>
      assertRawLocale(entry, locale, "experience")
    );
  }
  if (Array.isArray(rawEducation)) {
    rawEducation.forEach((entry) =>
      assertRawLocale(entry, locale, "education")
    );
  }
  const experience = mappedArray(rawExperience, (rawEntry) => {
    const entry = asRecord(rawEntry);
    return {
      id: cleanString(entry._id),
      organization: entry.organization,
      role: entry.role,
      location: entry.location == null ? null : entry.location,
      dateRange: entry.dateRange,
      description: entry.description,
      achievements: entry.achievements
    };
  });
  const education = mappedArray(rawEducation, (rawEntry) => {
    const entry = asRecord(rawEntry);
    return {
      id: cleanString(entry._id),
      institution: entry.institution,
      program: entry.program,
      dateRange: entry.dateRange,
      notes: entry.notes == null ? null : entry.notes
    };
  });
  const candidate = {
    locale: cleanString(asset.language),
    summary: asset.summary,
    experience,
    education,
    capabilities: asset.capabilities,
    pdfUrl: asset.pdfUrl == null ? null : cleanString(asset.pdfUrl),
    pdfLabel: asset.pdfLabel == null ? null : asset.pdfLabel,
    effectiveDate:
      asset.effectiveDate == null ? null : cleanString(asset.effectiveDate)
  };
  const resume = parseSanity(
    resumeSchema,
    candidate,
    "resume",
    documentId(rawAsset)
  );

  if (resume.locale !== locale) {
    throw new Error(`Invalid Sanity resume ${documentId(rawAsset)}`);
  }

  return resume;
}

export function mapHomeData(raw: unknown, locale: Locale): HomeData {
  const home = requireRecord(raw, "home", locale);
  const settings = mapSiteSettings(home.settings);
  const profile = mapProfile(home.profile);
  const topics = requireArray(home.topics, "home", locale).map(mapTopic);
  const posts = requireArray(home.posts, "home", locale).map(mapPostSummary);
  const projects = requireArray(home.projects, "home", locale).map(
    mapProjectSummary
  );
  const rawSettings = asRecord(home.settings);
  const selectedPost = rawSettings.featuredPost
    ? mapPostSummary(rawSettings.featuredPost)
    : null;
  const selectedProjects = requireArray(
    rawSettings.featuredProjects ?? [],
    "siteSettings",
    documentId(home.settings)
  ).map(mapProjectSummary);
  if (settings.locale !== locale) {
    throw invalidSanity("siteSettings", documentId(home.settings));
  }
  if (profile.locale !== locale) {
    throw invalidSanity("profile", documentId(home.profile));
  }
  posts.forEach((post) => assertMappedLocale(post, locale, "post"));
  projects.forEach((project) =>
    assertMappedLocale(project, locale, "project")
  );
  if (selectedPost) {
    assertMappedLocale(selectedPost, locale, "post");
  }
  selectedProjects.forEach((project) =>
    assertMappedLocale(project, locale, "project")
  );
  const resume = mapResume(
    home.resumeAsset,
    home.experience,
    home.education,
    locale
  );
  const candidate = {
    profile,
    featuredPost:
      selectedPost ?? posts.find((post) => post.featured) ?? null,
    featuredProjects:
      selectedProjects.length > 0
        ? selectedProjects
        : projects.filter((project) => project.featured),
    resume,
    topics,
    settings
  };

  return parseSanity(homeDataSchema, candidate, "home", locale);
}

export function mapSearchEntries(raw: unknown, locale: Locale): SearchEntry[] {
  const search = requireRecord(raw, "search", locale);
  const topics = requireArray(search.topics, "search", locale).map(mapTopic);
  const labels = new Map(topics.map((topic) => [topic.key, topic.label]));
  const posts = requireArray(search.posts, "search", locale).map(mapPost);
  const projects = requireArray(search.projects, "search", locale).map(
    mapProject
  );
  posts.forEach((post) => assertMappedLocale(post, locale, "post"));
  projects.forEach((project) =>
    assertMappedLocale(project, locale, "project")
  );

  const postEntries = posts.map((post) =>
    parseSanity(
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
          ...post.body.flatMap((block) =>
            block.children.map((span) => span.text)
          )
        ].join(" "),
        isDemo: post.isDemo
      },
      "searchEntry",
      post.id
    )
  );
  const projectEntries = projects.map((project) =>
    parseSanity(
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
      "searchEntry",
      project.id
    )
  );

  return [...postEntries, ...projectEntries];
}

export function mapTranslatedRoute(
  raw: RawTranslatedRoute | null,
  kind: "post" | "project"
): TranslatedRoute | null {
  if (!raw) {
    return null;
  }

  if (raw._type !== undefined && cleanString(raw._type) !== kind) {
    throw invalidSanity(kind, documentId(raw));
  }

  const section = kind === "post" ? "writing" : "work";
  return parseSanity(
    translatedRouteSchema,
    {
      locale: cleanString(raw.language),
      href: `/${String(cleanString(raw.language))}/${section}/${String(
        cleanString(raw.slug)
      )}`
    },
    "translatedRoute",
    documentId(raw)
  );
}
