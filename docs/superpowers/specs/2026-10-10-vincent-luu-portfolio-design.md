# Vincent Luu Portfolio — Product and Experience Design

Date: 2026-10-10

## 1. Product intent

Build a bilingual personal website for **Vincent Luu — The Mindful Builder**. The site is a digital home for Vincent's work, writing, professional history, and personal point of view.

The product priorities, in order, are:

1. Establish Vincent as a thoughtful founder-operator and build a durable personal brand.
2. Create a home for writing, speaking, and ideas about business, leadership, startups, technology, product, sport, and mindfulness.
3. Support senior career opportunities by making Vincent's experience and impact easy to understand.
4. Make relevant collaboration, advisory, and consulting opportunities possible without turning the site into an agency landing page.

The primary audience is founders and leaders. Product and technology practitioners are the secondary audience. Recruiters and broader career networks are the tertiary audience.

## 2. Positioning

The public identity is:

- Name: **Vincent Luu**
- Descriptor: **The Mindful Builder**
- English positioning line: **I build products, teams, and ideas that compound.**
- Vietnamese positioning line: **Tôi xây sản phẩm, đội ngũ và những ý tưởng tạo giá trị lâu dài.**

The voice is practical, reflective, clear, and personal. It should communicate lived experience without self-aggrandizing language. Claims about employers, products, outcomes, and metrics must come from content supplied or approved by Vincent.

## 3. Experience concept

The selected theme is **Operator's Field Notes**: a founder's working notebook combined with a calm editorial publication.

The site borrows only high-level ideas from public references such as Tuanmon, FounderFolio, and Paperframe:

- lead with a personal mission instead of a generic job title;
- use one memorable visual moment in the hero;
- route different visitors toward writing, work, or professional history;
- explain projects through decisions, impact, and reflection;
- preserve enough whitespace and typographic discipline for long-form reading.

No reference site's artwork, copy, proprietary source, or restricted template code will be copied. The implementation will use original components, copy, and visual assets.

## 4. Visual system

### 4.1 Palette

| Design role | Value | Use |
| --- | --- | --- |
| Chalk | `#F6F8F5` | Primary page background |
| Ink | `#101820` | Primary text and high-contrast controls |
| Field blue | `#2855F5` | Brand accent, links, focus, and hero illustration |
| Quiet sage | `#B8C8BE` | Reflective content and soft surfaces |
| Graphite | `#69757F` | Metadata, captions, and structural rules |

The public site uses a light theme in version one. It does not use decorative gradients, neon effects, repeated soft-shadow cards, or a generic bento dashboard layout.

### 4.2 Typography

- **Be Vietnam Pro** is used for navigation, interface copy, headings, labels, and the hero. It was designed for Vietnamese letterforms and also reads cleanly in English.
- **Literata** is used for long-form article text, selected quotations, and reflective passages. It is optimized for sustained screen reading and supports Vietnamese.
- Article measures remain between 65 and 72 characters on desktop.
- Interface text is sentence case. All-caps eyebrows and ornamental labels are avoided.

Fonts are self-hosted or loaded through the framework's optimized font pipeline so they do not cause layout shifts.

### 4.3 Layout

The desktop experience uses an asymmetric twelve-column editorial grid. Major content is left-aligned. Sections are distinguished through spacing, proportion, and functional rules rather than repeated containers.

The homepage progression is:

1. Header and locale control
2. Mission-led hero
3. Latest field note and current questions
4. Selected case study and evidence of impact
5. Short career journey
6. Personal principles and current interests
7. Contact and social destinations

On small screens, the hero copy precedes the visual, navigation collapses into an accessible menu, content becomes a single reading column, and marginal notes move inline immediately after the paragraph they annotate.

### 4.4 Signature hero

The hero contains an original geometric silhouette rather than a photograph. It has two conceptual layers:

- **Operator** represents business, product, leadership, and building.
- **Observer** represents writing, sport, reflection, and mindfulness.

On pointer devices, dragging or hovering across the visual reveals the two layers. On touch devices, a clearly labeled toggle provides the same result. Keyboard users can operate the toggle, and reduced-motion mode replaces animated interpolation with an immediate state change.

The silhouette is built as an original SVG/CSS composition and does not imitate a real person's likeness.

## 5. Public information architecture

English is the default locale. Public URLs always include the locale:

- `/en` and `/vi`
- `/en/writing` and `/vi/writing`
- `/en/writing/[slug]` and `/vi/writing/[slug]`
- `/en/work` and `/vi/work`
- `/en/work/[slug]` and `/vi/work/[slug]`
- `/en/about` and `/vi/about`
- `/en/resume` and `/vi/resume`

