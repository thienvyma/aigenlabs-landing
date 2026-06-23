import { z } from "zod";
import type {
  CmsSection,
  ConversionCardsContent,
  FaqContent,
  FloatingDockContent,
  HeroSectionContent,
  PlatformFeaturesContent,
  ReleaseNotesContent,
  SecurityCardsContent,
  UseCaseTabsContent
} from "@/lib/types";

export const sectionTypeOptions = [
  "hero",
  "useCaseTabs",
  "platformFeatures",
  "releaseNotes",
  "securityCards",
  "conversionCards",
  "faq",
  "floatingDock"
] as const;

export type SectionType = (typeof sectionTypeOptions)[number];

export const sectionLabels: Record<SectionType, string> = {
  hero: "Hero",
  useCaseTabs: "Use-case tabs",
  platformFeatures: "Platform features",
  releaseNotes: "Setup steps",
  securityCards: "Security cards",
  conversionCards: "Conversion cards",
  faq: "FAQ",
  floatingDock: "Floating support dock"
};

export interface SectionContentByType {
  hero: HeroSectionContent;
  useCaseTabs: UseCaseTabsContent;
  platformFeatures: PlatformFeaturesContent;
  releaseNotes: ReleaseNotesContent;
  securityCards: SecurityCardsContent;
  conversionCards: ConversionCardsContent;
  faq: FaqContent;
  floatingDock: FloatingDockContent;
}

export type TypedCmsSection<TType extends SectionType = SectionType> = CmsSection<SectionContentByType[TType]> & {
  type: TType;
};

const ctaSchema = z.object({
  label: z.string(),
  href: z.string(),
  enabled: z.boolean().optional()
});

const editableMediaSchema = z.object({
  kind: z.enum(["image", "video"]),
  title: z.string(),
  label: z.string(),
  alt: z.string(),
  url: z.string(),
  poster: z.string().optional()
});

const heroContentSchema = z.object({
  wordmark: z.string(),
  headline: z.string(),
  subheadline: z.string(),
  chips: z.array(z.object({
    label: z.string(),
    enabled: z.boolean()
  })),
  primaryCta: ctaSchema,
  secondaryCta: ctaSchema,
  preview: editableMediaSchema
}) satisfies z.ZodType<HeroSectionContent>;

const useCaseTabsContentSchema = z.object({
  heading: z.string(),
  tabs: z.array(z.object({
    label: z.string(),
    title: z.string(),
    description: z.string(),
    mediaTitle: z.string(),
    media: editableMediaSchema.optional()
  }))
}) satisfies z.ZodType<UseCaseTabsContent>;

const platformFeaturesContentSchema = z.object({
  eyebrow: z.string(),
  heading: z.string(),
  description: z.string(),
  features: z.array(z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    layout: z.enum(["normal", "reverse"]),
    badge: z.string().optional(),
    slides: z.array(z.string()),
    media: editableMediaSchema.optional()
  }))
}) satisfies z.ZodType<PlatformFeaturesContent>;

const releaseNotesContentSchema = z.object({
  heading: z.string(),
  viewAllLabel: z.string(),
  viewAllHref: z.string(),
  items: z.array(z.object({
    version: z.string(),
    date: z.string(),
    bullets: z.array(z.string())
  }))
}) satisfies z.ZodType<ReleaseNotesContent>;

const securityCardsContentSchema = z.object({
  eyebrow: z.string(),
  heading: z.string(),
  description: z.string(),
  cards: z.array(z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string()
  })),
  cta: ctaSchema,
  note: z.string()
}) satisfies z.ZodType<SecurityCardsContent>;

const conversionCardsContentSchema = z.object({
  eyebrow: z.string(),
  heading: z.string(),
  description: z.string(),
  variant: z.enum(["default", "soft", "pricing", "cta"]).optional(),
  cards: z.array(z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    price: z.string().optional(),
    badge: z.string().optional(),
    bullets: z.array(z.string()).optional(),
    cta: ctaSchema.optional()
  })),
  cta: ctaSchema.optional(),
  note: z.string().optional()
}) satisfies z.ZodType<ConversionCardsContent>;

const faqContentSchema = z.object({
  heading: z.string(),
  items: z.array(z.object({
    question: z.string(),
    answer: z.string(),
    linkLabel: z.string(),
    linkHref: z.string()
  }))
}) satisfies z.ZodType<FaqContent>;

const floatingDockContactSchema = z.object({
  label: z.string(),
  href: z.string(),
  icon: z.string(),
  enabled: z.boolean().optional()
});

