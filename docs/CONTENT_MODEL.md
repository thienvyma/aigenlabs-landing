# Content Model

## CmsData

Root CMS object:

- `settings`
- `assets`
- `pages`
- `blogPosts`
- `redirects`

## Site settings

`settings` contains:

- `siteName`
- `siteUrl`
- `defaultLocale`
- `themeColor`
- `brand`
- `navigation`
- `footer`

## Page

Each page contains:

- `id`
- `slug`
- `path`
- `locale`
- `status`
- `title`
- `seo`
- `sections`
- timestamps

## Section

Each section contains:

- `id`
- `type`
- `name`
- `key`
- `enabled`
- `order`
- `content`
- optional `styleOverrides`

The public renderer maps `type` to a component through `src/cms/sections/schema.ts` and `SectionRenderer.tsx`. The same schema validates admin saves and Supabase reads.

Supported section types:

- `hero`
- `useCaseTabs`
- `platformFeatures`
- `releaseNotes`
- `securityCards`
- `faq`
- `floatingDock`

The current app does not include a generic content-page section or catch-all public page route. New pages should be added later as explicit product work.

`floatingDock` uses a CMS-managed `contacts` array. Each contact has `label`, `href`, `icon`, and optional `enabled`, so admin users can add email, phone, Messenger, Zalo, website, or support links without code changes.

## Blog Post

Blog posts live in `CmsData.blogPosts`, separate from `CmsData.pages` so the homepage route contract stays stable.

Each blog post contains:

- `id`
- `slug`
- `locale`
- `status`: `draft`, `published`, or `archived`
- `title`
- `excerpt`
- `category`
- `authorName`
- `coverImage`
- `coverAlt`
- `body`
- `seo`
- timestamps

Only `published` posts render at `/blog/[slug]` and enter the sitemap when `seo.robotsIndex` is true. The body supports a small editor-safe syntax: `##` headings, `###` subheadings, `-` bullet lines, and blank-line paragraph breaks.

## Editable Media

Shared media objects use:

- `kind`: `image` or `video`
- `title`
- `label`
- `alt`
- `url`
- optional `poster`

Media is CMS-editable for hero media, use-case tabs, and platform feature visuals. Public pages render uploaded image/video URLs when present, and otherwise show the designed product fallback visual.

## Asset

Each asset contains:

- `id`
- `fileName`
- `url`
- `mimeType`
- `kind`
- `alt`
- optional dimensions/caption
- timestamps

## Adding a New Section Type

1. Add a content interface to `src/lib/types.ts`.
2. Create a component in `src/components/landing/sections`.
3. Add the section type, label, and Zod content schema to `src/cms/sections/schema.ts`.
4. Add a default template to `src/cms/sections/templates.ts`.
5. Add the renderer mapping in `SectionRenderer.tsx`.
6. Add focused visual editor fields in `src/components/admin/AdminStudio.tsx` or split the editor into a section-specific admin component.
7. Edit content in admin.
