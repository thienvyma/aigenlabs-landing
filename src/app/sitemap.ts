import type { MetadataRoute } from "next";
import { getCmsData, getPublishedPages } from "@/lib/cms";
import { absoluteUrl } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const policyUpdatedAt = "2026-06-22T00:00:00.000Z";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getCmsData();
  const pages = await getPublishedPages();
  const cmsRoutes = pages.filter((page) => page.seo.robotsIndex).map((page) => ({
    url: absoluteUrl(data.settings, page.path),
    lastModified: page.updatedAt,
    changeFrequency: "weekly" as const,
    priority: page.path === "/" ? 1 : 0.7
  }));

  return [
    ...cmsRoutes,
    {
      url: absoluteUrl(data.settings, "/policy"),
      lastModified: policyUpdatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5
    }
  ];
}
