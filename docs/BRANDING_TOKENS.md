# Branding Tokens

Brand tokens live in CMS at `settings.brand.tokens`. At render time, [src/design/tokens.ts](/home/huynhvy/Desktop/landing/aigenlabs-landing/src/design/tokens.ts) maps them to CSS variables on the site shell.

## Current Brand Direction

AigenLabs uses the **Precision, Velocity, Trust** system from `../docs/deep-research-report.md`.

### Color

| CMS token | CSS variable | Value |
| --- | --- | --- |
| `background` | `--color-background` | `#FFFFFF` |
| `surface` | `--color-surface` | `#FFFFFF` |
| `surfaceMuted` | `--color-surface-muted` | `#F4F6F8` |
| `border` | `--color-border` | `#D0D5DD` |
| `borderStrong` | `--color-border-strong` | `#98A2B3` |
| `text` | `--color-text` | `#101828` |
| `textMuted` | `--color-text-muted` | `#667085` |
| `textLight` | `--color-text-light` | `#98A2B3` |
| `brand` | `--color-brand` | `#C61F26` |
| `brandDark` | `--color-brand-dark` | `#B21C22` |
| `brandLight` | `--color-brand-light` | `#F4D2D4` |
| `brandSoft` | `--color-brand-soft` | `#F9E9E9` |
| `darkCta` | `--color-dark-cta` | `#C61F26` |
| `darkCtaHover` | `--color-dark-cta-hover` | `#B21C22` |
| `warning` | `--color-warning` | `#FDB022` |
| `danger` | `--color-danger` | `#B42318` |

### Layout

| CMS token | CSS variable | Value |
| --- | --- | --- |
| `navHeight` | `--nav-height` | `72px` |
| `containerWide` | `--container-wide` | `1280px` |
| `containerFeature` | `--container-feature` | `1120px` |
| `containerFaq` | `--container-faq` | `820px` |
| `sectionPaddingDesktop` | `--section-padding-desktop` | `96px` |
| `sectionPaddingMobile` | `--section-padding-mobile` | `64px` |

### Radius

| CMS token | CSS variable | Value |
| --- | --- | --- |
| `sm` | `--radius-sm` | `8px` |
| `md` | `--radius-md` | `12px` |
| `lg` | `--radius-lg` | `16px` |
| `xl` | `--radius-xl` | `16px` |
| `panel` | `--radius-panel` | `16px` |
| `pill` | `--radius-pill` | `999px` |

## Usage

Components should use CSS variables such as `var(--color-brand)`, `var(--color-text)`, `var(--radius-md)`, and `var(--container-wide)`.

Avoid hard-coding brand colors in components. Update `data/cms.json` or use `/admin` to change the visual system.
