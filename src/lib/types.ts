export interface BrandColorTokens {
  background: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  textLight: string;
  brand: string;
  brandDark: string;
  brandLight: string;
  brandSoft: string;
  darkCta: string;
  darkCtaHover: string;
  warning: string;
  danger: string;
}

export interface BrandLayoutTokens {
  navHeight: string;
  containerWide: string;
  containerFeature: string;
  containerFaq: string;
  sectionPaddingDesktop: string;
  sectionPaddingMobile: string;
}

export interface BrandRadiusTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  panel: string;
  pill: string;
}

export interface BrandTokens {
  color: BrandColorTokens;
  layout: BrandLayoutTokens;
  radius: BrandRadiusTokens;
}

export interface BrandSettings {
  name: string;
  tagline: string;
  logoText: string;
  logoUrl: string;
  faviconUrl: string;
  tokens: BrandTokens;
}

export interface NavigationChild {
  label: string;
  href: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  kind: "link" | "dropdown";
  badge?: string;
  children?: NavigationChild[];
}

export interface CtaLink {
  label: string;
  href: string;
  enabled?: boolean;
}

export interface NavigationSettings {
  items: NavigationItem[];
  languageLabel: string;
  secondaryCta: CtaLink;
  signIn: CtaLink;
  primaryCta: CtaLink;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterSettings {
  columns: FooterColumn[];
  copyright: string;
}

export interface LocaleSettings {
  code: string;
  label: string;
  nativeLabel: string;
  pathPrefix: string;
  navigation: NavigationSettings;
  footer: FooterSettings;
}

export interface SiteSettings {
  siteName: string;
  siteUrl: string;
  defaultLocale: string;
  supportedLocales?: LocaleSettings[];
  themeColor: string;
  brand: BrandSettings;
  navigation: NavigationSettings;
  footer: FooterSettings;
}

export interface AssetItem {
  id: string;
  fileName: string;
  url: string;
  mimeType: string;
  kind: "image" | "video" | "document";
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageSeo {
  title: string;
  description: string;
  canonicalPath: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: "summary" | "summary_large_image";
  keywords: string[];
  schemas: {
    organization: boolean;
    website: boolean;
    softwareApplication: boolean;
    faq: boolean;
  };
}

export interface CmsSection<TContent = Record<string, unknown>> {
  id: string;
  type: string;
  name: string;
  key: string;
  enabled: boolean;
  order: number;
  content: TContent;
  styleOverrides?: Record<string, unknown>;
}

export interface CmsPage {
  id: string;
  slug: string;
  path: string;
  locale: string;
  status: "draft" | "published" | "archived";
  title: string;
  seo: PageSeo;
  sections: CmsSection[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface RedirectRule {
  source: string;
  destination: string;
  permanent: boolean;
}

export interface CmsData {
  settings: SiteSettings;
  assets: AssetItem[];
  pages: CmsPage[];
  redirects: RedirectRule[];
}

export interface EditableMedia {
  kind: "image" | "video";
  title: string;
  label: string;
  alt: string;
  url: string;
  poster?: string;
}

export interface HeroSectionContent {
  wordmark: string;
  headline: string;
  subheadline: string;
  chips: Array<{ label: string; enabled: boolean }>;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
  preview: EditableMedia;
}

export interface UseCaseTabsContent {
  heading: string;
  tabs: Array<{
    label: string;
    title: string;
    description: string;
    mediaTitle: string;
    media?: EditableMedia;
  }>;
}

export interface PlatformFeaturesContent {
  eyebrow: string;
  heading: string;
  description: string;
  features: Array<{
    title: string;
    description: string;
    icon: string;
    layout: "normal" | "reverse";
    badge?: string;
    slides: string[];
    media?: EditableMedia;
  }>;
}

export interface ReleaseNotesContent {
  heading: string;
  viewAllLabel: string;
  viewAllHref: string;
  items: Array<{
    version: string;
    date: string;
    bullets: string[];
  }>;
}

export interface SecurityCardsContent {
  eyebrow: string;
  heading: string;
  description: string;
  cards: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  cta: CtaLink;
  note: string;
}

export interface ConversionCardsContent {
  eyebrow: string;
  heading: string;
  description: string;
  variant?: "default" | "soft" | "pricing" | "cta";
  cards: Array<{
    title: string;
    description: string;
    icon: string;
    price?: string;
    badge?: string;
    bullets?: string[];
    cta?: CtaLink;
  }>;
  cta?: CtaLink;
  note?: string;
}

export interface FaqContent {
  heading: string;
  items: Array<{
    question: string;
    answer: string;
    linkLabel: string;
    linkHref: string;
  }>;
}

export interface FloatingDockContact {
  label: string;
  href: string;
  icon: string;
  enabled?: boolean;
}

export type FloatingDockWebhookTrigger = "helper_open" | "contact_click" | "both";

export interface FloatingDockWebhook {
  enabled: boolean;
  url: string;
  eventName: string;
  trigger: FloatingDockWebhookTrigger;
}

export interface FloatingDockContent {
  showBackToTop: boolean;
  helperLabel: string;
  helperTooltip: string;
  helperIcon: string;
  contacts: FloatingDockContact[];
  webhook: FloatingDockWebhook;
}
