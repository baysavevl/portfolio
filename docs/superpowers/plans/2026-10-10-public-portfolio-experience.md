# Public Portfolio Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Deliver a complete bilingual public portfolio that runs from version-controlled demonstration content and gives Vincent an early visual preview before external CMS setup.

**Architecture:** Next.js App Router renders locale-prefixed server routes from a typed ContentRepository interface. A demo repository supplies validated English and Vietnamese content, while focused client components handle the locale control, hero interaction, and in-page search/filtering. Presentation components depend only on domain view models so the Sanity repository in the second plan can replace the demo repository without page rewrites.

**Tech Stack:** Node.js 20.9+, npm, Next.js 16.3.x, React 19, TypeScript 5, Tailwind CSS 4, next-intl 4.14.x, @portabletext/react 6.x, Zod 4, Vitest 4, Testing Library, Playwright, and axe-core.

**Spec:** docs/superpowers/specs/2026-10-10-vincent-luu-portfolio-design.md

**Plan relationship:** Phase 1 delivers the complete public experience and demonstration preview. Phase 2, docs/superpowers/plans/2026-10-10-sanity-publishing.md, depends on this plan's domain contract and public routes.

## Global Constraints

- Work in /Users/lap14894/Documents/VinhL/Code/Personal/portfolio.
- Use npm and commit package-lock.json; the installed pnpm shim is broken in this workspace.
- Require Node.js 20.9 or newer and add that floor to package.json engines.
- Use Next.js App Router with every public route prefixed by /en or /vi.
- Redirect / to the locale stored in the vincent-locale cookie, otherwise /en.
- Use Be Vietnam Pro for interface typography and Literata for article typography.
- Use only Chalk #F6F8F5, Ink #101820, Field blue #2855F5, Quiet sage #B8C8BE, and Graphite #69757F as base brand colors.
- Do not copy source, artwork, or copy from Tuanmon, FounderFolio, Paperframe, or other references.
- Mark every illustrative article and case study as demonstration content.
- Do not invent employers, employment dates, qualifications, clients, contact details, or outcome metrics.
- Keep public components independent of Sanity types and query APIs.
- Respect keyboard input, visible focus, reduced motion, semantic landmarks, and mobile touch targets.
- Do not add newsletter signup, comments, reader accounts, dark mode, lead CRM, or analytics.

## Review Focus

1. Invalid or missing locale cookies must resolve to /en without redirect loops; Task 3 adds unit and browser coverage.
2. Vietnamese search without diacritics, such as "lanh dao", must match text containing "lãnh đạo"; Task 6 pins normalization behavior.
3. A missing translated article or project must never display the other language; Task 6 verifies the locale switch goes to a localized collection notice.
4. The Operator/Observer control must remain usable by touch, keyboard, and reduced-motion users; Tasks 4 and 9 exercise all three modes.
5. Demonstration records must be visually identified and excluded from unapproved professional claims; Tasks 2, 5, and 7 assert the marker and résumé empty state.

---

## File map

### Application foundation

