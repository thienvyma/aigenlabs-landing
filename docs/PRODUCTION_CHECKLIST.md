# Production Completion Checklist

Use this checklist whenever the project is resumed. It prevents context loss by turning the original request into repeatable gates.

## Original Requirements

- The project lives in a separate Desktop landing folder.
- The public homepage follows the Accio-inspired structure: sticky nav, centered hero, trust chips, CTA, browser-style media, use-case tabs, platform feature rows, release notes, security cards, FAQ, final CTA, floating support dock, and footer.
- AigenLabs content and images can be replaced later without code edits.
- Admin is separate from the public site and usable by nontechnical editors.
- Admin can manage the homepage route only.
- SEO metadata is implemented in code and sourced from CMS data.
- Documentation is complete enough for handoff, deployment, CMS editing, SEO, and brand tokens.
- Basic brand guidelines document the color system, typography, social templates, pricing templates, announcements, safe zones, and visual consistency rules for marketing/design.

## Definition Of Done

Run these commands from the landing project root, currently `landing/aigenlabs-landing` inside the AigenLabs workspace:

```bash
npm run type-check
npm run build
npm audit --audit-level=moderate
npm run audit:production
AUDIT_BASE_URL=http://127.0.0.1:3000 npm run audit:production
AUDIT_BASE_URL=http://127.0.0.1:3000 npm run audit:sync
```

All commands must pass before calling the work complete.

## Admin Coverage Checklist

- Pages tab can create/edit page name, public URL, language, and publish state.
- Content tab can edit every rendered section type.
- Hero section controls wordmark, headline, subheadline, trust chips, CTAs, and media.
- Use-case tabs control tab labels, titles, descriptions, preview titles, and media per tab.
- Platform features control label, heading, description, feature copy, icon, layout, badge, slides, and media per feature.
- Release notes control heading, view-all link, version/date/bullets.
- Security cards control label, heading, description, cards, CTA, and note.
- FAQ controls heading, questions, answers, and optional links.
- Final CTA controls heading, description, and CTAs.
- Floating dock controls support label/link and back-to-top visibility.
- Generic content pages and catch-all public routes are not part of the current scope.
- SEO tab controls title, description, canonical path, keywords, social fields, robots, and schema toggles.
- Brand tab controls identity, logo fields, favicon, colors, layout tokens, and radius tokens.
- Navigation and Footer tabs control all public links.
- Assets tab supports upload, alt text, captions, and URL copy.
- High-risk syntax fields render as guided controls: links from CMS pages/sections, media from uploaded assets, image-only choices for logo/favicon/social/poster, icon dropdowns, date picker, website URL presets, and layout/radius token presets.

## Runtime Checklist

- Public routes return 200: `/`. Supporting pages should remain absent/draft until real content is ready.
- `/admin/login`, `/robots.txt`, and `/sitemap.xml` return 200.
- No public HTML contains unfinished wording: `mock`, `placeholder`, `lorem`, or `todo`.
- Every public page has title, meta description, and canonical URL.
- Sitemap includes every published page and excludes admin/API routes.
- Robots allows the public site and blocks `/admin` plus `/api/admin`.
- CMS-backed public pages, sitemap, and robots are dynamic, not stale static output.
- Admin API updates render on the public homepage without rebuild; `npm run audit:sync` proves write -> render -> restore.
- Production/Vercel CMS uses Supabase storage, not ephemeral server filesystem.
- Supabase migrations create `landing_cms_documents` and `landing-assets`.
- Desktop and mobile screenshots show meaningful content, no blank shell, and no framework error overlay.

## Continuation Protocol

1. Read this file first.
2. Read `README.md`, `docs/ARCHITECTURE.md`, `docs/ADMIN_GUIDE.md`, `docs/CONTENT_MODEL.md`, `docs/SEO_GUIDE.md`, `docs/BRANDING_TOKENS.md`, and `docs/BASIC_BRAND_GUIDELINES.md`.
3. Run `npm run audit:production` before making changes.
4. Make one scoped improvement.
5. Run type-check/build/audit again.
6. Update this checklist if the production definition changes.

Do not mark the project complete from memory. Completion requires current command output and rendered evidence.
