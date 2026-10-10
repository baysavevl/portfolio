# Sanity Publishing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Add an embedded Sanity Studio and a secure bilingual publishing workflow in which English and Vietnamese entries can be drafted, previewed, published, and unpublished independently without changing the public presentation components.

**Architecture:** The public application keeps the ContentRepository boundary from the public-portfolio plan. A Sanity adapter maps GROQ results into the same validated domain models, while an explicit content-source resolver permits demonstration fixtures only in development and test. Sanity Studio lives in its own root-layout branch at `/studio`; authenticated Draft Mode uses uncached draft queries and visual editing, while public requests use published-only tagged cache entries invalidated by a signed webhook.

**Tech Stack:** Existing Next.js 16.3.x and React 19 application, Sanity Studio 6.x, next-sanity 13.x, @sanity/document-internationalization 6.x, @sanity/vision, @sanity/image-url 2.x, Zod 4, Vitest 4, Playwright, npm, and Vercel.

**Spec:** docs/superpowers/specs/2026-10-10-vincent-luu-portfolio-design.md

**Plan relationship:** Phase 2 depends on the completed public portfolio plan and replaces its content source in configured environments without rewriting presentation components.

## Global Constraints

- Complete docs/superpowers/plans/2026-10-10-public-portfolio-experience.md first.
- Work in /Users/lap14894/Documents/VinhL/Code/Personal/portfolio.
- Keep all public React views dependent on domain models, never raw Sanity documents.
- Model English and Vietnamese versions as separate documents joined by Sanity `translation.metadata`; neither locale requires the other to publish.
- Use `language` as the document language field and restrict it to `en` or `vi`.
- Keep Topic identity shared: one Topic document has one stable key plus English and Vietnamese labels and descriptions.
- Treat `SANITY_API_READ_TOKEN`, `SANITY_API_WRITE_TOKEN`, and `SANITY_REVALIDATE_SECRET` as server-held configuration. Never expose them through `NEXT_PUBLIC_*`, logs, HTML, or committed files.
- Use a Viewer-scoped read credential for preview and published reads; use a separate write credential only for the guarded development seed command.
- Public queries use the `published` perspective and never return drafts. Draft Mode uses `drafts`, bypasses caches, and never silently falls back to published content after an authorization failure.
- In a production process, `CONTENT_SOURCE` must equal `sanity` and every required Sanity value must validate before content rendering. Demonstration data is allowed only in development and tests.
- Do not require a translated counterpart in schema validation, document actions, or publish logic.
- Do not enable bulk translation publishing in the document-internationalization plugin.
- Sanity Portable Text must not permit raw HTML. Keep version-one article blocks to paragraph, H2, blockquote, strong, emphasis, and safe links.
- Preserve the public behavior for missing translations: show the localized collection notice and never substitute content from the other locale.
- The development seed command may write only to a dataset named exactly `development`, requires `ALLOW_DEMO_SEED=true`, and writes records marked as demonstration content.
- Do not create a second admin login system; `/studio` uses Sanity authentication and permissions.

## Review Focus

1. A production process with a missing or demo content source must fail with a clear configuration error before any demonstration record can render; Task 1 pins this contract.
2. One locale must remain publicly available when its counterpart is draft, absent, or unpublished; Tasks 2, 3, and 8 verify independent publication.
3. Public data reads must use `published`, while Draft Mode must use authenticated, uncached `drafts`; Tasks 3 and 5 test the fetch policy.
4. Invalid preview activation or webhook signatures must return an access error and perform no draft read or cache invalidation; Tasks 5 and 6 test both endpoints.
5. Publishing must invalidate the changed locale's detail/collection dependencies, homepage dependencies, sitemap, RSS, and metadata while stale cached output remains available during an upstream outage; Tasks 3, 6, and 8 cover the tag map and failure behavior.

---

## File map

### Dependencies, configuration, and source selection

- package.json and package-lock.json — Sanity packages and setup scripts.
- .env.example — names and safe example values for local and deployment configuration.
- next.config.ts — Sanity image host and existing next-intl configuration.
- sanity.config.ts — embedded Studio workspace, plugins, preview URL, and schema.
- sanity.cli.ts — project and dataset selection for CLI commands.
- src/lib/content/source.ts — environment-independent content-source policy.
- src/lib/content/source.test.ts — production/demo guard coverage.
- src/lib/content/index.ts — selects the demonstration or Sanity repository.
- src/sanity/env/public.ts — validated browser-safe Sanity values.
- src/sanity/env/server.ts — validated server-only values.
- src/sanity/env/public.test.ts and server.test.ts — missing, malformed, and non-disclosure coverage.
- src/app/(studio)/layout.tsx — separate root HTML document for Studio.
- src/app/(studio)/studio/[[...tool]]/page.tsx — server-side Studio configuration gate.
- src/components/sanity/studio.tsx — client-side NextStudio mount.
- src/components/sanity/studio-setup-required.tsx — local setup state when public Sanity values are absent.
- docs/runbooks/sanity-setup.md — starts with the local Studio bootstrap and is expanded into the production runbook in later tasks.

### Content model and authoring

- src/sanity/schemaTypes/fields.ts — shared language, slug, SEO, link, and demonstration fields.
- src/sanity/schemaTypes/objects/seo.ts — SEO object schema.
- src/sanity/schemaTypes/objects/image-with-alt.ts — accessible image object.
- src/sanity/schemaTypes/objects/article-body.ts — restricted Portable Text array.
- src/sanity/schemaTypes/documents/site-settings.ts — localized navigation/contact/SEO settings.
- src/sanity/schemaTypes/documents/profile.ts — localized positioning and principles.
- src/sanity/schemaTypes/documents/topic.ts — shared topic key with localized labels.
- src/sanity/schemaTypes/documents/post.ts — independently publishable localized article.
- src/sanity/schemaTypes/documents/project.ts — independently publishable localized case study.
- src/sanity/schemaTypes/documents/experience.ts — localized résumé experience.
- src/sanity/schemaTypes/documents/education.ts — localized résumé education.
- src/sanity/schemaTypes/documents/resume-asset.ts — localized résumé summary, capabilities, and PDF.
- src/sanity/schemaTypes/index.ts — complete schema export.
- src/sanity/structure.ts — intentional Studio desk organization.
- src/sanity/schemaTypes/schema-contract.test.ts — schema names, required language fields, and independent publication constraints.

