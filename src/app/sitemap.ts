import type { MetadataRoute } from "next";
import { getCmsData, getPublishedPages } from "@/lib/cms";
import { absoluteUrl } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getCmsData();
  const pages = await getPublishedPages();
  return pages.filter((page) => page.seo.robotsIndex).map((page) => ({
    url: absoluteUrl(data.settings, page.path),
    lastModified: page.updatedAt,
    changeFrequency: "weekly",
    priority: page.path === "/" ? 1 : 0.7
  }));
}
