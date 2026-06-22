#!/usr/bin/env python3
"""Build a focused landing hero video loop: result, workflow, connectors.

The loop intentionally avoids broad feature-tour clutter and old internal notes.
It uses real AigenLabs screenshots for Workflow and Connectors, then a clean
result card based on the current demo output so visitors can understand the
business outcome quickly.
"""

from __future__ import annotations

import math
import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Literal

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
MEDIA_DIR = ROOT / "public" / "uploads" / "landing-media" / "current"
WORK_DIR = Path("/tmp/aigenlabs-landing-hero-focused-loop")
FRAMES_DIR = WORK_DIR / "frames"
FPS = 24
SIZE = (1920, 1080)
ACCENT = (198, 31, 38)
ORANGE = (229, 106, 74)
INK = (17, 24, 39)
MUTED = (86, 96, 112)
PAPER = (248, 246, 243)

SceneKind = Literal["image", "result"]


@dataclass(frozen=True)
class Scene:
    kind: SceneKind
    seconds: float
    title: str
    subtitle: str
    badge: str
    image: str | None = None
    focus: tuple[float, float] = (0.5, 0.5)
    zoom_start: float = 1.0
    zoom_end: float = 1.0
    cursor_start: tuple[float, float] = (0.5, 0.5)
    cursor_end: tuple[float, float] = (0.5, 0.5)


SCENES = [
    Scene(
        kind="result",
        seconds=2.8,
        title="Kết quả nhìn thấy ngay",
        subtitle="Bảng đầu ra có kênh, nội dung, người phụ trách và trạng thái.",
        badge="Kết quả",
        cursor_start=(0.76, 0.64),
        cursor_end=(0.81, 0.50),
    ),
    Scene(
        kind="image",
        image="usecase-precision-workflow-map.webp",
        seconds=3.0,
        title="Workflow rõ từng bước",
        subtitle="Từ brief đến kết quả, mỗi bước có người phụ trách và đầu ra.",
        badge="Workflow Map",
        focus=(0.56, 0.30),
        zoom_start=1.18,
        zoom_end=1.34,
        cursor_start=(0.32, 0.28),
        cursor_end=(0.78, 0.42),
    ),
    Scene(
        kind="image",
        image="platform-connectors-google-workspace.webp",
        seconds=2.8,
        title="Connector theo phạm vi",
        subtitle="Google Workspace được gắn vào đúng workflow và đúng quyền cần dùng.",
        badge="Connectors",
        focus=(0.34, 0.20),
        zoom_start=1.65,
        zoom_end=1.95,
        cursor_start=(0.72, 0.50),
        cursor_end=(0.58, 0.44),
    ),
    Scene(
        kind="result",
        seconds=2.6,
        title="Kết quả sẵn sàng review",
        subtitle="Founder thấy output nào đã sẵn sàng và bước nào cần kiểm tra.",
        badge="Kết quả sẵn sàng",
        cursor_start=(0.34, 0.42),
        cursor_end=(0.78, 0.70),
    ),
]


def font(size: int, bold: bool = False) -> Any:
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
    ]
    for candidate in candidates:
        path = Path(candidate)
        if path.exists():
            return ImageFont.truetype(str(path), size=size)
    return ImageFont.load_default()


FONT_HERO = font(54, True)
FONT_TITLE = font(42, True)
FONT_BODY = font(26)
FONT_SMALL = font(21, True)
FONT_TABLE_HEAD = font(26, True)
FONT_TABLE = font(25)
FONT_CHIP = font(19, True)


