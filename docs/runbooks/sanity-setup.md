# Sanity setup and publishing runbook

This runbook starts with the local Studio bootstrap. Production publishing, credential rotation, webhooks, and acceptance verification are added as the CMS implementation progresses.

## Local Studio bootstrap

1. Sign in with `npx sanity@6 login` and open Sanity Manage.
2. Create or select the project that will own Vincent Luu's portfolio content.
3. Create a dataset named exactly `development`. Do not use a production dataset for demonstration records.
4. Copy `.env.example` to `.env.local` and replace the public placeholders:

   ```dotenv
   CONTENT_SOURCE=demo
   NEXT_PUBLIC_SANITY_PROJECT_ID=<project-id>
   NEXT_PUBLIC_SANITY_DATASET=development
   NEXT_PUBLIC_SANITY_API_VERSION=2026-10-10
   ```

   Leave `SANITY_API_READ_TOKEN`, `SANITY_API_WRITE_TOKEN`, and `SANITY_REVALIDATE_SECRET` blank during this bootstrap. The committed example intentionally contains no usable private value.

5. In Sanity Manage, add `http://localhost:3000` as a CORS origin and enable credentialed requests for Studio authentication.
6. Restart `npm run dev`, then open `http://localhost:3000/studio`. Sign in when Sanity prompts and confirm the Studio shell loads.

The public site remains on demonstration content while `CONTENT_SOURCE=demo`. Setting `CONTENT_SOURCE=sanity` is reserved for the repository phase and will require a server-held Viewer credential.

## Private values for later publishing steps

- Create a Viewer-scoped token in Sanity Manage before switching `CONTENT_SOURCE` to `sanity`; store it only as `SANITY_API_READ_TOKEN` in `.env.local` or the deployment secret store.
- Create a separate Editor-scoped token only when running the guarded development seed command; remove `SANITY_API_WRITE_TOKEN` afterwards.
- Generate a unique webhook secret with `openssl rand -hex 32` when the revalidation endpoint is configured. Never derive it from this repository or reuse it across environments.

## Local rollback

To return to the safe demonstration preview:

1. Set `CONTENT_SOURCE=demo` in `.env.local`, or remove that line in development.
2. Stop and restart `npm run dev` so the server reloads its environment.
3. Visit `/en` and `/vi` and confirm the labelled demonstration entries render.
4. Keep the Sanity variables in `.env.local` if Studio access is still useful, or remove them to restore the explanatory `/studio` setup screen.

Never copy `.env.local`, Viewer/Editor credentials, or the webhook secret into source control, issue trackers, screenshots, or chat logs.
