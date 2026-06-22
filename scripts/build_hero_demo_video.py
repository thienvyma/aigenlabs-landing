#!/usr/bin/env python3
"""Build the landing hero workflow demo video from real Desktop screenshots."""

from __future__ import annotations

import math
import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
MEDIA_DIR = ROOT / "public" / "uploads" / "landing-media" / "current"
WORK_DIR = Path("/tmp/aigenlabs-landing-hero-demo")
FRAMES_DIR = WORK_DIR / "frames"
FPS = 24
SIZE = (1920, 1080)


@dataclass(frozen=True)
class Scene:
    image: str
    seconds: float
    title: str
    subtitle: str
    focus: tuple[float, float]
    zoom_start: float
    zoom_end: float
    cursor_start: tuple[float, float]
    cursor_end: tuple[float, float]
    prompt: str | None = None
    badge: str | None = None


SCENES = [
    Scene(
        image="hero-business-os-command-center.webp",
        seconds=5.2,
        title="Founder giao việc cho COO",
        subtitle="Nhập mục tiêu kinh doanh, không cần mở từng công cụ riêng lẻ.",
        focus=(0.52, 0.50),
        zoom_start=1.0,
        zoom_end=1.08,
        cursor_start=(0.72, 0.88),
        cursor_end=(0.52, 0.78),
        prompt="Tạo workflow content marketing từ brief đến report tuần này",
        badge="Business OS workspace",
    ),
    Scene(
        image="platform-agent-hub-ai-agent.webp",
        seconds=4.8,
        title="COO chọn đúng AI Agent",
        subtitle="Marketing, Reviewer và Operator được gắn vào đúng vai trò.",
        focus=(0.50, 0.54),
        zoom_start=1.04,
        zoom_end=1.12,
        cursor_start=(0.22, 0.34),
        cursor_end=(0.77, 0.61),
        badge="Role mapped team",
    ),
    Scene(
        image="usecase-precision-workflow-map.webp",
        seconds=6.2,
        title="Workflow Map được tạo",
        subtitle="Brief -> Draft -> Review -> Approval -> Publish -> Report.",
        focus=(0.55, 0.47),
        zoom_start=1.02,
        zoom_end=1.16,
        cursor_start=(0.30, 0.26),
        cursor_end=(0.80, 0.69),
        badge="Content publishing workflow",
    ),
    Scene(
        image="usecase-velocity-execution-board.webp",
        seconds=5.8,
        title="Workflow bắt đầu chạy",
        subtitle="Mỗi card là một công việc có owner, trạng thái và output rõ ràng.",
        focus=(0.51, 0.50),
        zoom_start=1.03,
        zoom_end=1.12,
        cursor_start=(0.18, 0.30),
        cursor_end=(0.68, 0.48),
        badge="5 tasks in motion",
    ),
    Scene(
        image="usecase-trust-safety-controls.webp",
        seconds=5.0,
        title="Kết quả cần duyệt được giữ lại",
        subtitle="Agent tạo report/handoff, founder duyệt trước khi publish.",
        focus=(0.56, 0.50),
        zoom_start=1.04,
        zoom_end=1.13,
        cursor_start=(0.72, 0.64),
        cursor_end=(0.50, 0.44),
        badge="Approval required",
    ),
    Scene(
        image="hero-business-os-command-center.webp",
        seconds=4.4,
        title="Công ty có một vòng lặp vận hành",
        subtitle="COO nhìn được việc đã làm, việc đang block và hành động tiếp theo.",
        focus=(0.50, 0.50),
        zoom_start=1.06,
        zoom_end=1.02,
        cursor_start=(0.56, 0.78),
        cursor_end=(0.79, 0.22),
        badge="Report ready",
    ),
]


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
    ]
    for candidate in candidates:
        path = Path(candidate)
        if path.exists():
            return ImageFont.truetype(str(path), size=size)
    return ImageFont.load_default()


FONT_TITLE = font(40, True)
FONT_BODY = font(25)
FONT_SMALL = font(20, True)
FONT_PROMPT = font(24)