### Queries, mapping, and media

- src/sanity/lib/client.ts — configured Sanity client.
- src/sanity/lib/fetch-policy.ts — pure public/draft fetch option builder.
- src/sanity/lib/fetch-policy.test.ts — published/draft policy coverage.
- src/sanity/lib/fetch.ts — server-only Sanity fetch wrapper.
- src/sanity/lib/queries.ts — centralized GROQ queries.
- src/sanity/lib/raw-types.ts — query result types.
- src/sanity/lib/mapper.ts — raw Sanity to domain mapping.
- src/sanity/lib/mapper.test.ts — mapping and invalid-record tests.
- src/sanity/lib/repository.ts — ContentRepository implementation.
- src/sanity/lib/repository.test.ts — injected query-runner behavior tests.
- src/sanity/lib/image.ts — Sanity image URL and dimensions helper.
- src/sanity/lib/cache-tags.ts — deterministic tag generation.
- src/lib/content/types.ts and schemas.ts — optional media fields and validation.
- src/components/content/editorial-image.tsx — accessible Next Image renderer.
- Existing Writing, Work, Home, sitemap, RSS, and metadata routes — consume CMS media and Sanity repository output.

### Preview, cache invalidation, and operations

- src/sanity/presentation/resolve.ts — document-to-public-route locations.
- src/sanity/presentation/resolve.test.ts — EN/VI preview location coverage.
- src/app/api/draft-mode/enable/route.ts — authenticated preview activation.
- src/app/api/draft-mode/disable/route.ts — draft-mode exit.
- src/components/sanity/visual-editing.tsx — preview-only overlay and exit action.
- src/app/[locale]/layout.tsx — conditionally mounts preview UI.
- src/app/api/revalidate/route.ts — signed Sanity webhook endpoint.
- src/app/api/revalidate/route.test.ts — signature and tag invalidation coverage.
- scripts/seed-sanity-development.mts — guarded demonstration-data seed.
- scripts/seed-sanity-development.test.ts — dataset and opt-in guard coverage.
- docs/runbooks/sanity-setup.md — exact account, CORS, credential, webhook, and deployment steps.
- tests/e2e/sanity-publishing.spec.ts — Studio, preview, independent locale, and publish/revalidation journey.

---

### Task 1: Add Sanity dependencies, environment validation, and the Studio branch

**Files:**
- Modify: package.json
- Modify: package-lock.json
- Create: .env.example
- Create: src/lib/content/source.ts
- Create: src/lib/content/source.test.ts
- Create: src/sanity/env/public.ts
- Create: src/sanity/env/server.ts
- Create: src/sanity/env/public.test.ts
- Create: src/sanity/env/server.test.ts
- Create: sanity.config.ts
- Create: sanity.cli.ts
- Create: src/app/(studio)/layout.tsx
- Create: src/app/(studio)/studio/[[...tool]]/page.tsx
- Create: src/components/sanity/studio.tsx
- Create: src/components/sanity/studio-setup-required.tsx
- Create: docs/runbooks/sanity-setup.md

**Interfaces:**
- Consumes: demoContentRepository and ContentRepository from the first plan.
- Produces: `ContentSource`, `resolveContentSource`, `getPublicSanityEnv`, `getServerSanityEnv`, and a Studio route that remains explanatory in unconfigured development.

- [ ] **Step 1: Install the current compatible Sanity majors**

Run:

~~~bash
npm install sanity@^6.12.0 next-sanity@^13.0.0 @sanity/document-internationalization@^6.0.0 @sanity/image-url@^2.0.0 @sanity/vision@latest styled-components@^6.0.0
~~~

Expected: npm updates package.json and package-lock.json without peer-dependency errors. Keep the resolved lockfile versions; do not hand-edit package-lock.json.

- [ ] **Step 2: Write failing content-source tests**

Create src/lib/content/source.test.ts:

~~~ts
import {describe, expect, it} from "vitest";
import {resolveContentSource} from "@/lib/content/source";

describe("resolveContentSource", () => {
  it("defaults to demo outside production", () => {
    expect(resolveContentSource({}, "development")).toBe("demo");
    expect(resolveContentSource({}, "test")).toBe("demo");
  });

  it("accepts sanity when explicitly configured", () => {
    expect(
      resolveContentSource({CONTENT_SOURCE: "sanity"}, "production")
    ).toBe("sanity");
  });

  it.each([undefined, "", "demo"])(
    "rejects %s in production",
    (value) => {
      expect(() =>
        resolveContentSource({CONTENT_SOURCE: value}, "production")
      ).toThrow(/CONTENT_SOURCE=sanity/);
    }
  );

  it("rejects unknown values in every environment", () => {
    expect(() =>
      resolveContentSource({CONTENT_SOURCE: "filesystem"}, "development")
    ).toThrow(/CONTENT_SOURCE/);
  });
});
~~~

Create public.test.ts with a complete valid public configuration, invalid project ID, invalid dataset, invalid API date, and missing-variable cases. Create server.test.ts with demo development requiring no private values, sanity development requiring a Viewer read value, sanity production requiring both Viewer read and revalidation values, and revalidation lookup requiring at least 32 characters. In every failure case, assert the error names the variable but does not contain the rejected value.

- [ ] **Step 3: Run the source-policy test and verify failure**

Run:

~~~bash
npm test -- src/lib/content/source.test.ts src/sanity/env/public.test.ts src/sanity/env/server.test.ts
~~~

Expected: FAIL because the source and environment modules do not exist.

- [ ] **Step 4: Implement source and environment contracts**

Implement `resolveContentSource(env, nodeEnv)` as a pure function matching the test. Export `getContentSource()` as its process-environment wrapper.

Create .env.example with safe, non-working sample values and comments that direct developers to `.env.local`:

