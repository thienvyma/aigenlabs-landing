# Accio Structure Research

Nguồn: https://www.accio.com/
Ngày nghiên cứu: 2026-06-15
Mục tiêu: ghi lại cấu trúc, layout, interaction và SEO để dùng làm reference cho AigenLabs landing. Không dùng lại code, text, logo hoặc asset gốc.

## Tổng quan

Accio hiện là một SPA/Vite React landing. HTML ban đầu có SEO metadata, canonical, hreflang, Open Graph, Twitter Card, FAQ JSON-LD và scripts analytics. Nội dung chính render sau khi React mount.

Visual direction:

- Nền chủ đạo trắng, gray band xen kẽ.
- Accent xanh emerald rất nhẹ.
- Typography sans-serif, bold headline, body muted.
- Pill buttons, pill tabs, card radius lớn.
- Hero centered, product preview frame lớn.
- Các section rộng, ít text, nhiều media preview.

## SEO quan sát được

HTML source có:

- `<title>`.
- Meta description.
- Theme color.
- Canonical URL.
- Robots meta `index,follow`.
- Alternate hreflang cho nhiều locale.
- Open Graph title/description/image.
- Twitter card title/description/image.
- FAQPage JSON-LD.
- Preconnect tới CDN và download host.
- Favicon.

Với AigenLabs, cần mở rộng thêm sitemap, robots route, Organization/WebSite/SoftwareApplication schema và admin-editable metadata.

## Section order

### 1. Sticky nav

Desktop:

- Logo bên trái.
- Menu: Pricing, Help Center dropdown, Events dropdown.
- Language switcher.
- Secondary outline CTA.
- Sign in.
- Primary dark CTA.

Mobile:

- Logo trái.
- Hamburger phải.
- Menu nên mở drawer/full-screen.

Behavior:

- Fixed top.
- Transparent khi ở đầu trang.
- Có transition background/backdrop khi scroll.

### 2. Hero

Cấu trúc:

- Wrapper `#home`, nền trắng, radial emerald glow rất nhẹ.
- Brand wordmark centered ở trên.
- H1 centered.
- 3 trust chips dạng pill.
- Paragraph centered, max-width khoảng 760px.
- CTA row, primary dark pill có icon.
- Large browser/app preview frame.

Media frame:

- Max-width khoảng 1100px.
- Border gray, white frame, shadow lớn.
- Top bar có 3 dot đỏ/vàng/xanh.
- Body là video hoặc image area, tỷ lệ 16:9 trên mobile, cao hơn trên desktop.

Responsive:

- Mobile giữ hero centered.
- Chips wrap hoặc co lại.
- Preview frame gần full-width.

### 3. Use-case tabs

Cấu trúc:

- Gray band, border top/bottom.
- H2 centered.
- Horizontal pill tab rail.
- Active tab: emerald background, white text, shadow.
- Inactive: white, gray border/text.
- Card lớn: left text panel, right media/video preview.

Các tab quan sát được:

- Launch Store.
- Monitor Competitors.
- Source & Negotiate.
- Promote on Social.
- Customize Tools.
- Organize Files.
- Analyze Bestsellers.

Implementation notes:

- Tab rail phải scroll ngang trên mobile.
- Nội dung mỗi tab quản trị từ CMS.
- Media có thể là video, image hoặc placeholder.

### 4. Platform features

Cấu trúc:

- Nền trắng.
- Eyebrow pill "Platform".
- H2 centered.
- Description centered.
- Feature rows alternating left/right.
- Text column khoảng 32%, media column khoảng 68%.
- Icon square xanh nhạt.
- Media card có border, shadow, gradient background.
- Một số media là carousel ảnh, một số là static image.

Feature rows quan sát được:

- Agent Hub.
- Automations.
- Browser.
- Connectors.
- Skills.
- Channels.
- Pairing.
- Teams với badge beta.

Implementation notes:

- Feature row phải hỗ trợ `layout: normal | reverse`.
- Media field phải hỗ trợ `image`, `video`, `carousel`.
- Badge optional.

### 5. Release notes / changelog

Cấu trúc:

- Nền trắng.
- H2 centered.
- Link xem tất cả release notes.
- Grid 4 cards trên desktop, 2 tablet, 1 mobile.
- Card có version pill, date, list nội dung.
- Card giới hạn chiều cao, nội dung scroll nội bộ.

Admin cần quản trị release version, date, bullet list, link chi tiết.

### 6. Security/control

Cấu trúc:

- Gray band.
- Eyebrow pill.
- H2 centered.
- Description centered.
- 3 cards grid.
- Mỗi card có icon, title, description.
- CTA button bên dưới và note nhỏ.

Card topics:

- Sandboxed/isolated.
- Human-in-the-loop permissions.
- Local-first/audit-ready.

Với AigenLabs, đổi thành thông điệp bảo mật riêng.

### 7. FAQ

Cấu trúc:

- Nền trắng.
- Max-width khoảng 800px.
- H2.
- Accordion cards.
- Item đầu mở mặc định.
- Mỗi answer có optional link.

FAQ quan sát được xoay quanh khác biệt với chat tool, model support, browser automation, scheduling, channels, skills, platform support và multi-agent collaboration.

Với AigenLabs, FAQ phải được quản trị trong admin và sinh FAQPage JSON-LD tự động.

### 8. Final CTA

Cấu trúc:

- Background trắng, radial green glow nhẹ.
- H2 lớn.
- Paragraph.
- Primary dark pill CTA.
- Optional secondary CTA.

### 9. Floating dock

Cấu trúc:

- Fixed right/bottom.
- Customer service button luôn có.
- Back-to-top button xuất hiện khi scroll/hover.
- Tooltip bên trái button trên desktop.

### 10. Footer

Cấu trúc:

- Footer nền trắng.
- 3 cột link: Product, Legal, Contact Support.
- Logo và copyright ở bottom bar.

## Visual tokens quan sát được

Gốc CSS dùng các biến tương đương:

- Background: `#ffffff`.
- Card/surface: `#ffffff`.
- Border: `#e5e7eb`.
- Hover surface: `#f8fafc`.
- Brand: `#10b981`.
- Brand dark: `#059669`.
- Brand light: `#d1fae5`.
- Text main: `#111827`.
- Text muted: `#4b5563`.
- Text light: `#9ca3af`.

Container:

- Main max-width khoảng 1320px.
- Feature max-width khoảng 1100px.
- FAQ max-width khoảng 800px.

Spacing:

- Nav height khoảng 64px.
- Section vertical padding khoảng 96px desktop.
- Mobile section padding khoảng 56-72px.

Radius:

- Pill: 999px.
- Cards: 16-32px.
- Media frame: 24px desktop, 16px mobile.

## Implementation guidance

- Rebuild component structure from scratch.
- Use semantic sections and heading hierarchy.
- Do not embed static landing content inside components.
- Each section should map from CMS data with typed Zod schemas.
- Use design tokens, not raw colors scattered throughout components.
- Provide placeholder media and content that admin can replace.