def ease(t: float) -> float:
    return 1 - pow(1 - t, 3)


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def rounded_rect(draw: ImageDraw.ImageDraw, xy: tuple[int, int, int, int], radius: int, fill, outline=None, width=1):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def wrapped_lines(draw: ImageDraw.ImageDraw, text: str, font_obj: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if not current or draw.textlength(candidate, font=font_obj) <= max_width:
            current = candidate
            continue
        lines.append(current)
        current = word
    if current:
        lines.append(current)
    return lines


def crop_zoom(img: Image.Image, zoom: float, focus: tuple[float, float]) -> Image.Image:
    width, height = img.size
    crop_w = int(width / zoom)
    crop_h = int(height / zoom)
    cx = int(width * focus[0])
    cy = int(height * focus[1])
    left = max(0, min(width - crop_w, cx - crop_w // 2))
    top = max(0, min(height - crop_h, cy - crop_h // 2))
    return img.crop((left, top, left + crop_w, top + crop_h)).resize(SIZE, Image.Resampling.LANCZOS)


def add_vignette(frame: Image.Image) -> Image.Image:
    overlay = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    mask = Image.new("L", SIZE, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((-360, -260, SIZE[0] + 360, SIZE[1] + 320), fill=255)
    mask = Image.eval(mask.filter(ImageFilter.GaussianBlur(80)), lambda p: 255 - min(255, p))
    dark = Image.new("RGBA", SIZE, (8, 10, 16, 90))
    overlay.paste(dark, (0, 0), mask)
    return Image.alpha_composite(frame.convert("RGBA"), overlay)


def add_caption(frame: Image.Image, scene: Scene, progress: float):
    alpha = int(lerp(0, 235, min(1, progress * 5)))
    x, y = 86, 770
    card = Image.new("RGBA", (820, 214), (255, 255, 255, 0))
    card_draw = ImageDraw.Draw(card)
    rounded_rect(card_draw, (0, 0, 820, 214), 24, (17, 24, 39, alpha), (255, 255, 255, 38), 1)
    card_draw.rectangle((0, 0, 7, 214), fill=(198, 31, 38, alpha))
    card_draw.text((34, 30), scene.title, font=FONT_TITLE, fill=(255, 255, 255, alpha))
    subtitle_y = 92
    for line in wrapped_lines(card_draw, scene.subtitle, FONT_BODY, 730)[:2]:
        card_draw.text((34, subtitle_y), line, font=FONT_BODY, fill=(218, 226, 237, alpha))
        subtitle_y += 33
    if scene.badge:
        badge_w = int(card_draw.textlength(scene.badge, font=FONT_SMALL)) + 38
        rounded_rect(card_draw, (34, 155, 34 + badge_w, 192), 18, (246, 234, 212, alpha), None)
        card_draw.text((53, 162), scene.badge, font=FONT_SMALL, fill=(126, 64, 12, alpha))
    frame.alpha_composite(card, (x, y))


def add_prompt(frame: Image.Image, scene: Scene, progress: float):
    if not scene.prompt:
        return
    draw = ImageDraw.Draw(frame)
    width, height = 910, 74
    x, y = 505, 68
    alpha = int(lerp(0, 244, min(1, progress * 4)))
    rounded_rect(draw, (x, y, x + width, y + height), 16, (255, 255, 255, alpha), (15, 23, 42, 90), 2)
    draw.text((x + 28, y + 23), scene.prompt, font=FONT_PROMPT, fill=(25, 34, 50, alpha))
    send_x = x + width - 62
    send_y = y + height // 2
    draw.ellipse((send_x - 19, send_y - 19, send_x + 19, send_y + 19), fill=(198, 31, 38, alpha))
    draw.line((send_x - 8, send_y, send_x + 7, send_y, send_x + 1, send_y - 7), fill=(255, 255, 255, alpha), width=3)


def add_cursor(frame: Image.Image, scene: Scene, progress: float):
    t = ease(progress)
    x = int(SIZE[0] * lerp(scene.cursor_start[0], scene.cursor_end[0], t))
    y = int(SIZE[1] * lerp(scene.cursor_start[1], scene.cursor_end[1], t))
    draw = ImageDraw.Draw(frame)
    click_phase = math.sin(progress * math.pi * 5)
    if click_phase > 0.82 or 0.48 < progress < 0.55:
        radius = int(18 + 26 * abs(math.sin(progress * math.pi * 7)))
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), outline=(198, 31, 38, 130), width=4)
    shadow = [(x + 4, y + 4), (x + 4, y + 53), (x + 19, y + 39), (x + 32, y + 68), (x + 45, y + 62), (x + 31, y + 35), (x + 53, y + 35)]
    pointer = [(x, y), (x, y + 49), (x + 15, y + 35), (x + 28, y + 64), (x + 41, y + 58), (x + 27, y + 31), (x + 49, y + 31)]
    draw.polygon(shadow, fill=(0, 0, 0, 90))
    draw.polygon(pointer, fill=(255, 255, 255, 255), outline=(15, 23, 42, 230))


def add_top_progress(frame: Image.Image, scene_index: int, scene_count: int):
    draw = ImageDraw.Draw(frame)
    x, y = 86, 52
    rounded_rect(draw, (x, y, x + 250, y + 42), 21, (17, 24, 39, 204), (255, 255, 255, 35), 1)
    draw.ellipse((x + 18, y + 15, x + 30, y + 27), fill=(40, 190, 128, 255))
    draw.text((x + 44, y + 10), f"Workflow demo {scene_index + 1}/{scene_count}", font=FONT_SMALL, fill=(255, 255, 255, 238))


def render_frames():
    if FRAMES_DIR.exists():
        shutil.rmtree(FRAMES_DIR)
    FRAMES_DIR.mkdir(parents=True, exist_ok=True)

    images = {scene.image: Image.open(MEDIA_DIR / scene.image).convert("RGB").resize(SIZE, Image.Resampling.LANCZOS) for scene in SCENES}
    frame_index = 0
    for scene_index, scene in enumerate(SCENES):
        count = int(scene.seconds * FPS)
        source = images[scene.image]
        for local_index in range(count):
            progress = local_index / max(1, count - 1)
            zoom = lerp(scene.zoom_start, scene.zoom_end, ease(progress))
            frame = crop_zoom(source, zoom, scene.focus).convert("RGBA")
            frame = add_vignette(frame)
            add_top_progress(frame, scene_index, len(SCENES))
            add_prompt(frame, scene, progress)
            add_caption(frame, scene, progress)
            add_cursor(frame, scene, progress)
            frame.convert("RGB").save(FRAMES_DIR / f"frame_{frame_index:05d}.jpg", quality=92, optimize=True)
            frame_index += 1
    return frame_index


def run_ffmpeg(frame_count: int):
    mp4 = MEDIA_DIR / "hero-business-os-workflow-demo.mp4"
    webm = MEDIA_DIR / "hero-business-os-workflow-demo.webm"
    poster = MEDIA_DIR / "hero-business-os-workflow-demo-poster.webp"

    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-framerate",
            str(FPS),
            "-i",
            str(FRAMES_DIR / "frame_%05d.jpg"),
            "-vf",
            "format=yuv420p",
            "-c:v",
            "libx264",
            "-preset",
            "slow",
            "-crf",
            "24",
            "-movflags",
            "+faststart",
            str(mp4),
        ],
        check=True,
    )
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(mp4),
            "-c:v",
            "libvpx-vp9",
            "-b:v",
            "0",
            "-crf",
            "34",
            "-row-mt",
            "1",
            str(webm),
        ],
        check=True,
    )
    poster_frame = FRAMES_DIR / f"frame_{min(frame_count - 1, FPS * 2):05d}.jpg"
    Image.open(poster_frame).save(poster, quality=86, method=6)
    return mp4, webm, poster


def main():
    frame_count = render_frames()
    mp4, webm, poster = run_ffmpeg(frame_count)
    print(f"frames={frame_count}")
    print(f"mp4={mp4}")
    print(f"webm={webm}")
    print(f"poster={poster}")


if __name__ == "__main__":
    main()