~~~dotenv
CONTENT_SOURCE=demo
NEXT_PUBLIC_SANITY_PROJECT_ID=project-id-from-sanity-manage
NEXT_PUBLIC_SANITY_DATASET=development
NEXT_PUBLIC_SANITY_API_VERSION=2026-10-10
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SANITY_API_READ_TOKEN=viewer-value-stored-only-in-env-local
SANITY_API_WRITE_TOKEN=editor-value-used-only-by-development-seed
SANITY_REVALIDATE_SECRET=random-value-of-at-least-32-characters
ALLOW_DEMO_SEED=false
~~~

In public.ts, use Zod to accept a project ID matching `/^[a-z0-9-]+$/`, a dataset matching `/^[a-z0-9_-]+$/`, and an ISO date API version. Expose `readPublicSanityEnv()` returning a discriminated success/error result, `hasPublicSanityEnv()`, and a throwing `getPublicSanityEnv()` so the development Studio route can show setup guidance instead of crashing and CLI/data code can still fail closed.

In server.ts, begin with `import "server-only"`; require the read credential whenever `CONTENT_SOURCE=sanity`, require the revalidation value as part of sanity production configuration and inside the webhook helper in development, keep the write credential optional outside the seed command, and never export raw process.env.

- [ ] **Step 5: Add the isolated Studio route**

Create `(studio)/layout.tsx` as a separate root layout containing `<html lang="en">`, a body with no public-site header, and metadata with `robots: {index: false, follow: false}`.

The Studio catch-all page is a Server Component. If `hasPublicSanityEnv()` is false in development, render StudioSetupRequired with the exact missing public variable names and a link to docs/runbooks/sanity-setup.md. If it is false in production, throw the configuration error instead of serving a misleading setup screen. Otherwise dynamically import the client Studio component. Studio renders `<NextStudio config={config} />` from `next-sanity/studio`.

Create initial sanity.config.ts with `basePath: "/studio"`, `structureTool()`, and `schema: {types: []}`. Read the public environment result; when it is absent, use compile-only inert values `missing-project` and `development`. The server-side Studio gate prevents that client configuration from mounting or making a request. Task 2 replaces the empty schema array and adds the custom structure in one commit. sanity.cli.ts uses the throwing accessor so every CLI command fails clearly until actual public project values exist.

Create docs/runbooks/sanity-setup.md as a complete local Studio bootstrap: sign in to Sanity, create or select a project, create the `development` dataset, copy its public project ID and dataset name into `.env.local`, add `http://localhost:3000` as a credentialed CORS origin, restart `npm run dev`, verify `/studio`, and list the exact rollback steps for returning to CONTENT_SOURCE=demo. Task 7 expands this same runbook with publishing operations.

- [ ] **Step 6: Run foundation checks**

Run:

~~~bash
npm test -- src/lib/content/source.test.ts src/sanity/env/public.test.ts src/sanity/env/server.test.ts
npm run typecheck
npm run lint
~~~

Expected: all commands exit 0. With CONTENT_SOURCE unset, `npm run dev` keeps the public demonstration preview working and `/studio` shows the setup state.

- [ ] **Step 7: Commit Sanity foundation**

~~~bash
git add package.json package-lock.json .env.example sanity.config.ts sanity.cli.ts src/lib/content/source.ts src/lib/content/source.test.ts src/sanity/env src/app/\(studio\) src/components/sanity docs/runbooks/sanity-setup.md
git commit -m "feat(cms): add guarded Sanity foundation"
~~~

---

### Task 2: Define the bilingual Sanity content model and Studio structure

**Files:**
- Create: src/sanity/schemaTypes/fields.ts
- Create: src/sanity/schemaTypes/objects/seo.ts
- Create: src/sanity/schemaTypes/objects/image-with-alt.ts
- Create: src/sanity/schemaTypes/objects/article-body.ts
- Create: src/sanity/schemaTypes/documents/site-settings.ts
- Create: src/sanity/schemaTypes/documents/profile.ts
- Create: src/sanity/schemaTypes/documents/topic.ts
- Create: src/sanity/schemaTypes/documents/post.ts
- Create: src/sanity/schemaTypes/documents/project.ts
- Create: src/sanity/schemaTypes/documents/experience.ts
- Create: src/sanity/schemaTypes/documents/education.ts
- Create: src/sanity/schemaTypes/documents/resume-asset.ts
- Create: src/sanity/schemaTypes/index.ts
- Create: src/sanity/structure.ts
- Create: src/sanity/schemaTypes/schema-contract.test.ts
- Modify: sanity.config.ts

**Interfaces:**
- Produces: schema types `siteSettings`, `profile`, `topic`, `post`, `project`, `experience`, `education`, and `resumeAsset` plus supporting object types.
- Produces: document-level EN/VI creation and translation management through `translation.metadata`.
- Consumes: public route fields and domain requirements from the first plan.

- [ ] **Step 1: Write failing schema contract tests**

The test imports `schemaTypes`, extracts document definitions, and asserts:

- the exact eight document type names are present;
- every localized document type has a hidden, read-only `language` string field;
- no localized schema validation requires a translation reference or counterpart;
- `topic` has `key`, `labels.en`, `labels.vi`, `descriptions.en`, `descriptions.vi`, and approved accent metadata rather than a document language;
- `post.body` uses `articleBody`, `post.coverImage` uses `imageWithAlt`, and `project.media` is an array of `imageWithAlt`;
- `siteSettings` can select featured Post and Project records, Profile has heroInitialMode, Experience/Education have visibility, and ResumeAsset has PDF label/effective date;
- `isDemo` exists on Post and Project and defaults to false.

- [ ] **Step 2: Run the schema test and verify failure**

Run:

~~~bash
npm test -- src/sanity/schemaTypes/schema-contract.test.ts
~~~

Expected: FAIL because the schema type modules do not exist.

- [ ] **Step 3: Implement shared fields and object schemas**

fields.ts exports:

~~~ts
export const languageField = defineField({
  name: "language",
  title: "Language",
  type: "string",
  readOnly: true,
  hidden: true,
  validation: (rule) => rule.required().custom((value) =>
    value === "en" || value === "vi" ? true : "Language must be en or vi"
  )
});
~~~

