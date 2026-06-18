# Admin CMS Spec

Mục tiêu: mọi nội dung, hình ảnh, link, metadata, section order và branding của landing phải chỉnh được trong `/admin`.

## Admin routes

- `/admin/login`: đăng nhập.
- `/admin`: dashboard.
- `/admin/pages`: danh sách page.
- `/admin/pages/new`: tạo page.
- `/admin/pages/[id]`: thông tin page, slug, status, locale.
- `/admin/pages/[id]/sections`: quản trị section builder.
- `/admin/pages/[id]/seo`: SEO metadata page.
- `/admin/assets`: asset manager.
- `/admin/navigation`: menu header.
- `/admin/footer`: footer columns/links.
- `/admin/faqs`: FAQ manager.
- `/admin/releases`: release notes/changelog.
- `/admin/brand`: brand settings và design tokens.
- `/admin/redirects`: redirect manager.
- `/admin/preview/[slug]`: preview draft.

## Roles

Tối thiểu:

- `admin`: toàn quyền.
- `editor`: sửa content, asset, SEO, publish.

Có thể seed một admin user local bằng biến môi trường:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Không commit password mặc định.

## Page model

Page fields:

- `title`
- `slug`
- `locale`
- `status`: draft | published | archived
- `template`: landing | default
- `seoTitle`
- `seoDescription`
- `canonicalUrl`
- `robotsIndex`
- `robotsFollow`
- `ogTitle`
- `ogDescription`
- `ogImageAssetId`
- `twitterCard`
- `schemaSettings`
- `createdAt`
- `updatedAt`
- `publishedAt`

## Section builder

Section fields:

- `type`: hero, useCaseTabs, platformFeatures, releaseNotes, securityCards, faq, finalCta, floatingDock, footer, custom.
- `name`: label hiển thị trong admin.
- `key`: stable key cho analytics và anchor.
- `enabled`
- `order`
- `content`: JSON theo schema từng section.
- `styleOverrides`: JSON optional.

Admin UX:

- Drag/drop reorder.
- Toggle enable/disable.
- Duplicate section.
- Preview section.
- Validate required fields.
- Autosave draft hoặc save rõ ràng.
- Publish page sau khi chỉnh.

## Section content schemas

### Hero

Fields:

- `brandMediaAssetId`
- `headline`
- `subheadline`
- `chips[]`: label, icon, enabled.
- `primaryCta`: label, href, icon, style.
- `secondaryCta`: label, href, style, enabled.
- `preview`: media type, asset, poster, alt, caption.
- `background`: token override optional.

### Use-case tabs

Fields:

- `heading`
- `tabs[]`: label, eyebrow, title, description, media, cta, enabled, order.

### Platform features

Fields:

- `eyebrow`
- `heading`
- `description`
- `features[]`: icon, title, badge, description, layout, mediaType, assets[], cta, enabled, order.

### Release notes

Fields:

- `heading`
- `viewAllHref`
- `items[]`: version, date, bullets[], href.

### Security cards

Fields:

- `eyebrow`
- `heading`
- `description`
- `cards[]`: icon, title, description.
- `cta`
- `note`

### FAQ

Fields:

- `heading`
- `items[]`: question, answer, href, hrefLabel, openByDefault, order.

### Final CTA

Fields:

- `heading`
- `description`
- `primaryCta`
- `secondaryCta`
- `background`

### Floating dock

Fields:

- `enabled`
- `showBackToTop`
- `support`: label, href, icon.

### Footer

Fields:

- `columns[]`: title, links[].
- `logoAssetId`
- `copyright`

## Asset manager

Asset fields:

- `fileName`
- `url`
- `mimeType`
- `kind`: image | video | document
- `alt`
- `width`
- `height`
- `focalPointX`
- `focalPointY`
- `caption`
- `createdAt`
- `updatedAt`

Rules:

- Images used in public pages must have alt text.
- Store width/height to avoid CLS.
- Allow replace asset without changing all references.
- Provide local upload adapter and abstraction for future S3/R2.

## Draft, preview, publish

Minimum:

- Page status draft/published.
- Preview route reads draft.
- Public route reads published only.
- Publish sets `publishedAt`.

Better:

- Keep section revision history.
- Show last updated by user.

## Admin validation

Required validations:

- Slug unique.
- SEO title length warning.
- SEO description length warning.
- Missing alt warning.
- One H1 per page.
- FAQ question and answer non-empty.
- Canonical URL valid.
- CTA href valid.
- Published page must have at least hero, SEO title, SEO description.
