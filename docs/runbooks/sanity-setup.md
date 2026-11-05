# Sanity setup and publishing runbook

Use Node.js 24 LTS. Keep all credentials in `.env.local` or the deployment provider; never commit them.

## Initial project setup

1. Run `npx sanity@6 login`, complete the provider sign-in, and create or select the Sanity project that owns Vincent Luu's portfolio content.
2. Create two datasets:
   - `development` for the guarded demonstration seed and authoring tests.
   - `production` for Vincent-approved live content only.
3. Copy `.env.example` to `.env.local` and configure the project ID and the dataset you intend to read:

   ```dotenv
   CONTENT_SOURCE=sanity
   NEXT_PUBLIC_SANITY_PROJECT_ID=<project-id>
   NEXT_PUBLIC_SANITY_DATASET=development
   NEXT_PUBLIC_SANITY_API_VERSION=2026-10-10
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   SANITY_API_READ_TOKEN=<viewer-token>
   SANITY_API_WRITE_TOKEN=<editor-token-used-only-for-the-seed>
   SANITY_REVALIDATE_SECRET=<at-least-32-random-characters>
   ALLOW_DEMO_SEED=false
   ```

4. Create separate API credentials in Sanity Manage:
   - A Viewer token for server reads and preview.
   - An Editor token used only by the guarded development seed. Remove it from `.env.local` after the seed completes.
5. Add `http://localhost:3000` as a credentialed CORS origin. After deployment, also add the final HTTPS site origin so the embedded `/studio` route can authenticate.
6. Run `npm run sanity:schema:validate`, start the app with `npm run dev`, then confirm `http://localhost:3000/studio` authenticates and shows the bilingual structure.

## Optional development demonstration seed

The seed is idempotent and can write only to a dataset named exactly `development`. It creates clearly labelled demonstration records and never creates professional-history facts, contact links, or résumé PDFs.

1. Confirm `.env.local` points to `development` and contains the temporary Editor token.
2. Change `ALLOW_DEMO_SEED=true`.
3. Run `npm run sanity:seed:development`.
4. Immediately restore `ALLOW_DEMO_SEED=false` and remove `SANITY_API_WRITE_TOKEN` from `.env.local`.

The command refuses `production`, `prod`, empty, or any other dataset name before creating a Sanity client.

## Revalidation webhook

1. Generate a unique secret with `openssl rand -hex 32` and save it as `SANITY_REVALIDATE_SECRET` in Sanity and the deployment environment.
2. Create a Sanity webhook for create, update, and delete events that calls:

   ```text
   https://<deployed-origin>/api/revalidate
   ```

3. Use this filter:

   ```groq
   _type in ["siteSettings","profile","topic","post","project","experience","education","resumeAsset","translation.metadata"]
   ```

4. Use this projection:

   ```groq
   {_type,_id,"language":coalesce(language,delta::before().language)}
   ```

## Vercel deployment

Configure these Production environment variables in Vercel:

```dotenv
CONTENT_SOURCE=sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=<project-id>
NEXT_PUBLIC_SANITY_DATASET=<production-or-temporary-development-preview>
NEXT_PUBLIC_SANITY_API_VERSION=2026-10-10
NEXT_PUBLIC_SITE_URL=https://<deployed-origin>
SANITY_API_READ_TOKEN=<viewer-token>
SANITY_REVALIDATE_SECRET=<same-webhook-secret>
```

Do not add `SANITY_API_WRITE_TOKEN` or `ALLOW_DEMO_SEED=true` to Vercel. A temporary public preview may read the demonstration-only `development` dataset while every record remains labelled as demonstration content; the final launch must switch to the approved `production` dataset.

After changing any Vercel variable, create a new Production deployment. Add the deployed origin to Sanity CORS, then verify `/en`, `/vi`, `/studio`, both RSS feeds, the sitemap, and one independently published language document.

## Independent English and Vietnamese publishing

English and Vietnamese records are separate Sanity documents. Either language can be published without a counterpart. Translation metadata is used only when an actual pair exists, so an unpublished counterpart never blocks the published language.

When unpublishing content:

- Unpublishing one language removes only that language from public queries.
- Remove or update its translation metadata reference if the Studio does not do so automatically.
- Keep the other language published when it remains valid.
- Trigger the webhook and verify the affected localized route, RSS feed, and sitemap entry.

## Credential rotation

1. Create the replacement Viewer token or webhook secret first.
2. Update local and Vercel environments.
3. Redeploy and verify published reads and revalidation.
4. Revoke the old credential only after verification succeeds.
5. Replace the webhook secret in Sanity and Vercel together; requests signed with the retired value must fail.

Editor tokens are temporary: create one for a development seed, run the command, then revoke or remove it.

## Local rollback

To return to the safe repository-backed demonstration preview:

1. Set `CONTENT_SOURCE=demo` in `.env.local`, or remove the variable in development.
2. Restart `npm run dev`.
3. Verify `/en` and `/vi` show the labelled demonstration entries.
4. Keep the public Sanity values if `/studio` is still needed, or remove them to restore the Studio setup screen.

Never copy `.env.local`, Viewer/Editor credentials, or the webhook secret into source control, issue trackers, screenshots, or chat logs.
