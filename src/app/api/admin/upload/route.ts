import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getAdminSession } from "@/lib/auth";
import { addAsset, storeAssetFile } from "@/lib/cms";
import { prepareAssetUpload } from "@/lib/asset-upload";
import type { AssetItem } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const alt = String(form.get("alt") ?? "");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Missing file" }, { status: 400 });
  }

  const id = randomUUID();
  let prepared;
  try {
    prepared = await prepareAssetUpload(file, id);
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Invalid asset" }, { status: 400 });
  }
  const storedFile = await storeAssetFile(prepared.fileName, prepared.mimeType, prepared.body);

  const now = new Date().toISOString();
  const asset: AssetItem = {
    id,
    fileName: prepared.fileName,
    url: storedFile.url,
    mimeType: prepared.mimeType,
    kind: prepared.kind,
    alt,
    width: prepared.width,
    height: prepared.height,
    createdAt: now,
    updatedAt: now
  };

  await addAsset(asset);
  return NextResponse.json({ ok: true, asset });
}
