import type { ReactNode } from "react";
import type {
  CmsSection,
  SiteSettings,
} from "@/lib/types";
import { isSectionType, parseSectionContent, type SectionType } from "@/cms/sections/schema";
import { HeroSection } from "@/components/landing/sections/HeroSection";
import { UseCaseTabsSection } from "@/components/landing/sections/UseCaseTabsSection";
import { PlatformFeaturesSection } from "@/components/landing/sections/PlatformFeaturesSection";
import { ReleaseNotesSection } from "@/components/landing/sections/ReleaseNotesSection";
import { SecurityCardsSection } from "@/components/landing/sections/SecurityCardsSection";
import { FaqSection } from "@/components/landing/sections/FaqSection";
import { FloatingDock } from "@/components/landing/sections/FloatingDock";

interface SectionRendererProps {
  section: CmsSection;
  settings: SiteSettings;
}

const sectionRenderers: Record<SectionType, (section: CmsSection, settings: SiteSettings) => ReactNode> = {
  hero: (section, settings) => (
    <HeroSection id={section.id} content={parseSectionContent("hero", section.content)} settings={settings} />
  ),
  useCaseTabs: (section) => (
    <UseCaseTabsSection id={section.id} content={parseSectionContent("useCaseTabs", section.content)} />
  ),
  platformFeatures: (section) => (
    <PlatformFeaturesSection id={section.id} content={parseSectionContent("platformFeatures", section.content)} />
  ),
  releaseNotes: (section) => (
    <ReleaseNotesSection id={section.id} content={parseSectionContent("releaseNotes", section.content)} />
  ),
  securityCards: (section) => (
    <SecurityCardsSection id={section.id} content={parseSectionContent("securityCards", section.content)} />
  ),
  faq: (section) => (
    <FaqSection id={section.id} content={parseSectionContent("faq", section.content)} />
  ),
  floatingDock: (section) => (
    <FloatingDock content={parseSectionContent("floatingDock", section.content)} />
  )
};

export function SectionRenderer({ section, settings }: SectionRendererProps) {
  if (!isSectionType(section.type)) return null;
  return sectionRenderers[section.type](section, settings);
}
