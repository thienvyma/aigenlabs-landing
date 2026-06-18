# Prompt cho Codex: Build AigenLabs Landing Website

Bạn là Codex, senior full-stack engineer. Hãy xây dựng website landing riêng cho AigenLabs trong thư mục:

`/home/huynhvy/Desktop/landing/aigenlabs-landing`

Trước khi code, đọc đầy đủ các tài liệu:

- `/home/huynhvy/Desktop/landing/docs/accio-structure-research.md`
- `/home/huynhvy/Desktop/landing/docs/admin-cms-spec.md`
- `/home/huynhvy/Desktop/landing/docs/branding-tokens.md`
- `/home/huynhvy/Desktop/landing/docs/seo-checklist.md`

## Mục tiêu

Build một website landing có cấu trúc trình bày, nhịp section, spacing, responsive behavior và interaction giống website tham chiếu Accio Work nhất có thể, nhưng dùng nội dung, hình ảnh, logo và branding placeholder của AigenLabs. Tuyệt đối không copy code, text, logo, trademark hoặc hình ảnh của Accio.

Nội dung và hình ảnh sẽ được thay sau, nên mọi phần phải quản trị được trong admin.

## Stack đề xuất

Ưu tiên:

- Next.js App Router + TypeScript.
- Tailwind CSS.
- shadcn/ui hoặc component primitives tự viết theo chuẩn accessible.
- Prisma ORM.
- SQLite cho local dev, sẵn sàng đổi sang Postgres qua `DATABASE_URL`.
- Auth.js hoặc credentials auth đơn giản cho `/admin`.
- Zod cho validation.
- Upload local asset vào `public/uploads` trong dev, tách adapter để sau đổi sang S3/R2 dễ dàng.

Nếu repo đã có convention khác thì ưu tiên convention hiện có, nhưng vẫn phải đáp ứng đầy đủ admin, SEO và token branding.

## Cấu trúc landing bắt buộc

Tạo trang chủ với các khối theo đúng thứ tự:

1. Sticky navigation
   - Logo trái.
   - Desktop menu ở giữa/trái: Product dropdown, Pricing, Help Center dropdown, Events dropdown.
   - Phải có language switcher, secondary CTA dạng outline, Sign in, primary CTA dạng dark pill.
   - Mobile dùng hamburger, menu full-screen hoặc drawer.
   - Nav transparent ở top, đổi nền/backdrop khi scroll.

2. Hero
   - Nền trắng với radial glow xanh rất nhẹ.
   - Centered brand wordmark area.
   - H1 ngắn, centered.
   - 3 trust chips dạng pill.
   - Paragraph mô tả centered.
   - Primary CTA dark pill có icon download hoặc arrow.
   - Optional secondary CTA màu brand.
   - Bên dưới là browser/app preview frame lớn, có 3 chấm macOS ở top, media/video placeholder bên trong.
   - First viewport phải lộ được phần đầu của section tiếp theo trên desktop.

3. Use-case tabs
   - Background gray band.
   - H2 centered.
   - Horizontal pill tabs, active màu brand, inactive white border.
   - Desktop tabs nằm một hàng; mobile horizontal scroll.
   - Card lớn bên dưới: text panel khoảng 35%, media preview khoảng 65%.
   - Có 7 tab placeholder: Launch Store, Monitor Competitors, Source & Negotiate, Promote on Social, Customize Tools, Organize Files, Analyze Bestsellers.
   - Admin phải đổi được số lượng tab, label, title, description, media, CTA và order.

4. Platform features
   - Nền trắng.
   - Eyebrow pill, H2, description.
   - Alternating rows: text/media rồi media/text.
   - Mỗi row có icon trong square xanh nhạt, H3, description, media card.
   - Media có thể là image carousel hoặc static image.
   - 8 feature placeholder: Agent Hub, Automations, Browser, Connectors, Skills, Channels, Pairing, Teams.
   - Admin phải thêm/xóa/sắp xếp feature, đổi icon, text, badge, media và carousel slides.

5. Release notes/changelog
   - Nền trắng.
   - H2 centered, link "view all".
   - Grid responsive 4 cards desktop, 2 tablet, 1 mobile.
   - Card có version pill, date, list nội dung, max-height với scroll nội bộ.
   - Admin quản trị release notes.

6. Security/control
   - Gray band.
   - Eyebrow pill, H2, description.
   - 3 cards có icon, title, description.
   - CTA button và note nhỏ.
   - Admin đổi được toàn bộ cards và CTA.

7. FAQ
   - Nền trắng.
   - Max-width khoảng 800px.
   - Accordion accessible, item đầu mở mặc định.
   - Mỗi FAQ có question, answer, optional link.
   - FAQ schema JSON-LD sinh tự động từ dữ liệu admin.

8. Final CTA
   - Nền trắng với radial brand glow nhẹ.
   - H2 lớn, subcopy, primary CTA dark pill, optional secondary CTA.
   - Admin đổi title, text, CTA, visibility.

