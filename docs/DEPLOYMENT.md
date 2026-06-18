# Deployment

## Environment Variables

Required for production:

```bash
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=strong-password
AUTH_SECRET=random-long-secret
```

Required when deploying to Vercel with durable CMS/admin edits:

```bash
CMS_STORAGE_DRIVER=supabase
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-jwt>
SUPABASE_STORAGE_BUCKET=landing-assets
```

`SUPABASE_SECRET_KEY=sb_secret_...` is also supported when the project accepts the new Supabase secret key format through the Data API. For the current AigenLabs Supabase project, `SUPABASE_SERVICE_ROLE_KEY` has been verified for server-side CMS reads/writes. Never expose either key with a `NEXT_PUBLIC_` prefix.

Recommended:

```bash
NEXT_PUBLIC_SITE_URL=https://www.aigenlabs.com
```

Also update `settings.siteUrl` in admin.

## Build

```bash
npm install
npm run type-check
npm run build
npm start
```

## Supabase setup

The project includes a local Supabase config and migration files under `supabase/`.

CLI login in this environment requires a token because non-interactive browser login is unavailable:

```bash
SUPABASE_ACCESS_TOKEN=sbp_... npm run supabase -- projects list
```

For local developer login on your own terminal:

```bash
npm run supabase -- login
```

Link the hosted project:

```bash
npm run supabase -- link --project-ref <project-ref>
```

Apply migrations:

```bash
npm run supabase -- db push
```

The migration creates:

- `public.landing_cms_documents` for the CMS JSON document.
- RLS on the CMS table.
- A public Supabase Storage bucket named `landing-assets`.
- A public read policy for `landing-assets` objects.

## Vercel setup

Use this repository as the source repo and set the Vercel project Root Directory to:

```text
landing/aigenlabs-landing
```

Use the Next.js framework preset. The default commands are:

```bash
npm install
npm run build
```

Set all production environment variables in Vercel Project Settings before the production deploy.

## Storage note

`CMS_STORAGE_DRIVER=local` stores CMS data in `data/cms.json` and uploads in `public/uploads`. This is suitable for local/dev and simple single-server deployments.

`CMS_STORAGE_DRIVER=supabase` stores CMS data in Supabase Postgres and uploads in Supabase Storage. This is the required mode for durable admin edits on Vercel/serverless.

## Pre-launch checklist

- Change admin credentials.
- Set `AUTH_SECRET`.
- Apply Supabase migrations.
- Set `CMS_STORAGE_DRIVER=supabase`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` in Vercel.
- Replace starter copy and visuals with final approved brand assets.
- Upload favicon and OG image.
- Update `settings.siteUrl`.
- Verify `/sitemap.xml`.
- Verify `/robots.txt`.
- Run `npm audit`.
- Run `npm run build`.
