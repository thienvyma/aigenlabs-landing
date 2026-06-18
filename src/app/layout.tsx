import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Be_Vietnam_Pro, Space_Grotesk } from "next/font/google";
import "@/app/globals.css";
import { getCmsData } from "@/lib/cms";
import { getLocaleFromPath } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap"
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-be-vietnam-pro",
  display: "swap"
});

export async function generateMetadata(): Promise<Metadata> {
  const data = await getCmsData();
  return {
    metadataBase: new URL(data.settings.siteUrl),
    title: {
      default: data.settings.siteName,
      template: `%s | ${data.settings.siteName}`
    },
    description: data.settings.brand.tagline,
    icons: data.settings.brand.faviconUrl ? [{ rel: "icon", url: data.settings.brand.faviconUrl }] : undefined
  };
}

export async function generateViewport(): Promise<Viewport> {
  const data = await getCmsData();
  return {
    themeColor: data.settings.themeColor,
    width: "device-width",
    initialScale: 1
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const data = await getCmsData();
  const requestHeaders = await headers();
  const pathname = requestHeaders.get("x-pathname") ?? "/";
  return (
    <html lang={getLocaleFromPath(pathname, data.settings)}>
      <body className={`${spaceGrotesk.variable} ${beVietnamPro.variable}`}>{children}</body>
    </html>
  );
}
