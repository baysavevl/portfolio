import type {Locale} from "@/i18n/locale";

export const topicKeys = [
  "business",
  "leadership",
  "startup",
  "technology",
  "product",
  "sport",
  "mindfulness"
] as const;

export type TopicKey = (typeof topicKeys)[number];

export interface RichTextSpan {
  _key: string;
  _type: "span";
  text: string;
  marks: string[];
}

export interface RichTextMarkDef {
  _key: string;
  _type: "link";
  href: string;
}

export interface RichTextBlock {
  _key: string;
  _type: "block";
  style: "normal" | "h2" | "blockquote";
  children: RichTextSpan[];
  markDefs: RichTextMarkDef[];
}

export interface SeoFields {
  title: string;
  description: string;
}

export interface Topic {
  key: TopicKey;
  label: string;
  description: string;
  accent: "field-blue" | "quiet-sage" | "graphite";
}

export interface Profile {
  locale: Locale;
  name: "Vincent Luu";
  descriptor: "The Mindful Builder";
  positioning: string;
  introduction: string;
  heroInitialMode: "operator" | "observer" | "split";
  currentQuestions: string[];
  principles: Array<{title: string; description: string}>;
}

export interface PostSummary {
  id: string;
  locale: Locale;
  translationGroup: string;
  slug: string;
  title: string;
  summary: string;
  topics: TopicKey[];
  publishedAt: string;
  readingMinutes: number;
  featured: boolean;
  isDemo: boolean;
}

export interface Post extends PostSummary {
  body: RichTextBlock[];
  seo: SeoFields;
}

export interface ProjectSummary {
  id: string;
  locale: Locale;
  translationGroup: string;
  slug: string;
  title: string;
  summary: string;
  topics: TopicKey[];
  featured: boolean;
  isDemo: boolean;
}

export interface Project extends ProjectSummary {
  context: string;
  role: string;
  decisions: string[];
  outcome: string;
  reflection: string;
  seo: SeoFields;
}

export interface Experience {
  id: string;
  organization: string;
  role: string;
  location: string | null;
  dateRange: string;
  description: string;
  achievements: string[];
}

export interface Resume {
  locale: Locale;
  summary: string;
  experience: Experience[];
  education: Array<{
    id: string;
    institution: string;
    program: string;
    dateRange: string;
    notes: string | null;
  }>;
  capabilities: string[];
  pdfUrl: string | null;
  pdfLabel: string | null;
  effectiveDate: string | null;
}

export interface SiteSettings {
  locale: Locale;
  footerNote: string;
  socialLinks: Array<{label: string; href: string}>;
  contactLinks: Array<{label: string; href: string}>;
  seo: SeoFields;
}

export interface HomeData {
  profile: Profile;
  featuredPost: PostSummary | null;
  featuredProjects: ProjectSummary[];
  resume: Resume;
  topics: Topic[];
  settings: SiteSettings;
}

export interface SearchEntry {
  id: string;
  locale: Locale;
  kind: "post" | "project";
  href: string;
  title: string;
  summary: string;
  topics: TopicKey[];
  searchableText: string;
  isDemo: boolean;
}

export interface TranslatedRoute {
  locale: Locale;
  href: string;
}
