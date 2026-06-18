import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { cmsSectionSchema } from "@/cms/sections/schema";
import type { AssetItem, CmsData, CmsPage } from "@/lib/types";

const cmsPath = path.join(process.cwd(), "data", "cms.json");
const cmsTableName = "landing_cms_documents";
const cmsDocumentId = process.env.CMS_DOCUMENT_ID?.trim() || "default";
const supabaseAssetBucket = process.env.SUPABASE_STORAGE_BUCKET?.trim() || "landing-assets";

type CmsStorageDriver = "local" | "supabase";

interface StoredAssetFile {
  url: string;
}

let supabaseAdminClient: SupabaseClient | null = null;

const ctaSchema = z.object({
  label: z.string(),
  href: z.string(),
  enabled: z.boolean().optional()
});

const navigationChildSchema = z.object({
  label: z.string(),
  href: z.string()
});

const navigationItemSchema = z.object({
  label: z.string(),
  href: z.string(),
  kind: z.enum(["link", "dropdown"]),
  badge: z.string().optional(),
  children: z.array(navigationChildSchema).optional()
});

const navigationSchema = z.object({
  items: z.array(navigationItemSchema),
  languageLabel: z.string(),
  secondaryCta: ctaSchema,
  signIn: ctaSchema,
  primaryCta: ctaSchema
});

const footerSchema = z.object({
  columns: z.array(z.object({
    title: z.string(),
    links: z.array(z.object({
      label: z.string(),
      href: z.string()
    }))
  })),
  copyright: z.string()
});

const localeSchema = z.object({
  code: z.enum(["vi", "en"]),
  label: z.string(),
  nativeLabel: z.string(),
  pathPrefix: z.string(),
  navigation: navigationSchema,
  footer: footerSchema
});

