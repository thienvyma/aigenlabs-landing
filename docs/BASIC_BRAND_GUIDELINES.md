# Basic Brand Guidelines: AigenLabs

Tài liệu này chuyển guideline website sang hướng branding đã chốt trong `../docs/deep-research-report.md`: **Precision, Velocity, Trust**. AigenLabs cần đọc như một AI product system rõ ràng, nhanh và đáng tin, không như một landing page AI hype.

## Brand Foundation

| Hạng mục | Quy chuẩn |
| --- | --- |
| Tên thương hiệu | AigenLabs |
| Định vị | AI product-first platform cho đội ngũ thiết kế, kiểm soát và triển khai AI agent trong workflow thật |
| Brand promise | Build reliable AI products faster |
| Trục tính cách | Technical 70%, minimal 75%, premium, experimental under control |
| Brand keywords | precision, velocity, trust, rõ ràng, đáng tin, triển khai, kiểm soát, tăng tốc |
| Tránh dùng | best, revolutionary, world-class, magic, fully autonomous nếu chưa chứng minh được |

## Logo Direction

- Dùng wordmark `AigenLabs` kèm monogram chữ `A`.
- Monogram gợi inference path bằng negative space hoặc một beam nhỏ bên trong chữ A.
- Logo phải đọc tốt ở 16-24px, không phụ thuộc gradient phức tạp.
- Màu wordmark trên nền sáng: `#101828`; trên nền tối: trắng.
- Màu nhấn trong mark: Brand Red `#C61F26`, có thể dùng Accent Cyan `#16B3A3` rất ít để gợi signal/data.

## Color System

### Core Palette

| Token | HEX | Vai trò |
| --- | --- | --- |
| Brand Red 500 | `#C61F26` | CTA chính, active state, logo mark, signal quan trọng |
| Brand Red 600 | `#B21C22` | Hover state, pressed state, text accent ngắn |
| Brand Red 800 | `#811419` | Dark brand use, high emphasis khi cần |
| Brand Red 100 | `#F4D2D4` | Soft badge hoặc highlight rất nhẹ |
| Brand Red 50 | `#F9E9E9` | Brand surface, subtle background wash |
| White | `#FFFFFF` | Nền chính |
| Neutral 50 | `#F4F6F8` | Nền section phụ, admin shell, table surface |
| Neutral 300 | `#D0D5DD` | Border/divider |
| Neutral 500 | `#667085` | Body phụ, metadata |
| Neutral 900 | `#101828` | Headline, text chính |
| Accent Cyan | `#16B3A3` | Data/success/status phụ, không làm màu chính |
| Accent Amber | `#FDB022` | Warning, beta, cần chú ý |

### Color Rules

- Red là tín hiệu, không phải nền mặc định. Tỷ lệ đỏ nên ở mức 5-10% trên màn hình chính.
- Nền website ưu tiên trắng và neutral lạnh. Không chuyển sang beige, slate tối hoặc gradient tím/xanh dương làm identity chính.
- CTA chính dùng `#C61F26`, hover `#B21C22`, text trắng.
- CTA phụ/outline dùng nền trắng, border neutral, text đỏ.
- Cyan và amber chỉ dùng cho trạng thái, data hoặc signal nhỏ.
- Không dùng đỏ cho body copy dài.

## Typography

| Vai trò | Font | Ghi chú |
| --- | --- | --- |
| Headline / Display | Space Grotesk | H1, section heading, wordmark fallback |
| UI / Body | Be Vietnam Pro | Body copy, nav, button, form, admin UI |
| Fallback | `ui-sans-serif`, system stack | Dùng khi web font chưa load |

Scale tham chiếu:

- Display XL: 64/72, weight 700-800.
- Display L: 48/56, weight 700-800.
- Heading M: 32/40, weight 700-800.
- Heading S: 24/32, weight 700-800.
- Body: 16/24 đến 18/30, weight 400-520.
- Button/nav: 13-16px, weight 750-850.

Tracking mặc định là `0`. Không dùng negative letter-spacing.

## UI Tokens

| Token | Giá trị |
| --- | --- |
| `color.brand.primary` | `#C61F26` |
| `color.brand.hover` | `#B21C22` |
| `color.brand.surface` | `#F9E9E9` |
| `color.text.primary` | `#101828` |
| `color.text.secondary` | `#667085` |
| `color.surface.default` | `#FFFFFF` |
| `color.surface.subtle` | `#F4F6F8` |
| `color.border.default` | `#D0D5DD` |
| `color.info` | `#16B3A3` |
| `color.warning` | `#FDB022` |
| `radius.sm` | `8px` |
| `radius.md` | `12px` |
| `radius.lg` | `16px` |
| `radius.pill` | `999px` |
| `shadow.sm` | `0 1px 2px rgba(16,24,40,.06)` |
| `shadow.md` | `0 8px 24px rgba(16,24,40,.08)` |
| `shadow.lg` | `0 16px 40px rgba(16,24,40,.12)` |

## Component Guidance

- Navbar desktop cao 72px, mobile 64px.
- Primary button: red background, white text, 48px height, radius 12px.
- Secondary button: white background, red text/border, radius 12px.
- Cards: white, border `#D0D5DD`, radius 16px, shadow nhẹ. Không dùng card lồng card.
- Icon: line icon 24px grid, stroke 1.75-2px, rounded cap/join.
- Product preview: browser frame hoặc dashboard frame rõ, có trạng thái phê duyệt, log, scope hoặc workflow.

## Landing Voice

Ưu tiên copy ngắn, rõ, có kiểm soát:

- “Đưa AI từ thử nghiệm sang vận hành đáng tin”
- “Build reliable AI products faster”
- “Thiết kế, kiểm soát và triển khai AI agent trong workflow thật”
- “Precision, Velocity, Trust”

Tránh câu chung như “AI thay đổi mọi thứ”, “nền tảng tốt nhất”, “tự động hoàn toàn” nếu chưa có bằng chứng sản phẩm.

## Asset Checklist

- [ ] Đúng palette đỏ/trắng/neutral/cyan/amber.
- [ ] Red không vượt 10-15% visual trừ logo hoặc CTA.
- [ ] Heading dùng Space Grotesk, body/UI dùng Be Vietnam Pro hoặc fallback tương ứng.
- [ ] Có product/workflow signal thật, không dùng hình AI sci-fi chung chung.
- [ ] CTA rõ ràng, không quá 2 CTA chính trên một màn hình.
- [ ] Tất cả ảnh upload có alt text và không phá contrast.