Also export reusable slug, SEO, safe external-link, featured, sort-order, and demonstration fields. A safe link must validate `https:`, `mailto:`, or a root-relative path; reject `javascript:` and protocol-relative values.

Define:

- seo: required title and description with editorial length warnings, not hard limits that block reasonable Vietnamese copy;
- imageWithAlt: required image asset plus required meaningful alt text, optional caption, and hotspot enabled;
- articleBody: blocks limited to normal, H2, and blockquote; decorators limited to strong and emphasis; annotations limited to the safe link object; no code block and no HTML field.

- [ ] **Step 4: Implement documents with truthful validation**

Every localized type includes languageField and uses its own slug/text fields. Exact required fields:

- siteSettings: language, footerNote, socialLinks, contactLinks, featuredPost reference, featuredProjects references, seo;
- profile: language, name fixed by initial value to `Vincent Luu`, descriptor fixed by initial value to `The Mindful Builder`, positioning, introduction, heroInitialMode, currentQuestions, principles;
- post: language, slug, title, summary, body, topic references, coverImage, featured, publishedAt, isDemo, seo;
- project: language, slug, title, summary, topic references, context, role, decisions, outcome, reflection, media, links, featured, dateRange, sortOrder, isDemo, seo;
- experience: language, organization, role, optional location, dateRange, description, achievements, sortOrder, visibility;
- education: language, institution, program, dateRange, optional notes, sortOrder, visibility;
- resumeAsset: language, summary, capabilities, optional PDF file, PDF label, and effective date.

Topic is not document-translated. Its key is one of business, leadership, startup, technology, product, sport, or mindfulness and must be unique. Labels and descriptions require both en and vi. Its accent metadata is restricted to Field blue, Quiet sage, or Graphite so authored accents cannot escape the approved palette.

Filter SiteSettings featured references and Post/Project topic references so editors select the intended document types; featured Post/Project references must match the SiteSettings language. Require a PDF label and effective date only when ResumeAsset has a PDF file. Do not add any validation that requires two locales. Individual document validation is sufficient for its own public route.

- [ ] **Step 5: Configure independent document internationalization**

In sanity.config.ts add:

~~~ts
documentInternationalization({
  supportedLanguages: [
    {id: "en", title: "English"},
    {id: "vi", title: "Tiếng Việt"}
  ],
  schemaTypes: [
    "siteSettings",
    "profile",
    "post",
    "project",
    "experience",
    "education",
    "resumeAsset"
  ],
  languageField: "language",
  bulkPublish: false,
  weakReferences: false,
  apiVersion: "2026-10-10"
})
~~~

Add structureTool with a custom structure that groups Brand, Writing, Work, Résumé, and Taxonomy. Hide `translation.metadata` from the ordinary document lists while retaining the plugin translation controls. Add visionTool only when NODE_ENV is not production.

- [ ] **Step 6: Run schema checks and open the local Studio shell**

Run:

~~~bash
npm test -- src/sanity/schemaTypes/schema-contract.test.ts
npm run typecheck
npm run lint
~~~

With valid development project values in .env.local, run `npm run dev`, open http://localhost:3000/studio, and confirm the type groups render and Post offers separate English and Vietnamese creation actions.

- [ ] **Step 7: Commit the authoring model**

~~~bash
git add sanity.config.ts src/sanity/schemaTypes src/sanity/structure.ts
git commit -m "feat(cms): model independent bilingual content"
~~~

---

### Task 3: Implement published queries, mapping, caching policy, and the Sanity repository

**Files:**
- Create: src/sanity/lib/client.ts
- Create: src/sanity/lib/fetch-policy.ts
- Create: src/sanity/lib/fetch-policy.test.ts
- Create: src/sanity/lib/fetch.ts
- Create: src/sanity/lib/queries.ts
- Create: src/sanity/lib/raw-types.ts
- Create: src/sanity/lib/mapper.ts
- Create: src/sanity/lib/mapper.test.ts
- Create: src/sanity/lib/repository.ts
- Create: src/sanity/lib/repository.test.ts
- Create: src/sanity/lib/cache-tags.ts
- Modify: src/lib/content/index.ts
- Modify: src/app/[locale]/writing/[slug]/page.tsx
- Modify: src/app/[locale]/work/[slug]/page.tsx
- Modify: src/app/sitemap.ts
- Modify: src/app/[locale]/feed.xml/route.ts
- Modify: localized page `generateMetadata` functions.

**Interfaces:**
- Consumes: ContentRepository and its public domain models.
- Produces: `sanityContentRepository`, `publishedSanityContentRepository`, a typed query runner, centralized GROQ, deterministic cache tags, and public/draft fetch policy.
- Preserves: null for an absent locale-specific entry and no cross-locale fallback.

- [ ] **Step 1: Write failing fetch-policy and mapper tests**

Create fetch-policy.test.ts:

~~~ts
import {describe, expect, it} from "vitest";
import {buildFetchPolicy} from "@/sanity/lib/fetch-policy";

describe("buildFetchPolicy", () => {
  it("caches only the published perspective for public traffic", () => {
    expect(buildFetchPolicy(false, ["post", "post:en"])).toEqual({
      perspective: "published",
      useCdn: true,
      stega: false,
      next: {revalidate: false, tags: ["post", "post:en"]}
    });
  });

  it("uses authenticated uncached drafts for preview", () => {
    expect(buildFetchPolicy(true, ["post", "post:en"])).toEqual({
      perspective: "drafts",
      useCdn: false,
      stega: {studioUrl: "/studio"},
      cache: "no-store"
    });
  });
});
~~~

Mapper fixtures must cover a complete Vietnamese post, a post with a Sanity image, an unpaired English post, a translated pair joined by one metadata ID, an invalid topic key, and a malformed Portable Text block.

- [ ] **Step 2: Run policy and mapper tests and verify failure**

Run:

~~~bash
npm test -- src/sanity/lib/fetch-policy.test.ts src/sanity/lib/mapper.test.ts
~~~

Expected: FAIL because the Sanity fetch and mapper modules do not exist.

