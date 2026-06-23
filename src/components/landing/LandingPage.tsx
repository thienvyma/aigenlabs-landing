import type { CmsPage, SiteSettings } from "@/lib/types";
import { tokensToCssVariables } from "@/design/tokens";
import { sortByOrder } from "@/lib/utils";
import { SiteNav } from "@/components/landing/SiteNav";
import { SectionRenderer } from "@/components/landing/SectionRenderer";
import { SiteFooter } from "@/components/landing/SiteFooter";

interface LandingPageProps {
  page: CmsPage;
  settings: SiteSettings;
}

export function LandingPage({ page, settings }: LandingPageProps) {
  const sections = sortByOrder(page.sections).filter((section) => section.enabled);
  return (
    <div className="site-shell" style={tokensToCssVariables(settings.brand.tokens)}>
      <SiteNav settings={settings} currentLocale={page.locale} />
      <main>
        {sections.map((section) => (
          <SectionRenderer key={section.id} section={section} settings={settings} />
        ))}
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