const seoSchema = z.object({
  title: z.string(),
  description: z.string(),
  canonicalPath: z.string().regex(/^\//),
  robotsIndex: z.boolean(),
  robotsFollow: z.boolean(),
  ogTitle: z.string(),
  ogDescription: z.string(),
  ogImage: z.string(),
  twitterCard: z.enum(["summary", "summary_large_image"]),
  keywords: z.array(z.string()),
  schemas: z.object({
    organization: z.boolean(),
    website: z.boolean(),
    softwareApplication: z.boolean(),
    faq: z.boolean()
  })
});

const pageSchema = z.object({
  id: z.string(),
  slug: z.string(),
  path: z.string().regex(/^\//),
  locale: z.enum(["vi", "en"]),
  status: z.enum(["draft", "published", "archived"]),
  title: z.string(),
  seo: seoSchema,
  sections: z.array(cmsSectionSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional()
});

const assetSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  url: z.string(),
  mimeType: z.string(),
  kind: z.enum(["image", "video", "document"]),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  caption: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

const cmsSchema = z.object({
  settings: z.object({
    siteName: z.string(),
    siteUrl: z.string(),
    defaultLocale: z.string(),
    supportedLocales: z.array(localeSchema).optional(),
    themeColor: z.string(),
    brand: z.record(z.string(), z.unknown()),
    navigation: navigationSchema,
    footer: footerSchema
  }),
  assets: z.array(assetSchema),
  pages: z.array(pageSchema),
  redirects: z.array(z.object({
    source: z.string(),
    destination: z.string(),
    permanent: z.boolean()
  }))
}).superRefine((data, ctx) => {
  if (data.pages.length !== 1 || data.pages[0]?.path !== "/") {
    ctx.addIssue({ code: "custom", path: ["pages"], message: "This app is home-only: CMS data must contain exactly one page at /." });
  }
  if (data.pages[0]?.status !== "published" || data.pages[0]?.locale !== "vi") {
    ctx.addIssue({ code: "custom", path: ["pages", 0], message: "The homepage must stay published in Vietnamese." });
  }

  const paths = new Set<string>();
  for (const page of data.pages) {
    if (paths.has(page.path)) {
      ctx.addIssue({ code: "custom", path: ["pages"], message: `Duplicate page path: ${page.path}` });
    }
    paths.add(page.path);
    if (page.seo.canonicalPath !== page.path) {
      ctx.addIssue({ code: "custom", path: ["pages", page.id, "seo", "canonicalPath"], message: `Canonical path must match page path: ${page.path}` });
    }
    if (page.locale === "vi" && (page.path === "/en" || page.path.startsWith("/en/"))) {
      ctx.addIssue({ code: "custom", path: ["pages", page.id, "path"], message: "Vietnamese pages must not live under /en." });
    }
    if (page.locale === "en" && page.path !== "/en" && !page.path.startsWith("/en/")) {
      ctx.addIssue({ code: "custom", path: ["pages", page.id, "path"], message: "English pages must live under /en." });
    }
  }

  const locales = data.settings.supportedLocales ?? [];
  if (locales.length) {
    const localeCodes = new Set(locales.map((locale) => locale.code));
    if (!localeCodes.has(data.settings.defaultLocale as "vi" | "en")) {
      ctx.addIssue({ code: "custom", path: ["settings", "defaultLocale"], message: "Default locale must exist in supportedLocales." });
    }
  }
});

function getCmsStorageDriver(): CmsStorageDriver {
  const explicitDriver = process.env.CMS_STORAGE_DRIVER?.trim().toLowerCase();
  if (explicitDriver === "local" || explicitDriver === "supabase") return explicitDriver;
  if (explicitDriver) {
    throw new Error("CMS_STORAGE_DRIVER must be either 'local' or 'supabase'.");
  }
  return process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY)
    ? "supabase"
    : "local";
}

function getSupabaseAdminClient(): SupabaseClient {
  if (supabaseAdminClient) return supabaseAdminClient;

  const supabaseUrl = process.env.SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseServerKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env.SUPABASE_SECRET_KEY?.trim();

  if (!supabaseUrl || !supabaseServerKey) {
    throw new Error("Supabase CMS storage requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY.");
  }

  supabaseAdminClient = createClient(supabaseUrl, supabaseServerKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  return supabaseAdminClient;
}

async function readLocalCmsData(): Promise<CmsData> {
  const raw = await fs.readFile(cmsPath, "utf8");
  const parsed = JSON.parse(raw) as CmsData;
  cmsSchema.parse(parsed);
  return parsed;
}

async function writeLocalCmsData(data: CmsData): Promise<CmsData> {
  const now = new Date().toISOString();
  const next: CmsData = {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      updatedAt: page.updatedAt || now
    }))
  };
  const tmpPath = `${cmsPath}.tmp`;
  await fs.writeFile(tmpPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  await fs.rename(tmpPath, cmsPath);
  return next;
}

async function readSupabaseCmsData(): Promise<CmsData> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from(cmsTableName)
    .select("data")
    .eq("id", cmsDocumentId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to read Supabase CMS data: ${error.message}`);
  }

  if (data?.data) {
    const parsed = data.data as CmsData;
    cmsSchema.parse(parsed);
    return parsed;
  }

  const seed = await readLocalCmsData();
  await writeSupabaseCmsData(seed);
  return seed;
}

async function writeSupabaseCmsData(data: CmsData): Promise<CmsData> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from(cmsTableName)
    .upsert({ id: cmsDocumentId, data }, { onConflict: "id" });

  if (error) {
    throw new Error(`Failed to save Supabase CMS data: ${error.message}`);
  }

  return data;
}

export async function getCmsData(): Promise<CmsData> {
  return getCmsStorageDriver() === "supabase" ? readSupabaseCmsData() : readLocalCmsData();
}

export async function saveCmsData(data: CmsData): Promise<CmsData> {
  cmsSchema.parse(data);
  const next = {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      updatedAt: page.updatedAt || new Date().toISOString()
    }))
  };

  return getCmsStorageDriver() === "supabase" ? writeSupabaseCmsData(next) : writeLocalCmsData(next);
}

export async function getPublishedPages(): Promise<CmsPage[]> {
  const data = await getCmsData();
  return data.pages.filter((page) => page.status === "published");
}

export async function getPageByPath(publicPath: string): Promise<CmsPage | null> {
  const data = await getCmsData();
  const normalizedPath = publicPath === "" ? "/" : publicPath;
  return data.pages.find((page) => page.status === "published" && page.path === normalizedPath) ?? null;
}

export async function getPageBySlug(slug: string): Promise<CmsPage | null> {
  const data = await getCmsData();
  return data.pages.find((page) => page.status === "published" && page.slug === slug) ?? null;
}

export async function addAsset(asset: AssetItem): Promise<CmsData> {
  const data = await getCmsData();
  return saveCmsData({
    ...data,
    assets: [asset, ...data.assets]
  });
}

function replaceStringValue(value: unknown, from: string, to: string): unknown {
  if (value === from) return to;
  if (Array.isArray(value)) return value.map((entry) => replaceStringValue(entry, from, to));
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [key, replaceStringValue(entry, from, to)])
  );
}

export async function replaceAsset(assetId: string, nextAsset: AssetItem): Promise<{ data: CmsData; previousAsset: AssetItem }> {
  const data = await getCmsData();
  const previousAsset = data.assets.find((asset) => asset.id === assetId);
  if (!previousAsset) {
    throw new Error("Asset not found.");
  }

  const rewritten = replaceStringValue(data, previousAsset.url, nextAsset.url) as CmsData;
  return {
    data: await saveCmsData({
      ...rewritten,
      assets: rewritten.assets.map((asset) => (
        asset.id === assetId ? { ...nextAsset, createdAt: previousAsset.createdAt } : asset
      ))
    }),
    previousAsset
  };
}

function storagePathFromPublicUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${supabaseAssetBucket}/`;
  const markerIndex = url.indexOf(marker);
  if (markerIndex < 0) return null;
  const rawPath = url.slice(markerIndex + marker.length).split("?")[0] ?? "";
  return rawPath ? decodeURIComponent(rawPath) : null;
}

export async function deleteAssetFile(url: string): Promise<void> {
  if (getCmsStorageDriver() === "supabase") {
    const objectPath = storagePathFromPublicUrl(url);
    if (!objectPath) return;
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.storage.from(supabaseAssetBucket).remove([objectPath]);
    if (error) {
      throw new Error(`Failed to delete old asset from Supabase Storage: ${error.message}`);
    }
    return;
  }

  if (!url.startsWith("/uploads/")) return;
  const diskPath = path.join(process.cwd(), "public", url);
  try {
    await fs.unlink(diskPath);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "ENOENT") throw error;
  }
}

export async function storeAssetFile(fileName: string, mimeType: string, body: Buffer): Promise<StoredAssetFile> {
  if (getCmsStorageDriver() === "supabase") {
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.storage
      .from(supabaseAssetBucket)
      .upload(fileName, body, {
        cacheControl: "31536000",
        contentType: mimeType,
        upsert: false
      });

    if (error) {
      throw new Error(`Failed to upload asset to Supabase Storage: ${error.message}`);
    }

    const { data } = supabase.storage.from(supabaseAssetBucket).getPublicUrl(fileName);
    return { url: data.publicUrl };
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const diskPath = path.join(uploadDir, fileName);
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(diskPath, body);
  return { url: `/uploads/${fileName}` };
}