- [ ] **Step 3: Implement the server-only client and fetch wrapper**

client.ts creates the Sanity client from getPublicSanityEnv with `useCdn: true` and `stega.studioUrl: "/studio"`.

fetch.ts begins with `import "server-only"` and exports two runners. `fetchSanityForRequest` checks `draftMode()`, obtains the Viewer read credential from server.ts, and applies buildFetchPolicy. `fetchPublishedSanity` never reads request state and always applies the public policy, so sitemap, RSS, metadata, and other build-time jobs cannot expose drafts or fail because a request API is unavailable. Public requests pass the credential server-side, request `published`, and attach cache tags. Draft requests pass the credential, request `drafts`, enable stega, and use `cache: "no-store"`. Throw `Preview authorization is not configured` before querying when Draft Mode is enabled without a valid Viewer credential.

- [ ] **Step 4: Define centralized GROQ queries**

Use `defineQuery` and explicit projections. Every localized public query filters `language == $locale`. Every detail query also filters `slug.current == $slug`. Never use an unrestricted document projection.

For Post and Project, derive translationGroup with:

~~~groq
"translationGroup": coalesce(
  *[_type == "translation.metadata" && references(^._id)][0]._id,
  _id
)
~~~

The translated-route query targets one `translation.metadata` document by its ID and selects `translations[language == $targetLocale][0].value->` with its language and slug. A missing reference or an unpublished target resolves to null under the published perspective.

Define separate query constants for settings, profile, topics, post list/detail, project list/detail, résumé experiences, education, resumeAsset, and translated route. Resolve featured selections from localized SiteSettings first and use per-document featured flags only when the selection is empty. Order posts by publishedAt descending and visible résumé entries by sortOrder ascending; documents with visibility false never cross the repository boundary.

- [ ] **Step 5: Map and validate every result**

mapper.ts converts Sanity `_id`, slug objects, references, asset metadata, files, and restricted Portable Text blocks into the domain models. It derives image dimensions and LQIP only when present. It passes each result through the Zod schemas from src/lib/content/schemas.ts and throws `Invalid Sanity <type> <document-id>` without logging the full record.

An absent document maps to null. A missing translated document maps to null. An invalid document is an error; do not silently remove it from a list because that would conceal an authoring problem.

- [ ] **Step 6: Implement the repository with an injected query runner**

Expose `createSanityContentRepository(runQuery)` for unit tests, `sanityContentRepository` using the request-aware runner, and `publishedSanityContentRepository` using the public-only runner. Each method chooses exact cache tags:

- settings/profile/resume: `<type>` and `<type>:<locale>`;
- lists and details: `<type>`, `<type>:<locale>`, and `translation` where translation metadata is read;
- home: all contributing type tags plus their locale-scoped forms;
- sitemap: post, project, and translation;
- search: post, project, topic, and locale-scoped equivalents.

Update src/lib/content/index.ts to export both `getContentRepository()` and `getPublishedContentRepository()`. In demo mode both return demoContentRepository. In sanity mode the first returns sanityContentRepository and the second returns publishedSanityContentRepository. Remove demo-backed `generateStaticParams` from Post and Project detail routes so CMS slugs render on demand through tagged server data. Sitemap, RSS, and every localized `generateMetadata` function must use getPublishedContentRepository; ordinary page rendering uses getContentRepository so authenticated preview can include drafts.

- [ ] **Step 7: Prove locale independence in repository tests**

Using an injected fake query runner, assert:

- listPosts("vi") never includes an English fixture;
- getPost("vi", slug) returns null while the English version is present but Vietnamese is draft/absent;
- getTranslatedRoute returns null when the target reference is unpublished;
- one published Vietnamese document works without an English metadata entry;
- all raw records pass through Zod mapping;
- query calls receive expected locale and cache tags.

Run:

~~~bash
npm test -- src/sanity/lib
npm run typecheck
npm run lint
~~~

- [ ] **Step 8: Commit the Sanity repository**

~~~bash
git add src/sanity/lib src/lib/content/index.ts src/app/\[locale\]/writing/\[slug\]/page.tsx src/app/\[locale\]/work/\[slug\]/page.tsx src/app/sitemap.ts src/app/\[locale\]/feed.xml/route.ts src/app/\[locale\]
git commit -m "feat(content): add published Sanity repository"
~~~

---

### Task 4: Add Sanity media to the public domain and presentation

**Files:**
- Modify: src/lib/content/types.ts
- Modify: src/lib/content/schemas.ts
- Modify: src/lib/content/demo/data.ts
- Modify: src/sanity/lib/raw-types.ts
- Modify: src/sanity/lib/mapper.ts
- Modify: src/sanity/lib/mapper.test.ts
- Create: src/sanity/lib/image.ts
- Create: src/components/content/editorial-image.tsx
- Create: src/components/content/editorial-image.test.tsx
- Modify: src/components/home/latest-field-note.tsx
- Modify: src/components/home/selected-work.tsx
- Modify: src/components/writing/article-view.tsx
- Modify: src/components/work/case-study-view.tsx
- Modify: next.config.ts

**Interfaces:**
- Produces: `EditorialImage` domain data with URL, alt, width, height, optional LQIP, and optional caption, plus a deliberate neutral-media rendering when an optional asset is absent.
- Extends: PostSummary with nullable coverImage and Project with media array.
- Consumes: Sanity CDN assets without exposing raw asset references to public components.

- [ ] **Step 1: Write failing domain and component tests**

Add mapper tests for a complete image and absent image. Add editorial-image.test.tsx asserting that alt, width, height, sizes, and caption are rendered. For a null image, assert a decorative neutral-media composition using approved palette variables appears without an `img`, broken-image icon, upload instruction, or admin copy. Assert an authored image with empty alt text is rejected at the adapter boundary.

- [ ] **Step 2: Run media tests and verify failure**

Run:

~~~bash
npm test -- src/sanity/lib/mapper.test.ts src/components/content/editorial-image.test.tsx
~~~

Expected: FAIL because the domain image type and component do not exist.

- [ ] **Step 3: Extend and validate domain types**