- package.json — scripts, dependencies, Node.js floor, and npm metadata.
- next.config.ts — Next.js and next-intl plugin configuration.
- tsconfig.json — strict TypeScript configuration and @/* alias.
- eslint.config.mjs — Next.js and TypeScript lint configuration.
- postcss.config.mjs — Tailwind CSS PostCSS integration.
- vitest.config.ts — jsdom unit/component test configuration.
- vitest.setup.ts — Testing Library matchers and cleanup.
- playwright.config.ts — browser test configuration and local web server.
- src/proxy.ts — cookie-aware root redirect and locale-prefixed request handling.

### Internationalization and routing

- src/i18n/routing.ts — supported locales and next-intl routing definition.
- src/i18n/request.ts — locale message loading.
- src/i18n/navigation.ts — locale-aware Link and navigation helpers.
- src/i18n/locale.ts — locale guards, cookie interpretation, and route helpers.
- messages/en.json — English interface copy.
- messages/vi.json — Vietnamese interface copy.

### Content boundary and demonstration data

- src/lib/content/types.ts — public domain types.
- src/lib/content/schemas.ts — Zod validation for repository output.
- src/lib/content/repository.ts — ContentRepository contract.
- src/lib/content/demo/data.ts — original bilingual demonstration records.
- src/lib/content/demo/repository.ts — locale-scoped demo repository.
- src/lib/content/index.ts — repository selection and exported loader.
- src/lib/content/search.ts — locale-aware search normalization and filtering.
- src/lib/content/translation.ts — locale switch resolution.

### UI and routes

- src/app/[locale]/layout.tsx — locale-aware root HTML shell, optimized fonts, provider, header, and footer.
- src/app/globals.css — visual system, responsive layout, and motion preferences.
- src/app/[locale]/page.tsx — localized homepage data composition.
- src/app/[locale]/writing/page.tsx — localized writing index.
- src/app/[locale]/writing/[slug]/page.tsx — article detail.
- src/app/[locale]/work/page.tsx — localized work index.
- src/app/[locale]/work/[slug]/page.tsx — case-study detail.
- src/app/[locale]/about/page.tsx — about narrative.
- src/app/[locale]/resume/page.tsx — web résumé and optional PDF action.
- src/app/[locale]/not-found.tsx — localized missing-content page.
- src/components/layout/* — header, footer, navigation, locale control, and page frame.
- src/components/home/* — homepage sections and signature hero.
- src/components/writing/* — filters, results, article body, and translation notice.
- src/components/work/* — project index and case-study sections.
- src/components/about/* — about content.
- src/components/resume/* — experience, education, and empty state.

### Discovery and verification

- src/lib/seo/metadata.ts — localized metadata helpers.
- src/lib/seo/structured-data.ts — JSON-LD builders.
- src/lib/seo/rss.ts — deterministic RSS XML builder.
- src/app/sitemap.ts — public sitemap.
- src/app/robots.ts — crawler policy.
- src/app/[locale]/feed.xml/route.ts — locale RSS route.
- src/app/[locale]/opengraph-image.tsx — generated locale social image.
- tests/e2e/public-portfolio.spec.ts — critical user journeys.
- tests/e2e/accessibility.spec.ts — axe-core and keyboard coverage.

---

### Task 1: Bootstrap the application and test harness

**Files:**
- Create: package.json
- Create: package-lock.json
- Create: next.config.ts
- Create: tsconfig.json
- Create: eslint.config.mjs
- Create: postcss.config.mjs
- Create: vitest.config.ts
- Create: vitest.setup.ts
- Create: playwright.config.ts
- Create: src/app/[locale]/layout.tsx
- Create: src/app/globals.css
- Create: src/i18n/routing.test.ts
- Create: .gitignore

**Interfaces:**
- Produces: npm scripts dev, build, start, lint, typecheck, test, test:watch, and test:e2e.
- Produces: TypeScript alias @/* mapped to src/*.
- Produces: a jsdom test environment with Testing Library matchers.
- Consumes: no earlier task.

- [ ] **Step 1: Initialize npm metadata and install runtime dependencies**

Run:

~~~bash
npm init -y
npm install next@16.3.8 react@19 react-dom@19 next-intl@4.14.9 @portabletext/react@6 zod@4
npm install -D typescript@5 @types/node@24 @types/react@19 @types/react-dom@19 tailwindcss@4 @tailwindcss/postcss@4 eslint@9 eslint-config-next@16.3.8 vitest@4 @vitejs/plugin-react@latest jsdom@latest @testing-library/react@latest @testing-library/jest-dom@latest @testing-library/user-event@latest @playwright/test@latest @axe-core/playwright@latest
~~~

Expected: package.json and package-lock.json are created and npm exits with status 0.

- [ ] **Step 2: Define scripts, engine requirements, and framework configuration**

Set package.json to include:

~~~json
{
  "name": "vincent-luu-portfolio",
  "private": true,
  "version": "0.1.0",
  "engines": {
    "node": ">=20.9.0"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
~~~

Preserve the dependency sections written by npm. Configure next.config.ts with createNextIntlPlugin from next-intl/plugin, configure @tailwindcss/postcss in postcss.config.mjs, enable strict mode and @/* in tsconfig.json, and configure Vitest with jsdom, globals, vitest.setup.ts, and the @ alias.

Create .gitignore with node_modules/, .next/, out/, coverage/, playwright-report/, test-results/, artifacts/, .env*, and an exception for !.env.example. This keeps generated screenshots and local configuration out of commits while allowing the documented environment contract in the CMS plan.

- [ ] **Step 3: Write the failing foundation test**

Create src/i18n/routing.test.ts:

~~~ts
import {describe, expect, it} from "vitest";
import {defaultLocale, isLocale, locales} from "@/i18n/locale";

describe("locale contract", () => {
  it("supports English and Vietnamese with English as default", () => {
    expect(locales).toEqual(["en", "vi"]);
    expect(defaultLocale).toBe("en");
  });

  it.each([
    ["en", true],
    ["vi", true],
    ["fr", false],
    ["", false],
    [undefined, false]
  ])("validates %s", (value, expected) => {
    expect(isLocale(value)).toBe(expected);
  });
});
~~~

- [ ] **Step 4: Run the test to prove the locale module is missing**

Run:

~~~bash
npm test -- src/i18n/routing.test.ts
~~~

Expected: FAIL because @/i18n/locale does not exist.

- [ ] **Step 5: Implement the locale primitives and minimal root shell**

Create src/i18n/locale.ts:

~~~ts
export const locales = ["en", "vi"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const localeCookieName = "vincent-locale";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.includes(value as Locale);
}

export function localeFromCookie(value: string | undefined): Locale {
  return isLocale(value) ? value : defaultLocale;
}
~~~

Create src/app/[locale]/layout.tsx as the root layout for localized routes. It must validate the dynamic locale, set the document language, and import globals.css:

~~~tsx
import type {ReactNode} from "react";
import {notFound} from "next/navigation";
import {isLocale, locales} from "@/i18n/locale";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function LocaleRootLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
~~~

Start globals.css with Tailwind:

~~~css
@import "tailwindcss";

:root {
  color-scheme: light;
}

* {
  box-sizing: border-box;
}

html {
  background: #f6f8f5;
}

body {
  margin: 0;
}
~~~

- [ ] **Step 6: Run foundation checks**

Run:

~~~bash
npm test -- src/i18n/routing.test.ts
npm run typecheck
npm run lint
~~~

Expected: all three commands exit 0.

- [ ] **Step 7: Commit the foundation**

~~~bash
git add package.json package-lock.json next.config.ts tsconfig.json eslint.config.mjs postcss.config.mjs vitest.config.ts vitest.setup.ts playwright.config.ts .gitignore src/app/\[locale\]/layout.tsx src/app/globals.css src/i18n/locale.ts src/i18n/routing.test.ts
git commit -m "chore(app): bootstrap portfolio foundation"
~~~

---

### Task 2: Define the content contract and demonstration repository

**Files:**
- Create: src/lib/content/types.ts
- Create: src/lib/content/schemas.ts
- Create: src/lib/content/repository.ts
- Create: src/lib/content/demo/data.ts
- Create: src/lib/content/demo/repository.ts
- Create: src/lib/content/demo/repository.test.ts
- Create: src/lib/content/index.ts

**Interfaces:**
- Consumes: Locale from src/i18n/locale.ts.
- Produces: ContentRepository, Profile, Post, PostSummary, Project, ProjectSummary, Resume, Topic, SiteSettings, HomeData, SearchEntry, and RichTextBlock.
- Produces: demoContentRepository implementing ContentRepository.
- Produces: getContentRepository() returning ContentRepository.

- [ ] **Step 1: Write failing repository behavior tests**

Create src/lib/content/demo/repository.test.ts:

~~~ts
import {describe, expect, it} from "vitest";
import {demoContentRepository} from "@/lib/content/demo/repository";

describe("demoContentRepository", () => {
  it("returns only the requested locale", async () => {
    const posts = await demoContentRepository.listPosts("vi");
    expect(posts.length).toBeGreaterThanOrEqual(3);
    expect(posts.every((post) => post.locale === "vi")).toBe(true);
  });

  it("links translated entries by translation group", async () => {
    const post = await demoContentRepository.getPost("en", "clarity-before-velocity");
    expect(post?.translationGroup).toBe("clarity-before-velocity");
    const target = await demoContentRepository.getTranslatedRoute(
      "post",
      "clarity-before-velocity",
      "vi"
    );
    expect(target).toEqual({
      locale: "vi",
      href: "/vi/writing/ro-rang-truoc-toc-do"
    });
  });

  it("returns null when a translation is intentionally absent", async () => {
    const target = await demoContentRepository.getTranslatedRoute(
      "post",
      "quiet-leadership",
      "vi"
    );
    expect(target).toBeNull();
  });

  it("marks illustrative records as demonstration content", async () => {
    const posts = await demoContentRepository.listPosts("en");
    const projects = await demoContentRepository.listProjects("en");
    expect([...posts, ...projects].every((entry) => entry.isDemo)).toBe(true);
  });
});
~~~

- [ ] **Step 2: Run the repository test and verify the missing module failure**

Run:

~~~bash
npm test -- src/lib/content/demo/repository.test.ts
~~~

Expected: FAIL because the repository files do not exist.

- [ ] **Step 3: Define focused domain types and the repository contract**

Create src/lib/content/types.ts with these exports:

~~~ts
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
~~~

Create src/lib/content/repository.ts:

~~~ts
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
~~~

- [ ] **Step 4: Add Zod schemas at the repository boundary**

Create src/lib/content/schemas.ts with strict schemas for every public view model. Use z.enum(["en", "vi"]) for locale, z.enum(topicKeys) for topics, z.string().datetime() for publishedAt, z.number().int().positive() for readingMinutes, z.string().url() for non-null external URLs, and a strict RichTextBlock schema that accepts only the declared styles, span children, and `link` mark definitions. Refine link href values to allow `https:`, `mailto:`, or root-relative paths and reject `javascript:`, protocol-relative, and all other schemes.

Expose schemas for every record that crosses the repository boundary:

~~~ts
export const topicSchema: z.ZodType<Topic>;
export const postSummarySchema: z.ZodType<PostSummary>;
export const postSchema: z.ZodType<Post>;
export const projectSummarySchema: z.ZodType<ProjectSummary>;
export const projectSchema: z.ZodType<Project>;
export const profileSchema: z.ZodType<Profile>;
export const resumeSchema: z.ZodType<Resume>;
export const siteSettingsSchema: z.ZodType<SiteSettings>;
export const homeDataSchema: z.ZodType<HomeData>;
export const searchEntrySchema: z.ZodType<SearchEntry>;
export const translatedRouteSchema: z.ZodType<TranslatedRoute>;
~~~

The demo repository must parse records through these schemas before returning them.

- [ ] **Step 5: Create original bilingual demonstration data**

Create src/lib/content/demo/data.ts with:

- all seven localized topics with accents chosen only from Field blue, Quiet sage, and Graphite;
- English and Vietnamese profiles using the approved positioning lines;
- paired articles:
  - clarity-before-velocity / ro-rang-truoc-toc-do;
  - training-is-a-product-system / tap-luyen-la-mot-he-thong-san-pham;
  - the-quiet-work-of-building / cong-viec-tham-lang-cua-nguoi-kien-tao;
- one English-only article with translationGroup quiet-leadership to exercise missing translation behavior;
- paired case studies:
  - decision-journal / nhat-ky-quyet-dinh;
  - calm-launch / ra-mat-trong-binh-tinh;
- profiles with heroInitialMode `split`;
- résumé records with an explicit message that verified professional history has not yet been supplied, empty experience, education, and capabilities arrays, and null PDF metadata;
- no contact or social URLs;
- isDemo: true on every illustrative post and project.

Represent article bodies with the RichTextBlock shape above. Use body copy that explicitly begins with “Demonstration article” or “Bài viết minh hoạ”. Use no organization names, percentages, user counts, revenue, awards, or dates presented as Vincent's facts.

- [ ] **Step 6: Implement and validate the demonstration repository**

Create src/lib/content/demo/repository.ts. Sort posts newest first, build HomeData from featured records, build SearchEntry hrefs with locale prefixes, and include title, summary, localized Topic labels, and every RichText span's text in searchableText. Resolve translations by kind plus translationGroup. Throw a descriptive Error if a record fails Zod parsing; return null only for a missing slug or missing translation.

Create src/lib/content/index.ts:

~~~ts
import type {ContentRepository} from "@/lib/content/repository";
import {demoContentRepository} from "@/lib/content/demo/repository";

export function getContentRepository(): ContentRepository {
  return demoContentRepository;
}
~~~

- [ ] **Step 7: Run repository checks**

Run:

~~~bash
npm test -- src/lib/content/demo/repository.test.ts
npm run typecheck
npm run lint
~~~

Expected: all commands exit 0.

- [ ] **Step 8: Commit the content boundary**

~~~bash
git add src/lib/content
git commit -m "feat(content): add bilingual demo repository"
~~~

---

### Task 3: Implement locale routing, messages, and the site shell

**Files:**
- Create: src/i18n/routing.ts
- Create: src/i18n/request.ts
- Create: src/i18n/navigation.ts
- Modify: src/i18n/locale.ts
- Create: src/i18n/locale.test.ts
- Create: src/proxy.ts
- Create: messages/en.json
- Create: messages/vi.json
- Modify: next.config.ts
- Modify: src/app/[locale]/layout.tsx
- Create: src/components/layout/site-header.tsx
- Create: src/components/layout/site-footer.tsx
- Create: src/components/layout/locale-switcher.tsx
- Create: src/components/layout/mobile-menu.tsx
- Create: src/components/layout/skip-link.tsx
- Create: src/components/layout/locale-switcher.test.tsx

**Interfaces:**
- Consumes: Locale, SiteSettings, and ContentRepository.
- Produces: getLocalePath(locale, section, slug?), localeFromCookie(value), and locale-aware Link.
- Produces: LocaleSwitcher props currentLocale, targetLocale, targetHref, and missingTranslation.
- Produces: the shared localized layout used by all later pages.

- [ ] **Step 1: Write failing locale helper and switcher tests**

Add src/i18n/locale.test.ts:

~~~ts
import {describe, expect, it} from "vitest";
import {getLocalePath, localeFromCookie} from "@/i18n/locale";

describe("locale navigation", () => {
  it("falls back to English for an invalid cookie", () => {
    expect(localeFromCookie("fr")).toBe("en");
    expect(localeFromCookie(undefined)).toBe("en");
  });

  it("builds locale-prefixed routes", () => {
    expect(getLocalePath("vi", "writing", "ro-rang")).toBe(
      "/vi/writing/ro-rang"
    );
    expect(getLocalePath("en", "home")).toBe("/en");
  });
});
~~~

Add src/components/layout/locale-switcher.test.tsx to render the switcher with missingTranslation true and targetHref `/vi/writing?translation=unavailable&topic=leadership`, click Vietnamese, and assert that exact destination rather than an English article URL.

- [ ] **Step 2: Run the locale tests and verify failure**

Run:

~~~bash
npm test -- src/i18n/locale.test.ts src/components/layout/locale-switcher.test.tsx
~~~

Expected: FAIL because routing helpers and the component do not exist.

- [ ] **Step 3: Configure next-intl and locale-prefixed proxy routing**

Create routing.ts with defineRouting using locales, defaultLocale, localePrefix: "always", and localeDetection: false. Create navigation.ts with createNavigation(routing). Create request.ts with getRequestConfig, hasLocale, setRequestLocale, and dynamic imports from messages.

Create src/proxy.ts. The explicit root branch reads only the supported custom cookie values; all other public paths pass through next-intl:

~~~ts
import createMiddleware from "next-intl/middleware";
import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";
import {routing} from "@/i18n/routing";
import {localeCookieName, localeFromCookie} from "@/i18n/locale";

const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    const locale = localeFromCookie(
      request.cookies.get(localeCookieName)?.value
    );
    return NextResponse.redirect(new URL("/" + locale, request.url));
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|studio|_next|_vercel|.*\\..*).*)"]
};
~~~

Wrap next.config.ts with createNextIntlPlugin("./src/i18n/request.ts").

- [ ] **Step 4: Implement route helpers and pin the locale cookie contract**

Extend src/i18n/locale.ts:

~~~ts
export type PublicSection =
  | "home"
  | "writing"
  | "work"
  | "about"
  | "resume";

export function getLocalePath(
  locale: Locale,
  section: PublicSection,
  slug?: string
): string {
  const base = section === "home" ? "/" + locale : "/" + locale + "/" + section;
  return slug ? base + "/" + slug : base;
}
~~~

Configure defineRouting with the same cookie contract:

~~~ts
localeCookie: {
  name: localeCookieName,
  path: "/",
  maxAge: 31_536_000,
  sameSite: "lax"
}
~~~

This keeps next-intl navigation and the explicit root branch aligned.

- [ ] **Step 5: Add complete EN and VI interface messages**

Both JSON files must expose matching keys for nav, hero, demo, writing, work, about, resume, search, translation, errors, footer, and accessibility. Required visible labels include:

~~~json
{
  "nav": {
    "work": "Work",
    "writing": "Writing",
    "about": "About",
    "resume": "Résumé",
    "menu": "Open navigation"
  },
  "demo": {
    "label": "Demonstration content"
  },
  "translation": {
    "unavailable": "This entry is not available in the selected language.",
    "backToCollection": "Browse available entries"
  }
}
~~~

The Vietnamese file uses “Công việc”, “Bài viết”, “Giới thiệu”, “Hồ sơ”, “Mở điều hướng”, “Nội dung minh hoạ”, “Nội dung này chưa có ở ngôn ngữ đã chọn.”, and “Xem nội dung hiện có”.

- [ ] **Step 6: Build the shared localized layout**

Extend the root layout in src/app/[locale]/layout.tsx:

- validate params.locale with hasLocale;
- call setRequestLocale;
- load messages and site settings;
- retain `<html lang={locale}>` and wrap the body content with NextIntlClientProvider;
- render SkipLink, SiteHeader, main id="main-content", and SiteFooter;
- expose generateStaticParams for en and vi.

SiteHeader uses the locale-aware Link exports for same-locale navigation, renders the approved name, desktop navigation, MobileMenu, and LocaleSwitcher. LocaleSwitcher uses next/link for its already locale-prefixed cross-locale target, writes vincent-locale with Path=/, Max-Age=31536000, and SameSite=Lax before navigation, and receives its exact target from the page; it does not guess translated slugs or pass an already-prefixed href back through next-intl prefixing.

- [ ] **Step 7: Run locale and shell checks**

Run:

~~~bash
npm test -- src/i18n/locale.test.ts src/components/layout/locale-switcher.test.tsx
npm run typecheck
npm run lint
~~~

Expected: all commands exit 0.

- [ ] **Step 8: Commit locale routing and shell**

~~~bash
git add next.config.ts src/proxy.ts src/i18n messages src/app/\[locale\]/layout.tsx src/components/layout
git commit -m "feat(i18n): add bilingual routing and site shell"
~~~

---

### Task 4: Build the visual system and signature hero

**Files:**
- Modify: src/app/[locale]/layout.tsx
- Modify: src/app/globals.css
- Create: src/components/home/operator-observer.tsx
- Create: src/components/home/operator-observer.test.tsx
- Create: src/components/home/silhouette-art.tsx
- Create: src/components/home/hero.tsx

**Interfaces:**
- Consumes: Profile and localized hero labels.
- Produces: OperatorObserver with labels, initialMode, and reduced-motion-safe interaction.
- Produces: Hero accepting a Profile.
- Produces: CSS utilities for editorial-grid, reading-measure, section-rule, and focus-ring.

- [ ] **Step 1: Write failing interaction tests**

Create operator-observer.test.tsx:

~~~tsx
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {describe, expect, it} from "vitest";
import {OperatorObserver} from "@/components/home/operator-observer";

describe("OperatorObserver", () => {
  it("switches modes with focusable controls", async () => {
    const user = userEvent.setup();
    render(
      <OperatorObserver
        operatorLabel="Operator"
        observerLabel="Observer"
      />
    );

    const observer = screen.getByRole("button", {name: "Observer"});
    await user.click(observer);
    expect(observer).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("img", {name: "Abstract Observer silhouette"})
    ).toBeVisible();
  });

  it("exposes a named range control for pointer and keyboard input", () => {
    render(
      <OperatorObserver
        operatorLabel="Operator"
        observerLabel="Observer"
      />
    );
    expect(
      screen.getByRole("slider", {name: "Reveal Operator or Observer"})
    ).toBeVisible();
  });
});
~~~

- [ ] **Step 2: Run the hero test and verify failure**

Run:

~~~bash
npm test -- src/components/home/operator-observer.test.tsx
~~~

Expected: FAIL because OperatorObserver does not exist.

- [ ] **Step 3: Load the approved fonts and visual variables**

Use Be_Vietnam_Pro and Literata from next/font/google in src/app/[locale]/layout.tsx with display: "swap", variable names --font-interface and --font-reading, and Vietnamese plus Latin subsets where supported.

Expand globals.css with:

~~~css
:root {
  --chalk: #f6f8f5;
  --ink: #101820;
  --field-blue: #2855f5;
  --quiet-sage: #b8c8be;
  --graphite: #69757f;
  --font-interface: "Be Vietnam Pro", sans-serif;
  --font-reading: "Literata", serif;
  --content-max: 80rem;
  --reading-max: 70ch;
}

body {
  background: var(--chalk);
  color: var(--ink);
  font-family: var(--font-interface);
  text-rendering: optimizeLegibility;
}

:focus-visible {
  outline: 3px solid var(--field-blue);
  outline-offset: 4px;
}

.reading-measure {
  max-width: var(--reading-max);
  font-family: var(--font-reading);
  line-height: 1.75;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
~~~

Add an asymmetric twelve-column editorial-grid at desktop widths, a single reading column on small screens, and section spacing rules without gradients, card shadows, or repeated rounded containers.

- [ ] **Step 4: Implement the original silhouette asset**

SilhouetteArt renders one SVG with role="img", a localized accessible name, and two groups:

- operator layer: graphite head-and-shoulders geometry, product map lines, decision nodes, and a Field blue vertical reveal boundary;
- observer layer: Field blue geometry, breathing rings, a running track curve, and handwritten-style path marks drawn as SVG paths rather than text.

Use clipPath widths controlled by the CSS custom property --reveal. Do not embed a raster portrait, copied icon, or third-party artwork.

- [ ] **Step 5: Implement the shared interaction**

OperatorObserver owns reveal state from 0 through 100 and maps initialMode to 0, 100, or 50. The range input updates reveal on input, pointer movement maps the pointer x-position within the art frame, and the two buttons set 0 or 100. Buttons expose aria-pressed. The SVG accessible name changes with the selected endpoint. Do not animate when matchMedia("(prefers-reduced-motion: reduce)") matches.

Hero renders the name, descriptor, localized positioning, introduction, primary links to Writing and Work, and OperatorObserver initialized from Profile.heroInitialMode in the asymmetric desktop grid.

- [ ] **Step 6: Run hero and static checks**

Run:

~~~bash
npm test -- src/components/home/operator-observer.test.tsx
npm run typecheck
npm run lint
~~~

Expected: all commands exit 0.

- [ ] **Step 7: Commit the visual system**

~~~bash
git add src/app/\[locale\]/layout.tsx src/app/globals.css src/components/home
git commit -m "feat(hero): add mindful builder visual identity"
~~~

---

### Task 5: Compose the homepage

**Files:**
- Create: src/components/home/home-view.tsx
- Create: src/components/home/home-view.test.tsx
- Create: src/components/home/latest-field-note.tsx
- Create: src/components/home/current-questions.tsx
- Create: src/components/home/selected-work.tsx
- Create: src/components/home/career-preview.tsx
- Create: src/components/home/principles.tsx
- Create: src/components/content/demo-badge.tsx
- Create: src/app/[locale]/page.tsx

**Interfaces:**
- Consumes: HomeData and Hero from Tasks 2 and 4.
- Produces: HomeView(data: HomeData) and the /en and /vi home routes.
- Produces: DemoBadge reused by Writing and Work.

- [ ] **Step 1: Write the failing homepage view test**

Create home-view.test.tsx:

~~~tsx
import {render, screen} from "@testing-library/react";
import {describe, expect, it} from "vitest";
import {HomeView} from "@/components/home/home-view";
import {demoContentRepository} from "@/lib/content/demo/repository";

describe("HomeView", () => {
  it("presents positioning, writing, work, and a truthful resume state", async () => {
    const data = await demoContentRepository.getHome("en");
    render(<HomeView data={data} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "I build products, teams, and ideas that compound."
      })
    ).toBeVisible();
    expect(screen.getByRole("heading", {name: "Latest field note"})).toBeVisible();
    expect(screen.getByRole("heading", {name: "Selected work"})).toBeVisible();
    expect(screen.getByText("Demonstration content")).toBeVisible();
    expect(
      screen.getByText(/verified professional history has not yet been supplied/i)
    ).toBeVisible();
  });
});
~~~

- [ ] **Step 2: Run the homepage test and verify failure**

Run:

~~~bash
npm test -- src/components/home/home-view.test.tsx
~~~

Expected: FAIL because HomeView does not exist.

- [ ] **Step 3: Implement the homepage progression**

HomeView renders in this order:

1. Hero
2. LatestFieldNote with title, summary, topics, reading time, and DemoBadge
3. CurrentQuestions as a quiet sage editorial rail
4. SelectedWork with two non-card asymmetric rows
5. CareerPreview with the verified-history empty message when resume.experience is empty
6. Principles with concise statements
7. contact destinations only when settings.contactLinks is non-empty

Every section has a visible heading, stable id, and links with descriptive text. Do not render empty social or contact wrappers.

- [ ] **Step 4: Connect the localized server route**

src/app/[locale]/page.tsx validates the locale, calls setRequestLocale, loads getContentRepository().getHome(locale), and returns HomeView. Add generateMetadata later in Task 8; do not duplicate metadata logic here.

- [ ] **Step 5: Run homepage checks**

Run:

~~~bash
npm test -- src/components/home/home-view.test.tsx
npm run typecheck
npm run lint
~~~

Expected: all commands exit 0.

- [ ] **Step 6: Commit the homepage**

~~~bash
git add src/components/home src/components/content src/app/\[locale\]/page.tsx
git commit -m "feat(home): compose operator field notes homepage"
~~~

---

### Task 6: Build Writing, search, article reading, and translation behavior

**Files:**
- Create: src/lib/content/search.ts
- Create: src/lib/content/search.test.ts
- Create: src/lib/content/translation.ts
- Create: src/lib/content/translation.test.ts
- Create: src/components/writing/writing-index.tsx
- Create: src/components/writing/writing-index.test.tsx
- Create: src/components/writing/search-controls.tsx
- Create: src/components/writing/article-view.tsx
- Create: src/components/writing/article-body.tsx
- Create: src/components/writing/article-body.test.tsx
- Create: src/components/writing/table-of-contents.tsx
- Create: src/components/writing/translation-notice.tsx
- Create: src/app/[locale]/writing/page.tsx
- Create: src/app/[locale]/writing/[slug]/page.tsx

**Interfaces:**
- Consumes: Post, PostSummary, Topic, SearchEntry, TranslatedRoute, ContentRepository, DemoBadge, and LocaleSwitcher.
- Produces: normalizeSearchText(text), filterSearchEntries(entries, query, topic), and resolveLocaleSwitch(input).
- Produces: WritingIndex and ArticleView.

- [ ] **Step 1: Write failing search and translation tests**

Create search.test.ts:

~~~ts
import {describe, expect, it} from "vitest";
import {filterSearchEntries, normalizeSearchText} from "@/lib/content/search";
import type {SearchEntry} from "@/lib/content/types";

const entry: SearchEntry = {
  id: "vi-leadership",
  locale: "vi",
  kind: "post",
  href: "/vi/writing/ro-rang-truoc-toc-do",
  title: "Lãnh đạo bằng sự rõ ràng",
  summary: "Một bài viết minh hoạ.",
  topics: ["leadership"],
  searchableText: "lãnh đạo rõ ràng sản phẩm",
  isDemo: true
};

describe("search", () => {
  it("normalizes Vietnamese diacritics", () => {
    expect(normalizeSearchText("Lãnh đạo")).toBe("lanh dao");
  });

  it("intersects text and topic filters", () => {
    expect(
      filterSearchEntries([entry], "lanh dao", "leadership")
    ).toHaveLength(1);
    expect(filterSearchEntries([entry], "lanh dao", "sport")).toHaveLength(0);
  });
});
~~~

Create translation.test.ts with a direct counterpart case and a missing counterpart case that returns /vi/writing?translation=unavailable&topic=leadership.

Create article-body.test.tsx with one paragraph containing strong and emphasis spans, one safe root-relative link, one H2, and one blockquote. Assert semantic elements and the link render. Add a malformed/unsafe link fixture and assert the content schema rejects it before rendering.

- [ ] **Step 2: Run the tests and verify failure**

Run:

~~~bash
npm test -- src/lib/content/search.test.ts src/lib/content/translation.test.ts src/components/writing/article-body.test.tsx
~~~

Expected: FAIL because the search and translation helpers do not exist.

- [ ] **Step 3: Implement deterministic search and locale-switch helpers**

normalizeSearchText must call normalize("NFD"), remove combining marks with /[\u0300-\u036f]/g, map đ to d, lowercase, collapse punctuation into spaces, and trim.

filterSearchEntries:

~~~ts
export function filterSearchEntries(
  entries: SearchEntry[],
  query: string,
  topic: TopicKey | "all"
): SearchEntry[] {
  const normalizedQuery = normalizeSearchText(query);
  return entries.filter((entry) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      normalizeSearchText(entry.searchableText).includes(normalizedQuery);
    const matchesTopic = topic === "all" || entry.topics.includes(topic);
    return matchesQuery && matchesTopic;
  });
}
~~~

resolveLocaleSwitch returns the translated href when present. If absent, it returns the target locale's same collection with translation=unavailable and the entry's first Topic key so the collection can preserve context. Home, About, and Résumé always switch to the same section.

- [ ] **Step 4: Build WritingIndex and shareable controls**

SearchControls is a client component initialized from q and topic search parameters. It updates the URL with router.replace, uses a labeled search input, uses topic buttons with aria-pressed, and announces the result count through aria-live="polite".

WritingIndex receives the already locale-scoped entries and topics. With no active query or topic filter, it renders a Featured section followed by the remaining entries in reverse chronological order. With either filter active, it renders one relevance-neutral filtered result list while retaining chronological order. It renders TranslationNotice when translation=unavailable, then controls and results. An empty result states what filters are active and offers a Reset filters button.

- [ ] **Step 5: Build the article reading view**

ArticleBody renders the validated block array with `PortableText` from @portabletext/react and an explicit component map for normal paragraphs, H2, blockquotes, strong, emphasis, and safe links. Unknown block, mark, and type handlers render nothing and report a development-only warning without serializing content. It never uses `dangerouslySetInnerHTML`. TableOfContents derives links only from H2 blocks by joining their span text, creates deterministic collision-safe IDs, and is hidden when fewer than two headings exist. ArticleView includes:

- title, summary, date, reading time, topics, and DemoBadge;
- a reading-measure body;
- the locale switch target resolved by the server page;
- related entries sharing at least one topic;
- a back link to the localized Writing index.

Do not render raw HTML.

- [ ] **Step 6: Connect server routes and missing-content behavior**

The Writing index loads listSearchEntries and topics. The article route loads getPost, calls notFound() when null, looks up the target locale through getTranslatedRoute, and passes the exact result to LocaleSwitcher. Add generateStaticParams from demo entries for both locales.

- [ ] **Step 7: Run Writing checks**

Run:

~~~bash
npm test -- src/lib/content/search.test.ts src/lib/content/translation.test.ts src/components/writing/article-body.test.tsx src/components/writing/writing-index.test.tsx
npm run typecheck
npm run lint
~~~

Expected: all commands exit 0.

- [ ] **Step 8: Commit Writing**

~~~bash
git add src/lib/content/search.ts src/lib/content/search.test.ts src/lib/content/translation.ts src/lib/content/translation.test.ts src/components/writing src/app/\[locale\]/writing
git commit -m "feat(writing): add localized editorial experience"
~~~

---

### Task 7: Build Work, About, and Résumé

**Files:**
- Create: src/components/work/work-index.tsx
- Create: src/components/work/work-index.test.tsx
- Create: src/components/work/case-study-view.tsx
- Create: src/components/work/case-study-view.test.tsx
- Create: src/components/about/about-view.tsx
- Create: src/components/about/about-view.test.tsx
- Create: src/components/resume/resume-view.tsx
- Create: src/components/resume/resume-view.test.tsx
- Create: src/app/[locale]/work/page.tsx
- Create: src/app/[locale]/work/[slug]/page.tsx
- Create: src/app/[locale]/about/page.tsx
- Create: src/app/[locale]/resume/page.tsx

**Interfaces:**
- Consumes: Project, ProjectSummary, Profile, Resume, ContentRepository, DemoBadge, and translation helpers.
- Produces: WorkIndex, CaseStudyView, AboutView, and ResumeView.

- [ ] **Step 1: Write failing content view tests**

Create tests that assert:

- CaseStudyView renders Context, Role, Key decisions, Outcome, and Reflection in the active locale.
- AboutView renders the profile introduction and principles without résumé sections.
- WorkIndex with no projects renders a localized explanation and no Studio/admin instruction.
- ResumeView with empty experience renders the verified-history message, does not render a download link when pdfUrl is null, and contains no invented organization name.

Use demoContentRepository to obtain test props instead of duplicating fixtures.

- [ ] **Step 2: Run the view tests and verify failure**

Run:

~~~bash
npm test -- src/components/work/work-index.test.tsx src/components/work/case-study-view.test.tsx src/components/about/about-view.test.tsx src/components/resume/resume-view.test.tsx
~~~

Expected: FAIL because the view components do not exist.

- [ ] **Step 3: Implement Work**

WorkIndex renders selected projects as editorial rows with title, summary, topics, and DemoBadge. When translation=unavailable and a valid topic query is present, it renders TranslationNotice followed by locale-appropriate projects sharing that topic before the rest of the collection. An empty collection renders localized public-facing copy about future case studies and links to Writing; it never exposes authoring instructions. CaseStudyView renders only the structured sections with content and provides localized collection navigation. The project detail server route returns notFound() for an unknown slug and resolves its translated route using translationGroup.

- [ ] **Step 4: Implement About**

AboutView presents name, descriptor, introduction, principles, current questions, and a short original explanation of mindful building drawn from the approved positioning. It does not manufacture a personal biography. Label all explanatory prose that was not supplied by Vincent as demonstration copy.

- [ ] **Step 5: Implement Résumé**

ResumeView renders summary, experience, education, capabilities, and the optional PDF link with pdfLabel and effectiveDate. When arrays are empty, render the localized verified-history message once. When pdfUrl is null, omit the PDF action rather than disabling it.

- [ ] **Step 6: Connect the four localized routes**

Each server route validates locale, loads the relevant repository method, and passes locale-specific data to its view. The Work detail route generates static params for demo projects.

- [ ] **Step 7: Run content page checks**

Run:

~~~bash
npm test -- src/components/work/work-index.test.tsx src/components/work/case-study-view.test.tsx src/components/about/about-view.test.tsx src/components/resume/resume-view.test.tsx
npm run typecheck
npm run lint
~~~

Expected: all commands exit 0.

- [ ] **Step 8: Commit content pages**

~~~bash
git add src/components/work src/components/about src/components/resume src/app/\[locale\]/work src/app/\[locale\]/about src/app/\[locale\]/resume
git commit -m "feat(pages): add work about and resume"
~~~

---

### Task 8: Add metadata, structured data, sitemap, RSS, and social images

**Files:**
- Create: src/lib/seo/metadata.ts
- Create: src/lib/seo/metadata.test.ts
- Create: src/lib/seo/structured-data.ts
- Create: src/lib/seo/structured-data.test.ts
- Create: src/lib/seo/rss.ts
- Create: src/lib/seo/rss.test.ts
- Create: src/components/seo/json-ld.tsx
- Create: src/app/sitemap.ts
- Create: src/app/robots.ts
- Create: src/app/[locale]/feed.xml/route.ts
- Create: src/app/[locale]/opengraph-image.tsx
- Modify: every public page route to export localized generateMetadata.

**Interfaces:**
- Consumes: SiteSettings, Profile, Post, Project, PostSummary, and ContentRepository.
- Produces: buildPageMetadata, buildAlternates, buildPersonJsonLd, buildArticleJsonLd, buildCreativeWorkJsonLd, buildBreadcrumbJsonLd, and buildRssXml.
- Produces: public sitemap, robots policy, feeds, and generated social cards.

- [ ] **Step 1: Write failing discovery tests**

Tests must assert:

- a paired article includes canonical and both hreflang alternates;
- an unpaired article includes only its own locale alternate;
- Person JSON-LD identifies Vincent Luu and contains no unapproved employer;
- RSS escapes ampersands and emits only the requested locale;
- drafts cannot be represented because the repository contract returns published records only.

- [ ] **Step 2: Run discovery tests and verify failure**

Run:

~~~bash
npm test -- src/lib/seo
~~~

Expected: FAIL because SEO helpers do not exist.

- [ ] **Step 3: Implement metadata and structured data builders**

buildPageMetadata accepts title, description, locale, pathname, optional translatedPathname, and baseUrl. It returns canonical, languages, openGraph, and twitter metadata. Read baseUrl from NEXT_PUBLIC_SITE_URL with http://localhost:3000 as the development default.

JSON-LD builders return plain serializable objects. JsonLd renders JSON.stringify(data).replace(/</g, "\\u003c") inside script type="application/ld+json".

- [ ] **Step 4: Implement deterministic RSS**

buildRssXml accepts locale, siteUrl, title, description, and PostSummary[]. Sort newest first, escape XML entities, and output RFC 822 dates. The feed route returns application/rss+xml; charset=utf-8.

- [ ] **Step 5: Implement sitemap, robots, and social image**

sitemap.ts lists every public home, collection, article, project, About, and Résumé route supplied by the repository. robots.ts allows public routes and disallows /studio, /api/draft-mode, and /api/revalidate. The generated social image uses Chalk, Ink, Field blue, Vincent Luu, The Mindful Builder, and the active locale label; it does not fetch remote images.

- [ ] **Step 6: Attach metadata and JSON-LD**

Add generateMetadata to each route using repository data. Article pages render Article plus BreadcrumbList JSON-LD. Project pages render CreativeWork plus BreadcrumbList. Home renders Person plus WebSite.

- [ ] **Step 7: Run discovery checks**

Run:

~~~bash
npm test -- src/lib/seo
npm run typecheck
npm run lint
~~~

Expected: all commands exit 0.

- [ ] **Step 8: Commit discovery features**

~~~bash
git add src/lib/seo src/components/seo src/app/sitemap.ts src/app/robots.ts src/app/\[locale\]
git commit -m "feat(seo): add localized discovery metadata"
~~~

---

### Task 9: Add localized error states and complete browser verification

**Files:**
- Create: src/app/[locale]/not-found.tsx
- Create: src/app/[locale]/error.tsx
- Create: src/components/layout/error-panel.tsx
- Modify: playwright.config.ts
- Create: tests/e2e/public-portfolio.spec.ts
- Create: tests/e2e/accessibility.spec.ts
- Create: tests/e2e/responsive.spec.ts
- Create: README.md

**Interfaces:**
- Consumes: all public routes and components.
- Produces: localized 404 and recoverable runtime error UI.
- Produces: end-to-end evidence for routing, search, translation, hero interaction, accessibility, and responsive layout.

- [ ] **Step 1: Write failing browser journeys**

public-portfolio.spec.ts covers:

~~~ts
import {expect, test} from "@playwright/test";

test("defaults to English and remembers Vietnamese", async ({page}) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
  await page.getByRole("link", {name: "VI"}).click();
  await expect(page).toHaveURL(/\/vi$/);
  await page.goto("/");
  await expect(page).toHaveURL(/\/vi$/);
});

test("searches Vietnamese without diacritics", async ({page}) => {
  await page.goto("/vi/writing");
  await page.getByRole("searchbox").fill("lanh dao");
  await expect(
    page.getByRole("link", {name: /Rõ ràng trước tốc độ/i})
  ).toBeVisible();
});

test("does not substitute a missing translation", async ({page}) => {
  await page.goto("/en/writing/quiet-leadership");
  await page.getByRole("link", {name: "VI"}).click();
  await expect(page).toHaveURL(
    /\/vi\/writing\?translation=unavailable&topic=leadership/
  );
  await expect(page.getByText(/chưa có ở ngôn ngữ/i)).toBeVisible();
});
~~~

Add a hero test that focuses the range control, presses End, and confirms Observer is selected.

- [ ] **Step 2: Add accessibility and responsive tests**

accessibility.spec.ts runs AxeBuilder on /en, /vi, /en/writing, one article, /en/work, /en/about, and /en/resume and expects zero serious or critical violations. It also tabs through skip link, primary navigation, locale switch, and hero control.

responsive.spec.ts uses 375x812, 768x1024, 1440x900, and 1920x1080 viewports. At each size it asserts documentElement.scrollWidth equals clientWidth and primary content remains visible. At mobile width it opens the menu and navigates to Writing.

- [ ] **Step 3: Run browser tests to verify missing error pages or interaction gaps**

Run:

~~~bash
npx playwright install chromium
npm run dev
~~~

In a second terminal:

~~~bash
npm run test:e2e
~~~

Expected before the step is complete: at least the unknown-route and error-state assertions fail until Step 4 is implemented.

- [ ] **Step 4: Implement localized 404 and runtime error UI**

not-found.tsx provides localized copy and links to Home, Writing, and Work. error.tsx is a client component that reports a plain localized message and exposes Try again through reset plus a Home link. ErrorPanel receives title, description, actionLabel, and action callbacks; it does not expose stack traces.

- [ ] **Step 5: Document local preview commands**

README.md must include:

~~~bash
npm install
npm run dev
npm test
npm run test:e2e
npm run build
~~~

Document http://localhost:3000, /en, /vi, and that this phase uses demonstration content. State that CMS setup is covered by docs/superpowers/plans/2026-10-10-sanity-publishing.md.

- [ ] **Step 6: Run the complete verification suite**

Run in this order:

~~~bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
git diff --check
~~~

Expected: every command exits 0, browser tests report zero failures, and the production build lists all intended routes.

- [ ] **Step 7: Review the served site visually**

Start npm run dev, inspect the homepage, Writing, article, Work, About, and Résumé at 375x812 and 1440x900, and capture screenshots in artifacts/public-preview/. Confirm:

- the hero is the single dominant visual moment;
- Vietnamese diacritics render correctly;
- article measure remains between 65 and 72 characters;
- no section resembles a repeated SaaS card grid;
- mobile navigation and touch controls remain usable;
- no demonstration record reads as a factual career claim.

- [ ] **Step 8: Commit public experience verification**

~~~bash
git add src/app/\[locale\]/not-found.tsx src/app/\[locale\]/error.tsx src/components/layout/error-panel.tsx playwright.config.ts tests README.md
git commit -m "test(app): verify public portfolio experience"
~~~
