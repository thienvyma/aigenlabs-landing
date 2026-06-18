# SEO Guide

## Metadata

Metadata is generated in:

- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/[slug]/page.tsx`
- `src/lib/metadata.ts`

Editable page SEO fields:

- Title.
- Description.
- Canonical path.
- Robots index/follow.
- Open Graph title/description/image.
- Twitter card.
- Keywords.
- Schema toggles.

## Structured Data

Generated JSON-LD:

- Organization.
- WebSite.
- SoftwareApplication.
- FAQPage.

FAQ schema is generated from the FAQ section content.

## Sitemap and Robots

- `src/app/sitemap.ts`: dynamic sitemap from published pages.
- `src/app/robots.ts`: allows public site and blocks `/admin` plus `/api/admin`.

## SEO Rules

- Keep one H1 per public page.
- Use descriptive image alt text.
- Keep `siteUrl` accurate before deployment.
- Use real OG images, ideally 1200x630.
- Keep draft pages as `robotsIndex: false`.