Add:

~~~ts
export interface EditorialImage {
  url: string;
  alt: string;
  width: number;
  height: number;
  lqip: string | null;
  caption: string | null;
}
~~~

Add `coverImage: EditorialImage | null` to PostSummary and `media: EditorialImage[]` to Project. Update Zod schemas, all demo entries with null or empty values, and Sanity mapping. Keep media optional in authoring where the page can render correctly without it; when an image exists, alt text is required.

- [ ] **Step 4: Configure optimized Sanity images**

Create image.ts using `@sanity/image-url` and asset metadata from the query. Generate a source URL constrained to the original dimensions and `auto("format")`; never upscale. Add `cdn.sanity.io` as an HTTPS remote pattern in next.config.ts.

EditorialImage uses next/image, the mapped intrinsic dimensions, responsive `sizes`, and blur only when LQIP is present. Render caption in `figcaption`. When image is null, render the neutral line-and-field composition with `aria-hidden="true"`. The component never reads a Sanity reference directly.

- [ ] **Step 5: Integrate media without turning the site into a card grid**

Use cover images as optional editorial accents on the featured note and article header. Render project media between the structured case-study sections. Preserve the approved asymmetric layout, silhouette hero dominance, and all-image-absent layouts.

- [ ] **Step 6: Run presentation checks**

Run:

~~~bash
npm test -- src/sanity/lib/mapper.test.ts src/components/content/editorial-image.test.tsx src/components/home/home-view.test.tsx src/components/work/case-study-view.test.tsx
npm run typecheck
npm run lint
~~~

Expected: all commands exit 0.

- [ ] **Step 7: Commit media support**

~~~bash
git add next.config.ts src/lib/content src/sanity/lib src/components/content src/components/home/latest-field-note.tsx src/components/home/selected-work.tsx src/components/writing/article-view.tsx src/components/work/case-study-view.tsx
git commit -m "feat(media): render accessible Sanity assets"
~~~

---

### Task 5: Add authenticated Draft Mode, Presentation Tool, and visual editing

**Files:**
- Create: src/sanity/presentation/resolve.ts
- Create: src/sanity/presentation/resolve.test.ts
- Create: src/app/api/draft-mode/enable/route.ts
- Create: src/app/api/draft-mode/disable/route.ts
- Create: src/components/sanity/visual-editing.tsx
- Create: src/components/sanity/disable-draft-mode.tsx
- Modify: src/app/[locale]/layout.tsx
- Modify: sanity.config.ts

**Interfaces:**
- Produces: secure preview activation, a preview exit action, click-to-edit overlays, and route locations for all public document types.
- Consumes: Viewer read credential, configured Sanity client, locale-aware public routes, and Presentation Tool.

- [ ] **Step 1: Write failing route-location tests**

Create resolve.test.ts with cases for:

- English Post -> `/en/writing/<slug>` plus `/en/writing`;
- Vietnamese Project -> `/vi/work/<slug>` plus `/vi/work`;
- Profile -> its locale homepage and About;
- Experience/Education/ResumeAsset -> its locale Résumé;
- an incomplete Post without slug -> localized Writing collection only;
- an unsupported type -> no public location.

- [ ] **Step 2: Run location tests and verify failure**

Run:

~~~bash
npm test -- src/sanity/presentation/resolve.test.ts
~~~

Expected: FAIL because the resolver does not exist.

- [ ] **Step 3: Implement Presentation Tool locations**

Implement `resolve.locations` with `defineLocations` from `sanity/presentation`. Read only `_type`, `language`, and `slug.current`; validate language with isLocale. Add `presentationTool` in sanity.config.ts with this resolver and:

~~~ts
previewUrl: {
  initial: "/en",
  previewMode: {enable: "/api/draft-mode/enable"}
}
~~~

Keep `/studio` and API routes excluded from src/proxy.ts.

- [ ] **Step 4: Implement authenticated preview activation and exit**

The enable route uses `defineEnableDraftMode` from `next-sanity/draft-mode`, the configured client, and the server-held Viewer credential. Missing configuration returns a plain 503 response; invalid Sanity preview authentication returns 401/403 and must not enable Draft Mode.

The disable route accepts POST, calls `(await draftMode()).disable()`, and redirects to `/en` unless a validated root-relative `returnTo` value is supplied. Reject absolute, protocol-relative, and non-public return paths.

- [ ] **Step 5: Mount preview-only UI**

visual-editing.tsx imports VisualEditing from `next-sanity/visual-editing`. disable-draft-mode.tsx renders a clearly visible “Exit preview” form that POSTs to the disable route and is hidden when embedded controls already provide the action.

In the localized root layout, call draftMode. Render both components only when Draft Mode is enabled and CONTENT_SOURCE is sanity. Add layout metadata that returns `robots: {index: false, follow: false}` while Draft Mode is enabled; ordinary public metadata remains page-specific. Ordinary public responses must contain neither visual-editing client code nor the preview banner.

- [ ] **Step 6: Add endpoint tests and run preview checks**

Mock defineEnableDraftMode/draftMode at the route boundary. Assert missing Viewer configuration is 503, invalid activation does not enable draft mode, unsafe returnTo becomes `/en`, and valid locale-relative returnTo is retained. Render the localized layout with Draft Mode enabled and assert noindex metadata plus preview controls; render it disabled and assert neither is present.

Run:

~~~bash
npm test -- src/sanity/presentation/resolve.test.ts src/app/api/draft-mode
npm run typecheck
npm run lint
~~~

With a configured development project, open Presentation in `/studio`, select one unpublished English Post, and confirm its English draft renders with overlays while `/vi/writing` contains no substituted English entry.

- [ ] **Step 7: Commit visual preview**

~~~bash
git add sanity.config.ts src/sanity/presentation src/app/api/draft-mode src/components/sanity src/app/\[locale\]/layout.tsx src/proxy.ts
git commit -m "feat(preview): add authenticated visual editing"
~~~

---

### Task 6: Add signed targeted revalidation and cache-resilience coverage

