import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCmsData, getPageByPath } from "@/lib/cms";
import { getLocalizedSiteSettings } from "@/lib/i18n";
import { jsonLdForPage, pageMetadata } from "@/lib/metadata";
import { LandingPage } from "@/components/landing/LandingPage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const data = await getCmsData();
  const page = await getPageByPath("/");
  if (!page) return {};
  return pageMetadata(getLocalizedSiteSettings(data.settings, page.locale), page);
}

export default async function HomePage() {
  const data = await getCmsData();
  const page = await getPageByPath("/");
  if (!page) notFound();
  const settings = getLocalizedSiteSettings(data.settings, page.locale);
  const schemas = jsonLdForPage(settings, page);

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <LandingPage page={page} settings={settings} />
    </>
  );
}
