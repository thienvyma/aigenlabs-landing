import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getCmsData, saveCmsData } from "@/lib/cms";
import type { CmsData } from "@/lib/types";

async function requireSession() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;
  const data = await getCmsData();
  return NextResponse.json({ ok: true, data });
}

export async function PUT(request: Request) {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;
  const data = (await request.json()) as CmsData;
  const current = await getCmsData();
  const now = new Date().toISOString();
  const currentPages = new Map(current.pages.map((page) => [page.id, page]));
  const submittedAssetIds = new Set(data.assets.map((asset) => asset.id));
  const mergedAssets = [
    ...data.assets,
    ...current.assets.filter((asset) => !submittedAssetIds.has(asset.id))
  ];

  try {
    const saved = await saveCmsData({
      ...data,
      assets: mergedAssets,
      pages: data.pages.map((page) => {
        const currentPage = currentPages.get(page.id);
        const pageChanged = !currentPage || JSON.stringify({ ...page, updatedAt: "", publishedAt: "" }) !== JSON.stringify({ ...currentPage, updatedAt: "", publishedAt: "" });
        return {
          ...page,
          updatedAt: pageChanged ? now : currentPage.updatedAt,
          publishedAt: page.status === "published" ? page.publishedAt || currentPage?.publishedAt || now : page.publishedAt
        };
      })
    });
    return NextResponse.json({ ok: true, data: saved });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Invalid CMS data" }, { status: 400 });
  }
}
