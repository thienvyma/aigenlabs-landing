# AigenLabs Landing

Next.js landing website with an admin CMS for managing homepage sections, blog posts, assets, SEO metadata, navigation, footer, and brand tokens. The CMS page scope intentionally manages only `/`; the public app also exposes `/blog`, `/blog/[slug]`, and `/policy`.

## Run locally

```bash
npm install
npm run dev
```

Open:

- Public site: `http://localhost:3000`
- Blog index: `http://localhost:3000/blog`
- Policy page: `http://localhost:3000/policy`
- Admin: `http://localhost:3000/admin`

Default local development admin credentials:

- Email: `admin@aigenlabs.local`
- Password: `admin1234`

Override with `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `AUTH_SECRET` in `.env.local`. Production requires all three environment variables; demo credentials are disabled when `NODE_ENV=production`.

## Verification

```bash
npm run type-check
npm run build
npm audit
npm run audit:production
AUDIT_BASE_URL=http://127.0.0.1:3000 npm run audit:production
AUDIT_BASE_URL=http://127.0.0.1:3000 npm run audit:sync
```

## Production storage

Local development uses `CMS_STORAGE_DRIVER=local` by default, backed by `data/cms.json` and `public/uploads`.

For Vercel production, set:

```bash
CMS_STORAGE_DRIVER=supabase
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-jwt>
SUPABASE_STORAGE_BUCKET=landing-assets
```

`SUPABASE_SECRET_KEY=sb_secret_...` is also supported when the project accepts the new Supabase secret key format through the Data API. For the current AigenLabs Supabase project, the verified server-side key is `SUPABASE_SERVICE_ROLE_KEY`.

Run Supabase migrations before enabling production admin edits:

```bash
npm run supabase -- link --project-ref <project-ref>
npm run supabase -- db push
```

After setting `SUPABASE_ACCESS_TOKEN` and `SUPABASE_DB_PASSWORD`, inspect or sync the CMS document:

```bash
npm run cms:supabase:status
npm run cms:supabase:push
```

Set the Vercel Root Directory to `landing/aigenlabs-landing`.

## Docs

- `docs/ARCHITECTURE.md`
- `docs/ADMIN_GUIDE.md`
- `docs/CONTENT_MODEL.md`
- `docs/SEO_GUIDE.md`
- `docs/BRANDING_TOKENS.md`
- `docs/BASIC_BRAND_GUIDELINES.md`
- `docs/DEPLOYMENT.md`
- `docs/PRODUCTION_CHECKLIST.md`

## Production audit

`npm run audit:production` checks the home-first CMS page scope, public blog/policy routes, CMS-driven section/media coverage, blog SEO fields, brand tokens, navigation/footer data, dynamic route configuration, unfinished wording, and live route health when `AUDIT_BASE_URL` is set.

`npm run audit:sync` logs into the admin API, writes a temporary homepage marker, verifies the public homepage renders it, then restores the original CMS data.