def ease(t: float) -> float:
    return 1 - pow(1 - t, 3)


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def rounded(draw: ImageDraw.ImageDraw, xy: tuple[int, int, int, int], radius: int, fill, outline=None, width=1):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def crop_zoom(img: Image.Image, zoom: float, focus: tuple[float, float]) -> Image.Image:
    width, height = img.size
    crop_w = int(width / zoom)
    crop_h = int(height / zoom)
    cx = int(width * focus[0])
    cy = int(height * focus[1])
    left = max(0, min(width - crop_w, cx - crop_w // 2))
    top = max(0, min(height - crop_h, cy - crop_h // 2))
    return img.crop((left, top, left + crop_w, top + crop_h)).resize(SIZE, Image.Resampling.LANCZOS)


def background() -> Image.Image:
    base = Image.new("RGB", SIZE, PAPER)
    glow = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    d = ImageDraw.Draw(glow)
    d.ellipse((-280, -250, 760, 620), fill=(229, 106, 74, 38))
    d.ellipse((1220, 80, 2200, 1040), fill=(198, 31, 38, 30))
    d.ellipse((460, 760, 1420, 1340), fill=(15, 23, 42, 18))
    glow = glow.filter(ImageFilter.GaussianBlur(54))
    return Image.alpha_composite(base.convert("RGBA"), glow)


def add_vignette(frame: Image.Image) -> Image.Image:
    overlay = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    mask = Image.new("L", SIZE, 0)
    d = ImageDraw.Draw(mask)
    d.ellipse((-280, -240, SIZE[0] + 280, SIZE[1] + 260), fill=255)
    mask = Image.eval(mask.filter(ImageFilter.GaussianBlur(72)), lambda p: 255 - min(255, p))
    dark = Image.new("RGBA", SIZE, (12, 18, 28, 62))
    overlay.paste(dark, (0, 0), mask)
    return Image.alpha_composite(frame.convert("RGBA"), overlay)


def wrapped(draw: ImageDraw.ImageDraw, text: str, font_obj: Any, max_width: int) -> list[str]:
    lines: list[str] = []
    current = ""
    for word in text.split():
        candidate = f"{current} {word}".strip()
        if not current or draw.textlength(candidate, font=font_obj) <= max_width:
            current = candidate
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_result_card(progress: float) -> Image.Image:
    frame = background()
    d = ImageDraw.Draw(frame)

    # Top value sentence, short and customer-facing.
    d.text((128, 92), "Từ workflow đến kết quả", font=FONT_HERO, fill=INK)
    d.text((130, 165), "Founder nhìn được đầu ra, người phụ trách và trạng thái trong cùng một màn hình.", font=FONT_BODY, fill=MUTED)

    card = Image.new("RGBA", (1510, 640), (255, 255, 255, 0))
    cd = ImageDraw.Draw(card)
    rounded(cd, (0, 0, 1510, 640), 34, (255, 255, 255, 246), (17, 24, 39, 26), 2)
    cd.rectangle((0, 0, 1510, 86), fill=(255, 255, 255, 255))
    cd.rounded_rectangle((0, 0, 1510, 640), radius=34, outline=(17, 24, 39, 22), width=2)
    cd.text((42, 27), "Kết quả mẫu tạo ra", font=FONT_TITLE, fill=INK)
    rounded(cd, (1136, 22, 1452, 60), 18, (255, 239, 231, 255), None)
    cd.text((1160, 30), "Sẵn sàng kiểm tra", font=FONT_CHIP, fill=(146, 55, 36))

    cols = [42, 225, 585, 1054, 1286]
    widths = [150, 300, 410, 190, 180]
    headers = ["Ngày", "Kênh", "Đầu ra", "Phụ trách", "Trạng thái"]
    rows = [
        ["Ngày 1", "Facebook", "Bài pain-point founder", "Content AI", "Nháp xong"],
        ["Ngày 2", "TikTok", "Kịch bản demo workflow", "Content AI", "Nháp xong"],
        ["Ngày 3", "Website", "Trang Business OS", "Marketing AI", "Đã review"],
        ["Ngày 4", "Email", "Follow-up danh sách chờ", "Sales AI", "Nháp xong"],
    ]
    y0 = 124
    cd.line((42, y0 - 22, 1468, y0 - 22), fill=(17, 24, 39, 35), width=2)
    for i, header in enumerate(headers):
        cd.text((cols[i], y0), header, font=FONT_TABLE_HEAD, fill=(55, 65, 81))
    y = y0 + 58
    for r, row in enumerate(rows):
        fill = (249, 250, 252, 255) if r % 2 == 0 else (255, 255, 255, 255)
        rounded(cd, (28, y - 12, 1482, y + 50), 16, fill, None)
        for i, value in enumerate(row):
            color = INK if i in (0, 2) else (75, 85, 99)
            cd.text((cols[i], y), value, font=FONT_TABLE, fill=color)
        y += 78

    # Three concise output chips.
    chip_y = 530
    chips = ["4 đầu ra", "3 AI Agent", "1 nơi kiểm tra"]
    x = 42
    for chip in chips:
        w = int(cd.textlength(chip, font=FONT_CHIP)) + 40
        rounded(cd, (x, chip_y, x + w, chip_y + 44), 22, (244, 246, 248, 255), None)
        cd.text((x + 20, chip_y + 12), chip, font=FONT_CHIP, fill=(55, 65, 81))
        x += w + 16

    frame.alpha_composite(card, (205, 315))
    return add_vignette(frame)


def draw_screenshot_scene(source: Image.Image, scene: Scene, progress: float) -> Image.Image:
    zoom = lerp(scene.zoom_start, scene.zoom_end, ease(progress))
    frame = crop_zoom(source, zoom, scene.focus).convert("RGBA")

    # White product browser shell with subtle depth.
    shell = background()
    d = ImageDraw.Draw(shell)
    rounded(d, (88, 92, 1832, 988), 36, (255, 255, 255, 255), (17, 24, 39, 28), 2)
    d.rectangle((88, 92, 1832, 146), fill=(250, 251, 252, 255))
    for i, c in enumerate([(255, 95, 109), (246, 178, 59), (23, 183, 170)]):
        d.ellipse((124 + i * 32, 113, 142 + i * 32, 131), fill=c)
    inner = frame.resize((1744, 842), Image.Resampling.LANCZOS)
    shell.alpha_composite(inner, (88, 146))
    return add_vignette(shell)


def add_caption(frame: Image.Image, scene: Scene, progress: float):
    alpha = int(lerp(0, 238, min(1, progress * 4)))
    card = Image.new("RGBA", (760, 154), (255, 255, 255, 0))
    d = ImageDraw.Draw(card)
    rounded(d, (0, 0, 760, 154), 26, (17, 24, 39, alpha), (255, 255, 255, 35), 1)
    d.rectangle((0, 0, 7, 154), fill=(198, 31, 38, alpha))
    d.text((34, 28), scene.title, font=FONT_TITLE, fill=(255, 255, 255, alpha))
    y = 88
    for line in wrapped(d, scene.subtitle, FONT_BODY, 680)[:2]:
        d.text((34, y), line, font=FONT_BODY, fill=(225, 232, 240, alpha))
        y += 34
    frame.alpha_composite(card, (96, 822))


def add_step_pills(frame: Image.Image, active_index: int):
    d = ImageDraw.Draw(frame)
    labels = ["Kết quả", "Workflow", "Connectors"]
    x = 1168
    y = 74
    for i, label in enumerate(labels):
        active = (active_index in (0, 3) and i == 0) or (active_index == 1 and i == 1) or (active_index == 2 and i == 2)
        w = int(d.textlength(label, font=FONT_CHIP)) + 46
        fill = (17, 24, 39, 228) if active else (255, 255, 255, 222)
        text = (255, 255, 255) if active else (73, 83, 99)
        outline = (255, 255, 255, 40) if active else (17, 24, 39, 24)
        rounded(d, (x, y, x + w, y + 44), 22, fill, outline)
        d.text((x + 23, y + 12), label, font=FONT_CHIP, fill=text)
        x += w + 12


def add_cursor(frame: Image.Image, scene: Scene, progress: float):
    t = ease(progress)
    x = int(SIZE[0] * lerp(scene.cursor_start[0], scene.cursor_end[0], t))
    y = int(SIZE[1] * lerp(scene.cursor_start[1], scene.cursor_end[1], t))
    d = ImageDraw.Draw(frame)
    if 0.46 < progress < 0.62 or math.sin(progress * math.pi * 4) > 0.86:
        radius = int(20 + 28 * abs(math.sin(progress * math.pi * 6)))
        d.ellipse((x - radius, y - radius, x + radius, y + radius), outline=(198, 31, 38, 150), width=4)
    shadow = [(x + 4, y + 4), (x + 4, y + 52), (x + 18, y + 39), (x + 31, y + 67), (x + 45, y + 61), (x + 30, y + 35), (x + 52, y + 35)]
    pointer = [(x, y), (x, y + 48), (x + 14, y + 35), (x + 27, y + 63), (x + 41, y + 57), (x + 26, y + 31), (x + 48, y + 31)]
    d.polygon(shadow, fill=(0, 0, 0, 92))
    d.polygon(pointer, fill=(255, 255, 255, 255), outline=(15, 23, 42, 230))


def render_frames() -> int:
    if FRAMES_DIR.exists():
        shutil.rmtree(FRAMES_DIR)
    FRAMES_DIR.mkdir(parents=True, exist_ok=True)

    images = {
        scene.image: Image.open(MEDIA_DIR / scene.image).convert("RGB").resize(SIZE, Image.Resampling.LANCZOS)
        for scene in SCENES
        if scene.image
    }
    frame_index = 0
    for scene_index, scene in enumerate(SCENES):
        count = int(scene.seconds * FPS)
        for local_index in range(count):
            progress = local_index / max(1, count - 1)
            if scene.kind == "result":
                frame = draw_result_card(progress)
            else:
                assert scene.image is not None
                frame = draw_screenshot_scene(images[scene.image], scene, progress)
            add_step_pills(frame, scene_index)
            add_caption(frame, scene, progress)
            add_cursor(frame, scene, progress)
            frame.convert("RGB").save(FRAMES_DIR / f"frame_{frame_index:05d}.jpg", quality=91, optimize=True)
            frame_index += 1
    return frame_index


def run_ffmpeg(frame_count: int):
    mp4 = MEDIA_DIR / "hero-business-os-workflow-connectors-results-loop.mp4"
    webm = MEDIA_DIR / "hero-business-os-workflow-connectors-results-loop.webm"
    poster = MEDIA_DIR / "hero-business-os-workflow-connectors-results-loop-poster.webp"

    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-r",
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
            "25",
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
            "-r",
            str(FPS),
            "-i",
            str(FRAMES_DIR / "frame_%05d.jpg"),
            "-c:v",
            "libvpx-vp9",
            "-b:v",
            "0",
            "-crf",
            "34",
            str(webm),
        ],
        check=True,
    )
    Image.open(FRAMES_DIR / "frame_00000.jpg").save(poster, quality=88, method=6)
    print(f"frames={frame_count}")
    print(f"mp4={mp4} size={mp4.stat().st_size}")
    print(f"webm={webm} size={webm.stat().st_size}")
    print(f"poster={poster} size={poster.stat().st_size}")


def main():
    frame_count = render_frames()
    run_ffmpeg(frame_count)


if __name__ == "__main__":
    main()