The root route checks a previously saved locale cookie. If none exists, it redirects to `/en`. Changing locale updates the non-sensitive preference cookie so the server can honor it on the next root visit.

Primary navigation contains **Work**, **Writing**, **About**, **Résumé**, and **EN/VI**. The homepage logo/name returns to the active locale's homepage.

### 5.1 Home

Home introduces Vincent's positioning, features one current article, shows selected work, summarizes the professional journey, surfaces current questions or interests, and offers relevant contact destinations.

### 5.2 Writing

Writing supports:

- filtering by Business, Leadership, Startup, Technology, Product, Sport, and Mindfulness;
- locale-scoped full-text search across title, summary, and body text;
- featured and chronological views;
- article reading time, publication date, topics, and related writing;
- an RSS feed for each locale.

An article page includes the title, summary, date, reading time, topics, body, optional table of contents, related entries, and share metadata. The layout can include functional margin notes on large screens.

### 5.3 Work

Work presents selected projects and case studies. A case study follows this narrative when the relevant information exists:

1. Context and problem
2. Vincent's role
3. Constraints and key decisions
4. What was built or changed
5. Evidence of impact
6. Reflection and lessons

Missing confidential or unavailable details are omitted rather than replaced with invented claims.

### 5.4 About

About explains Vincent's story, working principles, values, interests, and the relationship between building and mindfulness. Personal topics such as sport may appear here without turning the page into a second résumé.

### 5.5 Résumé

Résumé renders structured experience, education, capabilities, selected achievements, and relevant links. Each locale can have its own downloadable PDF. The web page remains useful when no PDF has been uploaded.

## 6. Localization model

English and Vietnamese entries are separate publishable documents. A shared `translationGroup` identifier connects equivalent versions.

Publishing rules are:

- either locale may be drafted, previewed, and published independently;
- the public site never silently substitutes content from the other language;
- when a corresponding translation exists, the locale control links directly to it;
- when it does not exist, the interface explains that the translation is unavailable and links to the same content collection and topic in the selected locale;
- localized metadata, slugs, summaries, open-graph text, and body content belong to each document;
- topic identities are shared, while topic labels and descriptions are localized.

Interface messages live in version-controlled locale files. Editorial content lives in Sanity.

## 7. Content management

Sanity Studio is embedded at `/studio` and uses Sanity's authenticated access. The public website does not implement a second custom admin authentication system.

### 7.1 Content types

The schema contains:

- `siteSettings`: localized footer content, default SEO, public links, contact destinations, and featured-content selections;
- `profile`: localized biography, positioning, principles, current interests, and hero settings;
- `post`: language, translation group, slug, title, summary, body, topics, cover image, featured state, publish date, and SEO fields;
- `project`: language, translation group, slug, title, summary, structured case-study sections, media, links, featured state, date range, and SEO fields;
- `experience`: organization, role, location, date range, localized description, approved achievements, display order, and visibility;
- `education`: institution, program, date range, localized notes, display order, and visibility;
- `topic`: stable key, localized names, localized descriptions, and accent metadata;
- `resumeAsset`: locale, PDF file, label, and effective date.

Sanity's asset pipeline manages editorial images. Required fields and schema validation prevent publication of entries that cannot render correctly.

### 7.2 Editorial workflow

The workflow is:

`Draft → visual preview → editorial validation → publish → targeted revalidation → public page`

Draft preview runs through a server-only preview route. Private authorization values are never exposed in browser-delivered JavaScript. A Sanity webhook triggers tag- or path-based revalidation for the changed entry and affected collection pages.

Version one supports create, edit, delete, draft, preview, publish, unpublish, media management, ordering, and featured-content selection. It does not implement custom multi-stage approvals or custom editor roles beyond Sanity's available access controls.

## 8. Technical architecture

The application uses:

- Next.js App Router;
- React and TypeScript;
- Tailwind CSS for theme variables and layout utilities;
- Sanity Studio and Sanity Content Lake;
- framework-native image and font optimization;
- Vercel as the intended production host.

The implementation separates concerns into route composition, reusable presentation components, Sanity queries and adapters, locale messages, validation, and test fixtures. Public page components consume typed view models instead of raw Sanity documents.

A content-source boundary supports two explicit development states:

- `demo` reads version-controlled illustrative fixtures so the first local visual preview does not depend on an external account;
- `sanity` reads the configured Sanity project and enables the complete Studio, draft preview, and publishing workflow.

Production configuration requires the `sanity` source and fails validation if its required environment variables are absent. Demonstration fixtures cannot be published accidentally as production content.

No public user account, public write API, custom database, comments system, or newsletter service is included in version one.

## 9. Data flow and caching

