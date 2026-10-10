# Vincent Luu — The Mindful Builder

A bilingual English/Vietnamese portfolio for field notes, selected work, an about page, and a verified résumé. The public experience currently uses clearly labelled demonstration content while the publishing backend is being connected.

## Local development

Use Node.js 24 LTS, then run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root remembers the visitor's language choice and redirects to one of the localized sites:

- [http://localhost:3000/en](http://localhost:3000/en)
- [http://localhost:3000/vi](http://localhost:3000/vi)

## Verification

```bash
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

The Playwright suite builds and serves the production application on port 3101 so it does not compete with the normal preview server.

## Content and publishing

All current articles, case studies, and professional-history placeholders are demonstration records rather than factual claims about Vincent. Supply verified personal content before a production launch.

The embedded Sanity Studio and independent English/Vietnamese publishing workflow are specified in [`docs/superpowers/plans/2026-10-10-sanity-publishing.md`](docs/superpowers/plans/2026-10-10-sanity-publishing.md).
