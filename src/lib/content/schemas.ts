import {z} from "zod";
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
import {topicKeys} from "@/lib/content/types";

const localeSchema = z.enum(["en", "vi"]);
const topicKeySchema = z.enum(topicKeys);
const nonEmptyStringSchema = z.string().trim().min(1);

const seoFieldsSchema = z
  .object({
    title: nonEmptyStringSchema,
    description: nonEmptyStringSchema
  })
  .strict();

const safeRichTextHrefSchema = z.string().refine(
  (href) => {
    if (href.startsWith("/")) {
      return !href.startsWith("//");
    }

    try {
      const url = new URL(href);
      return url.protocol === "https:" || url.protocol === "mailto:";
    } catch {
      return false;
    }
  },
  {message: "Link must use https:, mailto:, or a root-relative path"}
);

const richTextSpanSchema = z
  .object({
    _key: nonEmptyStringSchema,
    _type: z.literal("span"),
    text: z.string(),
    marks: z.array(z.string())
  })
  .strict();

const richTextMarkDefSchema = z
  .object({
    _key: nonEmptyStringSchema,
    _type: z.literal("link"),
    href: safeRichTextHrefSchema
  })
  .strict();

export const richTextBlockSchema = z
  .object({
    _key: nonEmptyStringSchema,
    _type: z.literal("block"),
    style: z.enum(["normal", "h2", "blockquote"]),
    children: z.array(richTextSpanSchema).min(1),
    markDefs: z.array(richTextMarkDefSchema)
  })
  .strict();

export const topicSchema: z.ZodType<Topic> = z
  .object({
    key: topicKeySchema,
    label: nonEmptyStringSchema,
    description: nonEmptyStringSchema,
    accent: z.enum(["field-blue", "quiet-sage", "graphite"])
  })
  .strict();

export const postSummarySchema = z
  .object({
    id: nonEmptyStringSchema,
    locale: localeSchema,
    translationGroup: nonEmptyStringSchema,
    slug: nonEmptyStringSchema,
    title: nonEmptyStringSchema,
    summary: nonEmptyStringSchema,
    topics: z.array(topicKeySchema).min(1),
    publishedAt: z.string().datetime(),
    readingMinutes: z.number().int().positive(),
    featured: z.boolean(),
    isDemo: z.boolean()
  })
  .strict() satisfies z.ZodType<PostSummary>;

export const postSchema: z.ZodType<Post> = postSummarySchema.extend({
  body: z.array(richTextBlockSchema).min(1),
  seo: seoFieldsSchema
});

export const projectSummarySchema = z
  .object({
    id: nonEmptyStringSchema,
    locale: localeSchema,
    translationGroup: nonEmptyStringSchema,
    slug: nonEmptyStringSchema,
    title: nonEmptyStringSchema,
    summary: nonEmptyStringSchema,
    topics: z.array(topicKeySchema).min(1),
    featured: z.boolean(),
    isDemo: z.boolean()
  })
  .strict() satisfies z.ZodType<ProjectSummary>;

export const projectSchema: z.ZodType<Project> = projectSummarySchema.extend({
  context: nonEmptyStringSchema,
  role: nonEmptyStringSchema,
  decisions: z.array(nonEmptyStringSchema).min(1),
  outcome: nonEmptyStringSchema,
  reflection: nonEmptyStringSchema,
  seo: seoFieldsSchema
});

export const profileSchema: z.ZodType<Profile> = z
  .object({
    locale: localeSchema,
    name: z.literal("Vincent Luu"),
    descriptor: z.literal("The Mindful Builder"),
    positioning: nonEmptyStringSchema,
    introduction: nonEmptyStringSchema,
    heroInitialMode: z.enum(["operator", "observer", "split"]),
    currentQuestions: z.array(nonEmptyStringSchema),
    principles: z.array(
      z
        .object({
          title: nonEmptyStringSchema,
          description: nonEmptyStringSchema
        })
        .strict()
    )
  })
  .strict();

const experienceSchema = z
  .object({
    id: nonEmptyStringSchema,
    organization: nonEmptyStringSchema,
    role: nonEmptyStringSchema,
    location: nonEmptyStringSchema.nullable(),
    dateRange: nonEmptyStringSchema,
    description: nonEmptyStringSchema,
    achievements: z.array(nonEmptyStringSchema)
  })
  .strict();

const educationSchema = z
  .object({
    id: nonEmptyStringSchema,
    institution: nonEmptyStringSchema,
    program: nonEmptyStringSchema,
    dateRange: nonEmptyStringSchema,
    notes: nonEmptyStringSchema.nullable()
  })
  .strict();

export const resumeSchema: z.ZodType<Resume> = z
  .object({
    locale: localeSchema,
    summary: nonEmptyStringSchema,
    experience: z.array(experienceSchema),
    education: z.array(educationSchema),
    capabilities: z.array(nonEmptyStringSchema),
    pdfUrl: z.string().url().nullable(),
    pdfLabel: nonEmptyStringSchema.nullable(),
    effectiveDate: z.string().date().nullable()
  })
  .strict();

const publicLinkSchema = z
  .object({
    label: nonEmptyStringSchema,
    href: z.string().url()
  })
  .strict();

export const siteSettingsSchema: z.ZodType<SiteSettings> = z
  .object({
    locale: localeSchema,
    footerNote: nonEmptyStringSchema,
    socialLinks: z.array(publicLinkSchema),
    contactLinks: z.array(publicLinkSchema),
    seo: seoFieldsSchema
  })
  .strict();

export const homeDataSchema: z.ZodType<HomeData> = z
  .object({
    profile: profileSchema,
    featuredPost: postSummarySchema.nullable(),
    featuredProjects: z.array(projectSummarySchema),
    resume: resumeSchema,
    topics: z.array(topicSchema),
    settings: siteSettingsSchema
  })
  .strict();

export const searchEntrySchema: z.ZodType<SearchEntry> = z
  .object({
    id: nonEmptyStringSchema,
    locale: localeSchema,
    kind: z.enum(["post", "project"]),
    href: z.string().startsWith("/"),
    title: nonEmptyStringSchema,
    summary: nonEmptyStringSchema,
    topics: z.array(topicKeySchema).min(1),
    searchableText: nonEmptyStringSchema,
    isDemo: z.boolean()
  })
  .strict();

export const translatedRouteSchema: z.ZodType<TranslatedRoute> = z
  .object({
    locale: localeSchema,
    href: z.string().startsWith("/")
  })
  .strict();