Published content is fetched server-side from Sanity and rendered through cached server routes. The site serves the most recent valid cached version if Sanity is temporarily unavailable.

Draft mode uses authenticated, uncached queries that include draft documents. Publishing a document invalidates:

- its localized detail route;
- the related localized collection route;
- the localized homepage when the document is featured;
- sitemap, RSS, and structured metadata where relevant.

Locale preference is the only browser-stored personalization in version one. It does not contain sensitive data.

## 10. Search

Because the expected content volume is modest, version one uses a generated locale-specific search index rather than an external search service. Search covers published writing titles, summaries, topics, and normalized body text. Work can be included in results with a content-type label.

Search is keyboard accessible, returns an intentional empty state, and never exposes drafts.

## 11. Error handling and empty states

- Unknown localized routes return a localized 404 page with links to Home, Writing, and Work.
- Missing translations show a specific message and locale-appropriate alternatives.
- Missing optional images use a designed neutral media treatment without breaking layout.
- Invalid CMS data is rejected by schema validation and guarded again in the content adapter.
- If fresh CMS data cannot be loaded, production continues serving the most recent cached page.
- Empty collections explain how the section will be used; admin instructions never appear on the public site.
- Preview authentication failures return a clear access error and do not fall back to public content while claiming to show a draft.

## 12. Accessibility and responsive behavior

The quality floor includes:

- semantic headings and landmarks;
- a skip link;
- visible focus indicators;
- full keyboard operation for menus, search, filters, and the hero control;
- appropriate text and control contrast;
- meaningful alternative text authored in the CMS;
- reduced-motion support;
- no information communicated by color alone;
- touch targets suitable for mobile;
- testing at narrow mobile, tablet, laptop, and wide desktop sizes.

## 13. SEO and discovery

Every public page supplies localized titles, descriptions, canonical URLs, and social preview metadata. The site generates:

- `hreflang` links for available translations;
- a locale-aware sitemap;
- locale-specific RSS feeds;
- `Person`, `Article`, `CreativeWork`, `BreadcrumbList`, and `WebSite` structured data where appropriate;
- generated social preview images using the site's typography and visual system.

Unpublished drafts and Studio routes are excluded from indexing.

## 14. Security and privacy

- Sanity handles Studio identity and permissions.
- sensitive configuration remains in server environment variables;
- preview and revalidation endpoints verify signed server-held values;
- public Sanity queries are read-only and request only published content;
- Studio and preview routes set appropriate indexing restrictions;
- rich content rendering uses the structured Portable Text renderer and does not inject arbitrary HTML;
- version one does not collect visitor personal data through forms.

## 15. Verification strategy

Automated checks cover:

- content adapters and schema assumptions;
- locale routing, default redirect, and saved preference behavior;
- translated and untranslated locale-switch cases;
- article and project rendering from representative fixtures;
- draft exclusion from public queries;
- SEO metadata, sitemap, RSS, and structured-data generation;
- localized 404 and empty states;
- keyboard behavior for navigation, filters, search, and hero controls;
- critical responsive flows in browser tests.

Manual review covers typography and Vietnamese diacritics, color contrast, reduced motion, touch behavior, the Studio authoring flow, visual preview, publish/revalidation, and a production build.

## 16. Preview content policy

The initial local preview uses the approved name and positioning. It includes original illustrative bilingual articles and case studies that are visibly marked as demonstration content. It does not invent employers, job history, professional qualifications, business results, client names, or personal contact details.

The silhouette and all decorative marks are original assets created for this project. Contact links, résumé facts, and production claims appear only after Vincent supplies or approves them.

## 17. Version-one exclusions

The first release excludes:

- newsletter subscriptions;
- comments and reactions;
- public reader accounts;
- AI-generated translation;
- dark mode;
- advanced behavioral analytics;
- lead-management CRM functionality;
- custom editorial approval chains;
- multilingual content fallback that mixes languages on one page.

These exclusions keep the first release focused on publishing, personal positioning, bilingual discovery, and a polished reading experience.

## 18. Completion criteria

Version one is complete when:

1. All defined public routes work responsively in English and Vietnamese.
2. A Studio user can create, preview, publish, update, unpublish, and remove writing and work entries.
3. English and Vietnamese documents publish independently and switch correctly when paired.
4. The homepage, writing, work, about, and résumé experiences match the approved Operator's Field Notes direction.
5. The signature silhouette interaction works with pointer, touch, keyboard, and reduced-motion preferences.
6. Accessibility, content validation, error states, metadata, sitemap, RSS, and structured data pass their planned checks.
7. A production build succeeds with documented environment configuration.
8. Demonstration content is clearly identified and no unapproved personal claims are published.