9. Floating dock
   - Fixed right/bottom trên desktop và mobile.
   - Customer support button.
   - Back-to-top button xuất hiện khi scroll hoặc hover.
   - Tooltips accessible.
   - Admin bật/tắt và đổi link.

10. Footer
   - 3 cột link: Product, Legal, Contact Support.
   - Logo và copyright dưới cùng.
   - Admin quản trị footer columns, links, logo, copyright.

## Admin CMS bắt buộc

Tạo admin riêng tại `/admin`.

Admin phải có:

- Login/logout.
- Dashboard.
- Pages manager: tạo/sửa/xóa page, slug, status draft/published, locale, template.
- Section builder: reorder sections, bật/tắt section, chỉnh từng field của từng section.
- Asset manager: upload/replace image/video, alt text, width/height, focal point, caption.
- Navigation manager.
- Footer manager.
- Brand tokens editor: logo, favicon, colors, radius, font, buttons, shadows.
- SEO manager theo từng page: title, description, canonical, robots, OG/Twitter image, keywords, structured data toggles.
- FAQ manager.
- Release notes manager.
- Preview draft trước khi publish.
- Version history hoặc ít nhất lưu `updatedAt`, `updatedBy`, `publishedAt`.

Quan trọng: tuyệt đối không hard-code landing content trong component. Component chỉ render từ CMS seed/data. Có thể seed nội dung placeholder ban đầu bằng file seed.

## Data model tối thiểu

Thiết kế schema đủ linh hoạt:

- `SiteSettings`
- `BrandSettings`
- `Page`
- `Section`
- `Asset`
- `NavigationItem`
- `FooterColumn`
- `FooterLink`
- `FAQItem`
- `ReleaseNote`
- `Redirect`
- `AdminUser`

`Section` nên có:

- `id`
- `pageId`
- `type`
- `name`
- `key`
- `order`
- `enabled`
- `content` JSON
- `styleOverrides` JSON optional
- `createdAt`
- `updatedAt`

## SEO bắt buộc

Đọc `docs/seo-checklist.md` và triển khai đầy đủ:

- Next.js `generateMetadata` dynamic từ CMS.
- Title template, meta description, canonical.
- Open Graph, Twitter Card.
- Favicon, theme color.
- `robots.txt`.
- Dynamic `sitemap.xml`.
- JSON-LD: Organization, WebSite, SoftwareApplication/Product, FAQPage, BreadcrumbList nếu có nhiều page.
- Image alt text bắt buộc từ asset manager.
- Clean semantic headings: mỗi page chỉ có một H1.
- URL slug sạch.
- 404 và redirect manager.
- OG image fallback và per-page override.
- Performance: image sizes, lazy loading, priority hero image, no layout shift.

## Branding token bắt buộc

Tạo token dùng chung:

- `src/design/tokens.ts`
- CSS variables trong global CSS.
- Tailwind theme mapping.
- Admin có thể đổi brand tokens và preview.
- Component không dùng màu hard-code rải rác; dùng token semantic.

Token cần có nhóm:

- Color: background, surface, text, muted, border, brand, brand-dark, brand-light, danger, warning.
- Typography: font families, heading/body sizes, weights, line heights.
- Spacing: section padding, container widths, gaps.
- Radius: card, panel, pill, button.
- Shadow: card, media frame, CTA.
- Component tokens: nav height, button sizes, tab sizes, card padding.

## Nội dung placeholder cho AigenLabs

Không cần copywriting hoàn chỉnh. Dùng placeholder dễ thay:

- Brand: AigenLabs.
- Product category: AI agent platform.
- Hero H1 placeholder: "Build, run, and manage AI agents for real work".
- Hero subcopy placeholder: "A modular AI agent workspace for automation, research, operations, and customer workflows."
- CTA placeholder: "Get started".
- Media placeholder: gradient/skeleton hoặc local placeholder image.

Tất cả placeholder phải sửa được trong admin.

## Tài liệu cần tạo trong project

Trong `/home/huynhvy/Desktop/landing/aigenlabs-landing/docs` tạo:

- `ARCHITECTURE.md`
- `ADMIN_GUIDE.md`
- `CONTENT_MODEL.md`
- `SEO_GUIDE.md`
- `BRANDING_TOKENS.md`
- `DEPLOYMENT.md`

## Verification

Sau khi code:

- Chạy install/build/test/lint phù hợp.
- Start dev server và cung cấp URL.
- Kiểm tra desktop và mobile bằng Playwright hoặc browser automation.
- Chụp screenshot homepage desktop/mobile.
- Kiểm tra admin login, edit một section, preview/publish.
- Kiểm tra metadata HTML, sitemap, robots và JSON-LD.

## Acceptance criteria

- Homepage bám đúng cấu trúc Accio đã mô tả trong docs.
- Không dùng Accio assets hoặc text gốc.
- Mọi section homepage quản trị được trong `/admin`.
- Có thể tạo thêm page landing mới và sắp xếp section.
- SEO metadata không hard-code, lấy từ CMS.
- Có shared design token và tài liệu branding rõ ràng.
- Build pass, không lỗi TypeScript.
- Responsive không vỡ layout ở 390px, 768px, 1440px.
