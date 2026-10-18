import type {Locale} from "@/i18n/locale";

export interface RawSeo {
  title: string;
  description: string;
}

export interface RawLink {
  label: string;
  href: string;
}

export interface RawImage {
  alt: string;
  caption?: string | null;
  asset: {
    _id: string;
    url: string;
    metadata?: {
      dimensions?: {
        width: number;
        height: number;
        aspectRatio?: number;
      } | null;
      lqip?: string | null;
    } | null;
  };
}

export interface RawRichTextSpan {
  _key: string;
  _type: string;
  text: string;
  marks: string[];
}

export interface RawRichTextMarkDef {
  _key: string;
  _type: string;
  href: string;
}

export interface RawRichTextBlock {
  _key: string;
  _type: string;
  style: string;
  children: RawRichTextSpan[];
  markDefs: RawRichTextMarkDef[];
}

export interface RawPost {
  _id: string;
  language: string;
  translationGroup: string;
  slug: string;
  title: string;
  summary: string;
  topics: string[];
  publishedAt: string;
  featured: boolean;
  isDemo: boolean;
  body: RawRichTextBlock[];
  coverImage?: RawImage | null;
  seo: RawSeo;
}

export interface RawProject {
  _id: string;
  language: string;
  translationGroup: string;
  slug: string;
  title: string;
  summary: string;
  topics: string[];
  context: string;
  role: string;
  decisions: string[];
  outcome: string;
  reflection: string;
  media?: RawImage[] | null;
  links?: RawLink[] | null;
  dateRange?: string;
  sortOrder?: number;
  featured: boolean;
  isDemo: boolean;
  seo: RawSeo;
}

export interface RawSiteSettings {
  _id: string;
  language: string;
  footerNote: string;
  socialLinks: RawLink[];
  contactLinks: RawLink[];
  seo: RawSeo;
  featuredPost?: RawPost | null;
  featuredProjects?: RawProject[] | null;
}

export interface RawProfile {
  _id: string;
  language: string;
  name: string;
  descriptor: string;
  positioning: string;
  introduction: string;
  heroInitialMode: string;
  currentQuestions: string[];
  principles: Array<{title: string; description: string}>;
}

export interface RawTopic {
  _id: string;
  key: string;
  label: string;
  description: string;
  accent: string;
}

export interface RawExperience {
  _id: string;
  language: string;
  organization: string;
  role: string;
  location?: string | null;
  dateRange: string;
  description: string;
  achievements: string[];
}

export interface RawEducation {
  _id: string;
  language: string;
  institution: string;
  program: string;
  dateRange: string;
  notes?: string | null;
}

export interface RawResumeAsset {
  _id: string;
  language: string;
  summary: string;
  capabilities: string[];
  pdfUrl?: string | null;
  pdfLabel?: string | null;
  effectiveDate?: string | null;
}

export interface RawTranslatedRoute {
  _id: string;
  _type?: "post" | "project";
  language: string;
  slug: string;
}

export interface RawSearchData {
  posts: RawPost[];
  projects: RawProject[];
  topics: RawTopic[];
}

export interface RawHomeData {
  settings: RawSiteSettings | null;
  profile: RawProfile | null;
  topics: RawTopic[];
  posts: RawPost[];
  projects: RawProject[];
  resumeAsset: RawResumeAsset | null;
  experience: RawExperience[];
  education: RawEducation[];
}

export type RawLocalizedDocument = {language: Locale | string};
