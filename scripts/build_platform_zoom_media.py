#!/usr/bin/env python3
"""Build animated platform media from real AigenLabs Desktop screenshots."""

from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
MEDIA_DIR = ROOT / "public" / "uploads" / "landing-media" / "current"
SOURCE_DIR = ROOT / "media-sources" / "platform-zoom-2026-06-18"
OUTPUT_SIZE = (1600, 900)
FRAMES = 42
FRAME_DURATION_MS = 58


@dataclass(frozen=True)
class ZoomMedia:
    output: str
    source: Path
    focus: tuple[float, float]
    zoom_start: float
    zoom_end: float
    sharpen: bool = True


MEDIA: list[ZoomMedia] = [
    ZoomMedia(
        output="platform-agent-hub-ai-staff.webp",
        source=SOURCE_DIR / "agent-hub-ai-staff.png",
        focus=(0.49, 0.40),
        zoom_start=1.05,
        zoom_end=2.06,
    ),
    # The real Cron screenshot is intentionally empty today. Use a real workflow
    # map as the closest non-mock operational automation surface until a cron job
    # demo can be captured from the running app.
    ZoomMedia(
        output="platform-automation-cron.webp",
        source=SOURCE_DIR / "automation-workflow-map.png",
        focus=(0.66, 0.46),
        zoom_start=1.0,
        zoom_end=1.62,
    ),
    ZoomMedia(
        output="platform-browser-tool-config.webp",
        source=SOURCE_DIR / "browser-tool-config.png",
        focus=(0.50, 0.34),
        zoom_start=1.02,
        zoom_end=2.15,
    ),
    ZoomMedia(
        output="platform-connectors-google-workspace.webp",
        source=SOURCE_DIR / "connectors-google-workspace.png",
        focus=(0.42, 0.24),
        zoom_start=1.0,
        zoom_end=2.35,
    ),
    ZoomMedia(
        output="platform-skills-library.webp",
        source=SOURCE_DIR / "skills-library.png",
        focus=(0.57, 0.44),
        zoom_start=1.02,
        zoom_end=1.82,
    ),
    ZoomMedia(
        output="platform-work-channels-messaging.webp",
        source=SOURCE_DIR / "work-channels-messaging.png",
        focus=(0.49, 0.34),
        zoom_start=1.0,
        zoom_end=1.95,
    ),
    ZoomMedia(
        output="platform-session-pairing-gateway.webp",
        source=SOURCE_DIR / "session-pairing-gateway.png",
        focus=(0.42, 0.36),
        zoom_start=1.0,
        zoom_end=1.92,
    ),
    ZoomMedia(
        output="platform-team-ai-staff.webp",
        source=SOURCE_DIR / "team-orchestration-workflow-map.png",
        focus=(0.58, 0.34),
        zoom_start=1.0,
        zoom_end=1.58,
    ),
]


def ease(t: float) -> float:
    if t < 0.5:
        return 4 * t * t * t
    return 1 - pow(-2 * t + 2, 3) / 2


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def fit_cover_crop(img: Image.Image, target_ratio: float = 16 / 9) -> Image.Image:
    width, height = img.size
    ratio = width / height
    if abs(ratio - target_ratio) < 0.001:
        return img
    if ratio > target_ratio:
        crop_w = int(height * target_ratio)
        left = (width - crop_w) // 2
        return img.crop((left, 0, left + crop_w, height))
    crop_h = int(width / target_ratio)
    top = max(0, (height - crop_h) // 2)
    return img.crop((0, top, width, top + crop_h))


def crop_zoom(img: Image.Image, zoom: float, focus: tuple[float, float]) -> Image.Image:
    width, height = img.size
    crop_w = max(1, int(width / zoom))
    crop_h = max(1, int(height / zoom))
    cx = int(width * focus[0])
    cy = int(height * focus[1])
    left = max(0, min(width - crop_w, cx - crop_w // 2))
    top = max(0, min(height - crop_h, cy - crop_h // 2))
    return img.crop((left, top, left + crop_w, top + crop_h)).resize(OUTPUT_SIZE, Image.Resampling.LANCZOS)


def build_one(spec: ZoomMedia) -> dict[str, object]:
    if not spec.source.exists():
        raise FileNotFoundError(spec.source)

    source = Image.open(spec.source).convert("RGB")
    source = fit_cover_crop(source)
    frames: list[Image.Image] = []

    for index in range(FRAMES):
        raw_t = index / (FRAMES - 1)
        # Hold briefly on the readable final crop.
        motion_t = min(1.0, raw_t / 0.78)
        z = lerp(spec.zoom_start, spec.zoom_end, ease(motion_t))
        frame = crop_zoom(source, z, spec.focus)
        if spec.sharpen:
            frame = frame.filter(ImageFilter.UnsharpMask(radius=1.1, percent=90, threshold=3))
        frames.append(frame)

    target = MEDIA_DIR / spec.output
    target.parent.mkdir(parents=True, exist_ok=True)
    frames[0].save(
        target,
        save_all=True,
        append_images=frames[1:],
        duration=[FRAME_DURATION_MS] * len(frames),
        loop=0,
        format="WEBP",
        quality=78,
        method=6,
    )

    return {
        "output": spec.output,
        "source": str(spec.source.relative_to(ROOT) if spec.source.is_relative_to(ROOT) else spec.source),
        "size": f"{OUTPUT_SIZE[0]}x{OUTPUT_SIZE[1]}",
        "frames": FRAMES,
        "duration_ms": FRAMES * FRAME_DURATION_MS,
        "focus": spec.focus,
        "zoom_start": spec.zoom_start,
        "zoom_end": spec.zoom_end,
        "bytes": target.stat().st_size,
    }


def update_manifest(results: list[dict[str, object]]) -> None:
    manifest_path = MEDIA_DIR / "manifest.json"
    if not manifest_path.exists():
        return
    manifest = json.loads(manifest_path.read_text())
    generated_at = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    by_output = {str(item["output"]): item for item in results}

    manifest["generatedAt"] = generated_at
    manifest["platformZoomMedia"] = {
        "generatedAt": generated_at,
        "method": "real app screenshots rendered as animated WebP pan/zoom; no mock UI drawn into frames",
        "items": results,
        "notes": [
            "The Cron source screenshot is currently empty in the app; platform-automation-cron.webp uses a real workflow map screenshot as the closest operational automation surface.",
            "Capture a real Cron job list later and rerun this script to replace that one asset without changing CMS URLs.",
        ],
    }

    for item in manifest.get("items", []):
        processed = item.get("processed")
        if processed in by_output:
            result = by_output[processed]
            item["processed_size"] = result["size"]
            item["processed_bytes"] = result["bytes"]
            item["animation"] = {
                "kind": "animated-webp",
                "frames": result["frames"],
                "duration_ms": result["duration_ms"],
                "source": result["source"],
                "zoom_start": result["zoom_start"],
                "zoom_end": result["zoom_end"],
            }

    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")


def main() -> None:
    results = [build_one(spec) for spec in MEDIA]
    update_manifest(results)
    for result in results:
        print(f"{result['output']}: {result['bytes']} bytes from {result['source']}")


if __name__ == "__main__":
    main()
