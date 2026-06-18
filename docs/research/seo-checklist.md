# SEO Checklist

Áp dụng cho mọi page public.

## Metadata

- Unique title per page.
- Title template, ví dụ `%s | AigenLabs`.
- Meta description 140-160 ký tự nếu có thể.
- Canonical URL.
- Robots index/follow configurable.
- Open Graph title, description, image, URL, type.
- Twitter Card title, description, image.
- Favicon và apple touch icon.
- Theme color.
- Language attribute trên HTML.
- Hreflang nếu bật multi-language.

## Structured data

Sinh JSON-LD từ CMS:

- Organization.
- WebSite.
- SoftwareApplication hoặc Product cho sản phẩm chính.
- FAQPage từ FAQ manager.
- BreadcrumbList cho page con.

Admin phải bật/tắt schema theo page và chỉnh các field quan trọng.

## Technical SEO

- Dynamic `sitemap.xml` từ published pages.
- `robots.txt`.
- Clean slugs.
- 301 redirect manager.
- Custom 404 page.
- No duplicate H1.
- Semantic headings theo thứ tự.
- Internal links có anchor rõ nghĩa.
- Public pages không phụ thuộc client-only render cho metadata.

## Image SEO

- Mọi image có alt text.
- Store width/height.
- Hero image/video poster dùng priority/preload hợp lý.
- Lazy load ảnh ngoài viewport.
- OG image fallback 1200x630.
- Per-page OG image override.

## Performance

- Không để layout shift ở media frame.
- Dùng `next/image` cho ảnh.
- Video không autoplay âm thanh.
- Defer analytics.
- Font loading tối ưu.
- Bundle admin tách khỏi public landing.
- Public landing nên SSR/SSG.

## Admin SEO UX

Mỗi page cần có SEO panel:

- Google snippet preview.
- Social share preview.
- Warnings: title quá dài/ngắn, description thiếu, canonical invalid, OG image thiếu, image alt thiếu.
- Button validate page SEO trước khi publish.
