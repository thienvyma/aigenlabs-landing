import "server-only";

import path from "node:path";
import sharp from "sharp";
import type { AssetItem } from "@/lib/types";

const maxUploadBytes = 10 * 1024 * 1024;
const maxImageDimension = 2400;
const maxImagePixels = 24_000_000;

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedVideoTypes = new Set(["video/mp4", "video/webm"]);
const allowedDocumentTypes = new Set(["application/pdf"]);

export interface PreparedAssetUpload {
  body: Buffer;
  fileName: string;
  mimeType: string;
  kind: AssetItem["kind"];
  width?: number;
  height?: number;
}

export function safeFileBase(name: string): string {
  const parsed = path.parse(name);
  return parsed.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "asset";
}

function kindFromMime(mimeType: string): AssetItem["kind"] {
  if (allowedImageTypes.has(mimeType)) return "image";
  if (allowedVideoTypes.has(mimeType)) return "video";
  return "document";
}

function assertAllowedFile(file: File) {
  const mimeType = file.type || "";
  if (!allowedImageTypes.has(mimeType) && !allowedVideoTypes.has(mimeType) && !allowedDocumentTypes.has(mimeType)) {
    throw new Error("Unsupported file type. Use JPG, PNG, WebP, MP4, WebM, or PDF.");
  }
  if (file.size <= 0 || file.size > maxUploadBytes) {
    throw new Error("File must be between 1 byte and 10 MB.");
  }
}

async function prepareImage(buffer: Buffer, id: string, originalName: string): Promise<PreparedAssetUpload> {
  const image = sharp(buffer, { failOn: "error", limitInputPixels: maxImagePixels });
  const metadata = await image.metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error("Image dimensions could not be read.");
  }

  const output = await image
    .rotate()
    .resize({
      width: maxImageDimension,
      height: maxImageDimension,
      fit: "inside",
      withoutEnlargement: true
    })
    .webp({ quality: 82, effort: 5 })
    .toBuffer({ resolveWithObject: true });

  return {
    body: output.data,
    fileName: `${id}-${safeFileBase(originalName)}.webp`,
    mimeType: "image/webp",
    kind: "image",
    width: output.info.width,
    height: output.info.height
  };
}

function prepareBinary(buffer: Buffer, id: string, file: File): PreparedAssetUpload {
  const parsed = path.parse(file.name);
  const ext = parsed.ext.toLowerCase().replace(/[^a-z0-9.]/g, "");
  return {
    body: buffer,
    fileName: `${id}-${safeFileBase(file.name)}${ext}`,
    mimeType: file.type || "application/octet-stream",
    kind: kindFromMime(file.type || "")
  };
}

export async function prepareAssetUpload(file: File, id: string): Promise<PreparedAssetUpload> {
  assertAllowedFile(file);
  const buffer = Buffer.from(await file.arrayBuffer());
  if (allowedImageTypes.has(file.type || "")) {
    return prepareImage(buffer, id, file.name);
  }
  return prepareBinary(buffer, id, file);
}