const floatingDockWebhookTriggerOptions = ["helper_open", "contact_click", "both"] as const;
const floatingDockWebhookTriggerSet = new Set<string>(floatingDockWebhookTriggerOptions);

const floatingDockWebhookSchema = z.object({
  enabled: z.boolean(),
  url: z.string(),
  eventName: z.string(),
  trigger: z.enum(floatingDockWebhookTriggerOptions)
});

const floatingDockContentSchema = z.preprocess((value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  const content = value as Record<string, unknown>;
  const supportHref = typeof content.supportHref === "string" ? content.supportHref : "";
  const supportLabel = typeof content.supportLabel === "string" ? content.supportLabel : "Contact";
  const contacts = Array.isArray(content.contacts)
    ? content.contacts
    : supportHref
      ? [{ label: supportLabel, href: supportHref, icon: "support", enabled: true }]
      : [];
  const webhook = content.webhook && typeof content.webhook === "object" && !Array.isArray(content.webhook)
    ? content.webhook as Record<string, unknown>
    : {};
  const rawTrigger = typeof webhook.trigger === "string" ? webhook.trigger : "helper_open";
  const legacyVisibility = typeof content.showBackToTop === "boolean" ? content.showBackToTop : true;
  return {
    showHelper: typeof content.showHelper === "boolean" ? content.showHelper : legacyVisibility,
    showBackToTop: legacyVisibility,
    backToTopLabel: typeof content.backToTopLabel === "string" ? content.backToTopLabel : "Về đầu trang",
    helperLabel: typeof content.helperLabel === "string" ? content.helperLabel : "Trợ lý",
    helperTooltip: typeof content.helperTooltip === "string" ? content.helperTooltip : "Mở kênh hỗ trợ",
    helperIcon: typeof content.helperIcon === "string" ? content.helperIcon : "support",
    contacts,
    webhook: {
      enabled: typeof webhook.enabled === "boolean" ? webhook.enabled : false,
      url: typeof webhook.url === "string" ? webhook.url : "",
      eventName: typeof webhook.eventName === "string" ? webhook.eventName : "floating_helper",
      trigger: floatingDockWebhookTriggerSet.has(rawTrigger) ? rawTrigger : "helper_open"
    }
  };
}, z.object({
  showHelper: z.boolean(),
  showBackToTop: z.boolean(),
  backToTopLabel: z.string(),
  helperLabel: z.string(),
  helperTooltip: z.string(),
  helperIcon: z.string(),
  contacts: z.array(floatingDockContactSchema),
  webhook: floatingDockWebhookSchema
})) satisfies z.ZodType<FloatingDockContent>;

export const sectionContentSchemas = {
  hero: heroContentSchema,
  useCaseTabs: useCaseTabsContentSchema,
  platformFeatures: platformFeaturesContentSchema,
  releaseNotes: releaseNotesContentSchema,
  securityCards: securityCardsContentSchema,
  conversionCards: conversionCardsContentSchema,
  faq: faqContentSchema,
  floatingDock: floatingDockContentSchema
} satisfies { [TType in SectionType]: z.ZodType<SectionContentByType[TType]> };

const sectionTypeSet = new Set<string>(sectionTypeOptions);

export function isSectionType(type: string): type is SectionType {
  return sectionTypeSet.has(type);
}

export function parseSectionContent<TType extends SectionType>(
  type: TType,
  content: unknown
): SectionContentByType[TType] {
  return sectionContentSchemas[type].parse(content) as SectionContentByType[TType];
}

export function safeParseSectionContent<TType extends SectionType>(type: TType, content: unknown) {
  return sectionContentSchemas[type].safeParse(content);
}

export const cmsSectionSchema = z.object({
  id: z.string(),
  type: z.string(),
  name: z.string(),
  key: z.string(),
  enabled: z.boolean(),
  order: z.number(),
  content: z.unknown(),
  styleOverrides: z.record(z.string(), z.unknown()).optional()
}).superRefine((section, ctx) => {
  if (!isSectionType(section.type)) {
    ctx.addIssue({
      code: "custom",
      path: ["type"],
      message: `Unknown section type: ${section.type}`
    });
    return;
  }

  const result = safeParseSectionContent(section.type, section.content);
  if (!result.success) {
    for (const issue of result.error.issues) {
      ctx.addIssue({
        ...issue,
        path: ["content", ...issue.path]
      });
    }
  }
});
