import type { MetadataRoute } from "next";
import { getCmsData } from "@/lib/cms";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const data = await getCmsData();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/admin"]
    },
    sitemap: `${data.settings.siteUrl.replace(/\/$/, "")}/sitemap.xml`
  };
}
