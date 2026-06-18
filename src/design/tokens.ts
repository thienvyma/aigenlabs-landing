import type { CSSProperties } from "react";
import type { BrandTokens } from "@/lib/types";

export function tokensToCssVariables(tokens: BrandTokens): CSSProperties {
  return {
    "--color-background": tokens.color.background,
    "--color-surface": tokens.color.surface,
    "--color-surface-muted": tokens.color.surfaceMuted,
    "--color-border": tokens.color.border,
    "--color-border-strong": tokens.color.borderStrong,
    "--color-text": tokens.color.text,
    "--color-text-muted": tokens.color.textMuted,
    "--color-text-light": tokens.color.textLight,
    "--color-brand": tokens.color.brand,
    "--color-brand-dark": tokens.color.brandDark,
    "--color-brand-light": tokens.color.brandLight,
    "--color-brand-soft": tokens.color.brandSoft,
    "--color-dark-cta": tokens.color.darkCta,
    "--color-dark-cta-hover": tokens.color.darkCtaHover,
    "--color-warning": tokens.color.warning,
    "--color-danger": tokens.color.danger,
    "--nav-height": tokens.layout.navHeight,
    "--container-wide": tokens.layout.containerWide,
    "--container-feature": tokens.layout.containerFeature,
    "--container-faq": tokens.layout.containerFaq,
    "--section-padding-desktop": tokens.layout.sectionPaddingDesktop,
    "--section-padding-mobile": tokens.layout.sectionPaddingMobile,
    "--radius-sm": tokens.radius.sm,
    "--radius-md": tokens.radius.md,
    "--radius-lg": tokens.radius.lg,
    "--radius-xl": tokens.radius.xl,
    "--radius-panel": tokens.radius.panel,
    "--radius-pill": tokens.radius.pill
  } as CSSProperties;
}
