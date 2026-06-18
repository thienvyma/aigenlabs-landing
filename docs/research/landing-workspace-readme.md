# AigenLabs Landing Spec

Thư mục này chứa bộ prompt và tài liệu để Codex xây dựng một website landing riêng cho AigenLabs, dựa trên cấu trúc trình bày của Accio Work nhưng thay toàn bộ nội dung, hình ảnh, logo và branding sang AigenLabs.

Nguồn tham chiếu đã nghiên cứu ngày 2026-06-15:
- Accio home: https://www.accio.com/
- Screenshot tham chiếu: `reference/screenshots/accio-desktop-top.png`, `reference/screenshots/accio-mobile-top.png`

## File chính

- `codex-prompt.md`: prompt chính để đưa cho Codex khi bắt đầu build website.
- `docs/accio-structure-research.md`: phân tích cấu trúc layout, section, interaction, responsive và SEO hiện có của Accio.
- `docs/admin-cms-spec.md`: yêu cầu phần admin riêng để quản trị toàn bộ landing, từng section, từng trang, hình ảnh, SEO và metadata.
- `docs/branding-tokens.md`: design token dùng chung để dễ đổi branding sau này.
- `docs/seo-checklist.md`: checklist SEO kỹ thuật và SEO nội dung bắt buộc.

## Cách dùng

1. Mở `codex-prompt.md`.
2. Dán toàn bộ prompt đó vào Codex trong một phiên làm việc mới.
3. Yêu cầu Codex đọc thêm các file trong `docs/` trước khi triển khai.
4. Nên để project thật trong `/home/huynhvy/Desktop/landing/aigenlabs-landing`, giữ thư mục `docs/` và `reference/` làm spec.

## Nguyên tắc pháp lý và thương hiệu

Mục tiêu là tái tạo cấu trúc, trải nghiệm và hệ thống quản trị theo website tham chiếu. Không copy code, asset, logo, tên thương mại, text marketing hoặc hình ảnh của Accio. Tất cả asset phải là placeholder hoặc asset riêng của AigenLabs để thay sau.
