# SEO Guide

## Metadata

Metadata is generated in:

- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/blog/page.tsx`
- `src/app/blog/[slug]/page.tsx`
- `src/app/policy/page.tsx`
- `src/lib/metadata.ts`

Editable page and blog SEO fields:

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
- BlogPosting.

FAQ schema is generated from the FAQ section content.
BlogPosting schema is generated from each published blog post.

## Sitemap and Robots

- `src/app/sitemap.ts`: dynamic sitemap from the homepage, policy page, blog index, and indexable published blog posts.
- `src/app/robots.ts`: allows public site and blocks `/admin` plus `/api/admin`.

## SEO Rules

- Keep one H1 per public page.
- Use descriptive image alt text.
- Keep `siteUrl` accurate before deployment.
- Use real OG images, ideally 1200x630.
- Keep draft pages and draft blog posts hidden from public routing.