**Files:**
- Modify: src/sanity/lib/cache-tags.ts
- Modify: src/sanity/lib/fetch.ts
- Create: src/app/api/revalidate/route.ts
- Create: src/app/api/revalidate/route.test.ts
- Modify: src/app/robots.ts
- Modify: docs/runbooks/sanity-setup.md

**Interfaces:**
- Consumes: Sanity webhook payload `_type`, `_id`, and `language`.
- Produces: signature-verified tag invalidation with stale-while-revalidate semantics.
- Produces: no mutation and a 401 response for an invalid signature.

- [ ] **Step 1: Write failing cache-tag and webhook tests**

Test the pure tag planner with:

- Post/en -> post, post:en, translation, home:en, sitemap, rss:en;
- Project/vi -> project, project:vi, translation, home:vi, sitemap;
- Profile/vi -> profile, profile:vi, home:vi, about:vi;
- Experience/en -> experience, experience:en, resume:en;
- SiteSettings/en -> siteSettings, siteSettings:en, home:en, sitemap;
- Topic, which is shared rather than locale-scoped -> topic, topic:en, topic:vi, post, project, home:en, home:vi, sitemap;
- translation.metadata -> translation, post, project, sitemap;
- unsupported type -> an empty list.

Route tests mock `parseBody` from `next-sanity/webhook` and `revalidateTag` from `next/cache`. Assert invalid signatures return 401 with zero revalidateTag calls, malformed supported payloads return 400, unsupported types return 202 with zero invalidations, and valid payloads call each planned tag once with the `max` profile.

- [ ] **Step 2: Run webhook tests and verify failure**

Run:

~~~bash
npm test -- src/app/api/revalidate/route.test.ts
~~~

Expected: FAIL because the route and tag planner do not exist.

- [ ] **Step 3: Implement the signed endpoint**

The POST route obtains SANITY_REVALIDATE_SECRET from server.ts, then calls:

~~~ts
const {isValidSignature, body} = await parseBody<WebhookPayload>(
  request,
  revalidationValue,
  true
);
~~~

Return 503 when the server value is absent, 401 when the signature is invalid, 400 when a locale-scoped supported type has invalid locale data, and 202 for intentionally ignored document types. Topic and translation.metadata are intentionally locale-neutral. For a valid payload, call `revalidateTag(tag, "max")` for each unique planned tag and return only the tag count, never the held value or request headers.

- [ ] **Step 4: Align repository cache tags with invalidation tags**

Audit every repository method, sitemap query, RSS query, and metadata query so its tags are a subset of the planner vocabulary. Add route-specific tags only when the webhook payload can deterministically generate the same value.

The `max` profile keeps a stale entry eligible while the next request refreshes it. Public fetches have no time expiry and remain cache-backed; Draft Mode stays no-store. Add an integration-style unit test that primes a fake cache, invalidates a Post tag, makes the upstream query throw, and asserts the previously cached public value remains the served value while the refresh error is recorded without exposing it to the page.

- [ ] **Step 5: Exclude operational routes from crawlers**

Update robots.ts to disallow `/studio`, `/api/draft-mode`, and `/api/revalidate`. Verify Studio layout metadata remains noindex.

- [ ] **Step 6: Run security and cache checks**

Run:

~~~bash
npm test -- src/app/api/revalidate/route.test.ts src/sanity/lib
npm run typecheck
npm run lint
~~~

Expected: all commands exit 0 and the invalid-signature test records zero invalidations.

- [ ] **Step 7: Commit revalidation**

~~~bash
git add src/sanity/lib src/app/api/revalidate src/app/robots.ts
git commit -m "feat(cms): secure published content revalidation"
~~~

---

### Task 7: Add a safe development seed and the complete setup runbook

**Files:**
- Create: scripts/seed-sanity-development.mts
- Create: scripts/seed-sanity-development.test.ts
- Modify: package.json
- Modify: package-lock.json
- Modify: docs/runbooks/sanity-setup.md
- Modify: README.md

**Interfaces:**
- Produces: an explicitly opted-in development-only data seed derived from approved demonstration fixtures.
- Produces: an operator runbook for Sanity project creation, local configuration, CORS, credentials, webhook, Studio access, and Vercel deployment.

- [ ] **Step 1: Extract and test the seed guard before any write code**

The test imports `assertSeedAllowed` and asserts:

- dataset `development` plus ALLOW_DEMO_SEED `true` succeeds;
- dataset `production`, `prod`, an empty value, or any value other than `development` throws before a client is created;
- missing or false ALLOW_DEMO_SEED throws;
- missing write credential throws;
- the thrown errors never include the provided credential value.

- [ ] **Step 2: Run the seed guard test and verify failure**

Run:

~~~bash
npm test -- scripts/seed-sanity-development.test.ts
~~~

Expected: FAIL because the seed module does not exist.

- [ ] **Step 3: Implement idempotent development seeding**

The script imports the version-controlled demo data, converts only supported domain fields to Sanity documents, and uses deterministic IDs prefixed with `demo-`. It creates English and Vietnamese documents independently, creates v6 translation metadata items with stable random-looking `_key`, explicit `language`, and `value._ref` only for actual pairs, sets isDemo true, and never manufactures résumé facts or links.

Export assertSeedAllowed without side effects. Guard the command entry point with an `import.meta.url` comparison so importing the module in Vitest cannot run a write. When executed, call assertSeedAllowed before createClient. Configure the client with `useCdn: false` and the write credential. Use `createOrReplace` inside one transaction against only the `development` dataset. Print document counts and IDs, never document bodies or held configuration values.

Add package scripts:

~~~json
{
  "sanity:manage": "sanity manage",
  "sanity:schema:validate": "sanity schema validate",
  "sanity:seed:development": "tsx scripts/seed-sanity-development.mts"
}
~~~

Install `tsx` as a development dependency and keep the lockfile update.

- [ ] **Step 4: Write the setup runbook**

docs/runbooks/sanity-setup.md must contain this ordered procedure:

