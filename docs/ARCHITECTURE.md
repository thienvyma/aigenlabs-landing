# Architecture

## Stack

- Next.js App Router.
- TypeScript.
- React client components for interactive nav, tabs, carousels, FAQ, floating dock, and admin.
- CMS storage adapter in `src/lib/cms.ts`.
  - Local/dev fallback: `data/cms.json`.
  - Production: Supabase Postgres table `public.landing_cms_documents`.
- Asset storage adapter in `src/lib/cms.ts`.
  - Local/dev fallback: `public/uploads`.
  - Production: Supabase Storage bucket `landing-assets`.
- Cookie-based admin session signed with HMAC.

## Main paths

- `src/app/page.tsx`: homepage route.
- `src/app/policy/page.tsx`: public privacy, terms, and data deletion route for users and Meta app verification.
- `src/app/admin/page.tsx`: admin studio.
- `src/app/api/admin/*`: admin data, auth, upload APIs.
- `src/components/landing`: public landing components.
- `src/components/admin`: admin UI.
- `src/cms/sections/schema.ts`: supported section types, labels, and Zod content schemas.
- `src/cms/sections/templates.ts`: section/page templates used by the admin when creating content.
- `src/lib/cms.ts`: CMS and asset storage adapter.
- `src/lib/metadata.ts`: metadata and JSON-LD.
- `src/design/tokens.ts`: CMS tokens to CSS variables.
- `supabase/migrations`: Supabase schema and storage migrations.

## Rendering model

Public pages render from CMS data server-side. Components do not hard-code landing content. Section data comes from `CmsPage.sections[]`, sorted by `order` and filtered by `enabled`. Section content is validated by type through `src/cms/sections/schema.ts` before save and render, so the admin and public renderer share one contract.

The CMS content scope is deliberately home-only: `CmsData.pages` contains exactly one published page at `/`. The public app also exposes the static `/policy` route for privacy, terms, and user data deletion requirements. There is no catch-all page route and no custom 404 route in the app tree. Additional public pages should be built deliberately when their content and route requirements are known.

Admin edits the homepage CMS data model through `/api/admin/data`. Saving writes the same `CmsData` shape to the active storage driver. The backend validates that the CMS document contains exactly one published Vietnamese page at `/`.

- `CMS_STORAGE_DRIVER=local`: saves to `data/cms.json` atomically through a temp file and rename.
- `CMS_STORAGE_DRIVER=supabase`: upserts one JSON document into `public.landing_cms_documents`.

When Supabase storage is enabled and the CMS row is missing, the app seeds the row from `data/cms.json` on first read. This keeps first deployment recoverable while preserving the JSON file as a human-readable seed.

## Upgrade path

The JSON store is intentionally simple for local work. The production adapter keeps the current data shape so public components and admin forms stay stable:

1. Keep `src/lib/types.ts` as the contract.
2. Keep section schemas/templates in `src/cms/sections`.
3. Keep public components unchanged as long as the same data shape is returned.
4. Apply Supabase migrations before enabling `CMS_STORAGE_DRIVER=supabase`.
5. Use Supabase Storage for production uploads.
