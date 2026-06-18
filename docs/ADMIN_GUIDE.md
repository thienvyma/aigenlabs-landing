# Admin Guide

## Login

Open `/admin`.

Default local development credentials:

- `admin@aigenlabs.local`
- `admin1234`

Set these environment variables for real use. Production login is disabled until all three are present:

```bash
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=strong-password
AUTH_SECRET=random-long-secret
```

## What Editors Can Change

The admin is built for nontechnical editors. It uses forms, lists, toggles, file upload, color fields, and CTA fields instead of code editing.

Tabs:

- Pages: manage the homepage route only.
- Content: edit each page section, reorder sections, hide/show sections, add supported section types.
- SEO: edit search title, meta description, canonical path, social share fields, robots rules, and schema toggles.
- Brand: edit site identity, logo fields, favicon, color tokens, layout tokens, and radius tokens.
- Navigation: edit top menu items, dropdowns, badges, and header buttons.
- Footer: edit footer columns, links, and copyright.
- Assets: upload images/videos/documents, replace existing files, edit alt text, and copy asset URLs.

## Guided Fields

Fields that are easy to mistype use selectors first and custom input second:

- Links: choose from live pages, page sections, admin login, or email presets. Use custom only for external links or a new email address.
- Public URL and canonical path: choose an existing page path or type a new path. The admin adds the leading slash automatically.
- Website URL: choose a production/root/local preset or type your domain. The admin adds `https://` when needed.
- Media: choose uploaded image/video assets for section media. Poster, logo, favicon, and social image fields only suggest uploaded images.
- Icons: choose from the icon dropdown; no icon names need to be typed.
- Dates: use the date picker; release cards are saved in the site format automatically.
- Layout and radius tokens: use presets first. Custom values are still available for advanced branding changes.

## Media Editing

Sections with visual media expose the same editor pattern:

- Media type: uploaded image or video URL.
- Media title.
- Small media label.
- Image or video URL selected from uploaded renderable assets, with custom URL fallback.
- Alt text.
- Optional video poster URL selected from uploaded images.

Media fields are available for the hero, each use-case tab, and each platform feature. Public pages render the uploaded media when a URL is present, and otherwise show the designed product fallback visual.

## Page Visibility

Only pages with status `published` are public and included in the sitemap. The seed currently publishes only the homepage.

Draft and archived pages are hidden from public routing. The homepage uses `path: "/"`.

## Supported Section Types

- Hero
- Use-case tabs
- Platform features
- Release notes
- Security cards
- FAQ
- Final CTA
- Floating dock
- Content page

## Publishing Flow

1. Pick a page.
2. Update page details, content, SEO, and media.
3. Open the live page for review when the page is published.
4. Click `Save changes`.
5. Recheck `/sitemap.xml` and key public routes before launch.

## Asset Rules

- Add descriptive alt text before using images publicly.
- Use uploaded asset URLs in section media and social image fields.
- Use `Replace file` when updating an existing screenshot/video. It uploads a new optimized file, updates CMS references from the old URL to the new URL, and removes the old stored file/object.
- Raster images are normalized to WebP and resized inside a 2400px bounding box to control storage usage and page weight.
- Video uploads are limited to browser-friendly MP4/WebM files under 10 MB. Compress longer videos before upload.
- Local uploads are stored in `public/uploads`.
- Production uploads should use Supabase Storage through `CMS_STORAGE_DRIVER=supabase`.
