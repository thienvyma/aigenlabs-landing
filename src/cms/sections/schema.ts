import { z } from "zod";
import type {
  CmsSection,
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
  "faq",
  "floatingDock"
] as const;

export type SectionType = (typeof sectionTypeOptions)[number];

export const sectionLabels: Record<SectionType, string> = {
  hero: "Hero",
  useCaseTabs: "Use-case tabs",
  platformFeatures: "Platform features",
  releaseNotes: "Release notes",
  securityCards: "Security cards",
  faq: "FAQ",
  floatingDock: "Floating dock"
};

export interface SectionContentByType {
  hero: HeroSectionContent;
  useCaseTabs: UseCaseTabsContent;
  platformFeatures: PlatformFeaturesContent;
  releaseNotes: ReleaseNotesContent;
  securityCards: SecurityCardsContent;
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

const floatingDockContentSchema = z.preprocess((value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  const content = value as Record<string, unknown>;
  if (Array.isArray(content.contacts)) return value;
  const supportHref = typeof content.supportHref === "string" ? content.supportHref : "";
  const supportLabel = typeof content.supportLabel === "string" ? content.supportLabel : "Liên hệ";
  return {
    showBackToTop: typeof content.showBackToTop === "boolean" ? content.showBackToTop : true,
    contacts: supportHref ? [{ label: supportLabel, href: supportHref, icon: "support", enabled: true }] : []
  };
}, z.object({
  showBackToTop: z.boolean(),
  contacts: z.array(floatingDockContactSchema)
})) satisfies z.ZodType<FloatingDockContent>;

export const sectionContentSchemas = {
  hero: heroContentSchema,
  useCaseTabs: useCaseTabsContentSchema,
  platformFeatures: platformFeaturesContentSchema,
  releaseNotes: releaseNotesContentSchema,
  securityCards: securityCardsContentSchema,
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
