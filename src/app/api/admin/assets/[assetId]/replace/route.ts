import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getAdminSession } from "@/lib/auth";
import { deleteAssetFile, replaceAsset, storeAssetFile } from "@/lib/cms";
import { prepareAssetUpload } from "@/lib/asset-upload";
import type { AssetItem } from "@/lib/types";

interface RouteContext {
  params: Promise<{ assetId: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { assetId } = await context.params;
  const form = await request.formData();
  const file = form.get("file");
  const alt = String(form.get("alt") ?? "");
  const caption = String(form.get("caption") ?? "");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Missing file" }, { status: 400 });
  }

  let prepared;
  try {
    prepared = await prepareAssetUpload(file, `${assetId}-${randomUUID()}`);
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Invalid asset" }, { status: 400 });
  }

  const storedFile = await storeAssetFile(prepared.fileName, prepared.mimeType, prepared.body);
  const now = new Date().toISOString();
  const nextAsset: AssetItem = {
    id: assetId,
    fileName: prepared.fileName,
    url: storedFile.url,
    mimeType: prepared.mimeType,
    kind: prepared.kind,
    alt,
    width: prepared.width,
    height: prepared.height,
    caption,
    createdAt: now,
    updatedAt: now
  };

  try {
    const { data, previousAsset } = await replaceAsset(assetId, nextAsset);
    try {
      if (previousAsset.url !== nextAsset.url) {
        await deleteAssetFile(previousAsset.url);
      }
    } catch (error) {
      return NextResponse.json({
        ok: true,
        data,
        asset: nextAsset,
        warning: error instanceof Error ? error.message : "Old asset could not be deleted."
      });
    }
    return NextResponse.json({ ok: true, data, asset: nextAsset });
  } catch (error) {
    await deleteAssetFile(storedFile.url);
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Replace failed" }, { status: 400 });
  }
}
