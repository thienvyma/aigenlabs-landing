# Branding Tokens

Mục tiêu: tất cả component dùng token semantic để sau này đổi branding AigenLabs trong một chỗ và qua admin. Bộ token này cập nhật theo `docs/deep-research-report.md`.

## Brand Direction

- Positioning: AI product-first platform.
- Personality: Precision, Velocity, Trust.
- Visual: minimal-tech, white/neutral base, red as signal, cyan/amber for data/status.
- Typography: Space Grotesk cho headline/display, Be Vietnam Pro cho UI/body.

## Current Token Values

```ts
export const defaultBrandTokens = {
  color: {
    background: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceMuted: "#F4F6F8",
    border: "#D0D5DD",
    borderStrong: "#98A2B3",
    text: "#101828",
    textMuted: "#667085",
    textLight: "#98A2B3",
    brand: "#C61F26",
    brandDark: "#B21C22",
    brandLight: "#F4D2D4",
    brandSoft: "#F9E9E9",
    darkCta: "#C61F26",
    darkCtaHover: "#B21C22",
    warning: "#FDB022",
    danger: "#B42318"
  },
  typography: {
    display: "Space Grotesk, Be Vietnam Pro, ui-sans-serif, system-ui, sans-serif",
    ui: "Be Vietnam Pro, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
  },
  layout: {
    navHeight: "72px",
    containerWide: "1280px",
    containerFeature: "1120px",
    containerFaq: "820px",
    sectionPaddingDesktop: "96px",
    sectionPaddingMobile: "64px"
  },
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "16px",
    panel: "16px",
    pill: "999px"
  },
  shadow: {
    sm: "0 1px 2px rgba(16,24,40,.06)",
    md: "0 8px 24px rgba(16,24,40,.08)",
    lg: "0 16px 40px rgba(16,24,40,.12)"
  }
} as const;
```

## Usage Rules

- Components use CSS variables or semantic aliases, not repeated raw hex values.
- Red is used for CTA, active state, logo mark and small signals, not large page backgrounds.
- Cyan and amber are status/data accents only.
- Cards and panels use white background, neutral border, radius 16px.
- Buttons use radius 12px; pills are reserved for compact badges/status labels.

## Admin Brand Editor

Admin should allow editing:

- Logo text/image and favicon.
- Primary/hover brand colors.
- Surface, text, border and state colors.
- Radius scale and layout width.
- OG image fallback.

Admin preview should cover:

- Nav.
- Hero CTA.
- Tab rail.
- Feature card.
- FAQ item.
- Footer.