1. Sign in through `npx sanity@6 login` and create or select one project in Sanity Manage.
2. Create a dataset named `development` for the guarded seed and a dataset named `production` for approved live content.
3. Copy the actual project ID and chosen dataset into `.env.local`; set CONTENT_SOURCE=sanity only when reading Sanity.
4. Create a Viewer credential for server reads/preview and an Editor credential used only by the development seed; store both in `.env.local` and the deployment provider, never git.
5. Add `http://localhost:3000` as a credentialed CORS origin and add the final deployed origin after deployment.
6. Run `npm run sanity:schema:validate`, then start the app and confirm `/studio` authenticates.
7. Optionally seed only the development dataset by setting ALLOW_DEMO_SEED=true for one command, run `npm run sanity:seed:development`, then set it back to false.
8. Create the revalidation endpoint value with at least 32 random characters and configure a Sanity webhook to `/api/revalidate` for create, update, and delete. Use filter `_type in ["siteSettings","profile","topic","post","project","experience","education","resumeAsset","translation.metadata"]` and projection `{_type,_id,"language":coalesce(language,delta::before().language)}`.
9. Add production deployment values, set CONTENT_SOURCE=sanity, run the production build, deploy, then add the deployed Studio URL and site URL to Sanity CORS as required.
10. Verify English and Vietnamese publication independently with the acceptance journey in Task 8.

Document credential rotation, webhook replacement, content unpublish behavior, and how to return local preview to CONTENT_SOURCE=demo.

- [ ] **Step 5: Run the guard and schema checks**

Run:

~~~bash
npm test -- scripts/seed-sanity-development.test.ts
npm run sanity:schema:validate
npm run typecheck
npm run lint
~~~

Expected: all commands exit 0 when public Sanity project values point to the development dataset. Do not run the seed command during automated tests.

- [ ] **Step 6: Commit safe operations**

~~~bash
git add scripts package.json package-lock.json docs/runbooks/sanity-setup.md README.md
git commit -m "docs(cms): add safe Sanity operations runbook"
~~~

---

### Task 8: Verify authoring, independent publication, revalidation, and production behavior

**Files:**
- Create: tests/e2e/sanity-publishing.spec.ts
- Modify: playwright.config.ts
- Modify: README.md
- Modify: docs/runbooks/sanity-setup.md

**Interfaces:**
- Consumes: a configured Sanity development project, Studio-authenticated browser session, Viewer credential, webhook value, and all public routes.
- Produces: automated and manual evidence for the complete Draft → Preview → Publish → Revalidate flow.

- [ ] **Step 1: Add configuration-aware browser tests**

sanity-publishing.spec.ts must skip with one explicit message when `E2E_SANITY_ENABLED` is not `true`; it must not silently pass. When enabled it covers:

- `/studio` loads the authenticated Studio shell and is noindex;
- an unpublished English Post appears in authenticated English preview but returns 404 publicly;
- the matching Vietnamese route remains absent until that Vietnamese document itself is published;
- publishing English makes only the English route and English collection entry public;
- publishing Vietnamese later makes the Vietnamese route public and activates the direct locale switch;
- unpublishing English leaves Vietnamese public and changes the Vietnamese locale switch to the missing-translation collection notice;
- invalid preview activation does not set the Draft Mode cookie;
- invalid revalidation signature returns 401.

Use records prefixed `e2e-portfolio-` and delete only those exact records during test cleanup. Never delete by document type, wildcard, or broad query.

- [ ] **Step 2: Run all non-external checks**

Run:

~~~bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
git diff --check
~~~

Expected: all existing demonstration-mode suites pass. The Sanity E2E file reports one explicit configuration skip unless E2E_SANITY_ENABLED=true.

- [ ] **Step 3: Prove the production guard**

In a clean shell without Sanity values, run:

~~~bash
CONTENT_SOURCE=demo npm run build
~~~

Expected: non-zero exit with the documented `CONTENT_SOURCE=sanity` production guard. This is a required safety assertion, not a build failure to ignore.

- [ ] **Step 4: Complete the external configuration checkpoint**

Follow docs/runbooks/sanity-setup.md with Vincent's authenticated Sanity project. Confirm the project ID, development/production datasets, CORS origins, Viewer credential, Editor seed credential, and webhook value are stored outside git. This step requires Vincent to complete any Sanity login or account confirmation shown by the provider; no account identity is guessed or created under another name.

- [ ] **Step 5: Run the configured build and full Sanity journey**

With actual production configuration present in the environment, run:

~~~bash
CONTENT_SOURCE=sanity npm run build
E2E_SANITY_ENABLED=true CONTENT_SOURCE=sanity npm run test:e2e -- tests/e2e/sanity-publishing.spec.ts
~~~

Expected: the production build exits 0 and the publishing suite completes without skipped tests.

- [ ] **Step 6: Perform the manual editorial acceptance pass**

In Studio:

1. Create an English demonstration Post and leave Vietnamese absent.
2. Open Presentation and verify the draft, correct `/en` path, overlay links, and Exit preview action.
3. Publish English and confirm its detail, Writing, homepage when featured, RSS, sitemap, and metadata update after the signed webhook.
4. Confirm the Vietnamese public side shows no English content and its locale-switch notice is explicit.
5. Create and publish Vietnamese separately; confirm the direct counterpart link activates.
6. Unpublish either side and confirm the other remains public.
7. Prime a published route, temporarily make the Sanity API unavailable from the test environment, and confirm the most recent cached public page still serves while a fresh uncached Draft request reports an access/data error.
8. Confirm no Studio, draft, preview UI, held configuration value, or demonstration seed control appears in ordinary public HTML.

Record the date, tested document IDs, route URLs, and pass/fail result in the runbook's verification log. Do not record credential values.

- [ ] **Step 7: Run final repository checks**

Run:

~~~bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
CONTENT_SOURCE=sanity npm run build
git diff --check
git status --short
~~~

Expected: every executable check exits 0, no Sanity E2E test is skipped in the configured run, and git status contains only intentionally uncommitted local environment files ignored by git.

- [ ] **Step 8: Commit publishing verification**

~~~bash
git add tests/e2e/sanity-publishing.spec.ts playwright.config.ts README.md docs/runbooks/sanity-setup.md
git commit -m "test(cms): verify bilingual publishing workflow"
~~~
