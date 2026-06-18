# Landing media map — AigenLabs homepage

Generated for local review on `localhost:3001`.

## Scope

- No new screenshots were captured for this pass.
- Existing screenshots from the company workspace were copied into this project.
- A processed landing-ready set was generated from those existing screenshots only.
- Current local `data/cms.json` has been pointed to the processed files so the page can be reviewed immediately.
- Public publishing/deploy still requires founder/reviewer approval.

## Project asset locations

Raw screenshots copied into the project:

```text
public/uploads/landing-media/raw/2026-06-18/
```

Processed images to use in the landing CMS:

```text
public/uploads/landing-media/current/
```

Processing applied to each image:

```text
crop to exact 16:9 -> resize to 1920x1080 -> gentle sharpening -> WebP quality 88
```

Machine-readable manifest:

```text
public/uploads/landing-media/current/manifest.json
```

## How Codex should apply these images

The homepage media is configured in:

```text
data/cms.json
```

For each row below, set the relevant `url` field to the `Processed public URL` value.

If you want a placeholder workflow first, use the `Placeholder token` column in code/CMS, then replace each token with the matching processed public URL.

## Mapping table

| # | Landing position | CMS path | Placeholder token | Raw source file | Processed file | Processed public URL | Notes |
|---:|---|---|---|---|---|---|---|
| 1 | Hero — Bảng điều phối AI đáng tin | `pages[home].sections[hero].content.preview.url` | `__LANDING_MEDIA_HERO_COMMAND_CENTER__` | `public/uploads/landing-media/raw/2026-06-18/01-hero-business-os-command-center.png` | `public/uploads/landing-media/current/hero-business-os-command-center.webp` | `/uploads/landing-media/current/hero-business-os-command-center.webp` | Temporary hero image; stronger hero video can replace later. |
| 2 | Use-case tabs — Precision / Workflow rõ ràng | `pages[home].sections[capabilities].content.tabs[0].media.url` | `__LANDING_MEDIA_USECASE_PRECISION__` | `public/uploads/landing-media/raw/2026-06-18/02-usecase-precision-workflow-map.png` | `public/uploads/landing-media/current/usecase-precision-workflow-map.webp` | `/uploads/landing-media/current/usecase-precision-workflow-map.webp` | Shows workflow map concept. |
| 3 | Use-case tabs — Velocity / Vòng lặp triển khai | `pages[home].sections[capabilities].content.tabs[1].media.url` | `__LANDING_MEDIA_USECASE_VELOCITY__` | `public/uploads/landing-media/raw/2026-06-18/03-usecase-velocity-execution-board.png` | `public/uploads/landing-media/current/usecase-velocity-execution-board.webp` | `/uploads/landing-media/current/usecase-velocity-execution-board.webp` | Shows execution board / faster operating loop. |
| 4 | Use-case tabs — Trust / Lớp kiểm soát | `pages[home].sections[capabilities].content.tabs[2].media.url` | `__LANDING_MEDIA_USECASE_TRUST__` | `public/uploads/landing-media/raw/2026-06-18/04-usecase-trust-safety-controls.png` | `public/uploads/landing-media/current/usecase-trust-safety-controls.webp` | `/uploads/landing-media/current/usecase-trust-safety-controls.webp` | Shows controls / approval / safety framing. |
| 5 | Use-case tabs — Product ops / Product operations | `pages[home].sections[capabilities].content.tabs[3].media.url` | `__LANDING_MEDIA_USECASE_PRODUCT_OPS__` | `public/uploads/landing-media/raw/2026-06-18/05-usecase-product-ops-business-os.png` | `public/uploads/landing-media/current/usecase-product-ops-business-os.webp` | `/uploads/landing-media/current/usecase-product-ops-business-os.webp` | Shows Business OS / product-ops context. |
| 6 | Use-case tabs — Custom tools / Trình dựng workflow | `pages[home].sections[capabilities].content.tabs[4].media.url` | `__LANDING_MEDIA_USECASE_CUSTOM_TOOLS__` | `public/uploads/landing-media/raw/2026-06-18/06-usecase-custom-tools-workflow-builder.png` | `public/uploads/landing-media/current/usecase-custom-tools-workflow-builder.webp` | `/uploads/landing-media/current/usecase-custom-tools-workflow-builder.webp` | Shows workflow builder / custom setup. |
| 7 | Use-case tabs — Knowledge / Ngữ cảnh tri thức | `pages[home].sections[capabilities].content.tabs[5].media.url` | `__LANDING_MEDIA_USECASE_KNOWLEDGE__` | `public/uploads/landing-media/raw/2026-06-18/07-usecase-knowledge-skills-library.png` | `public/uploads/landing-media/current/usecase-knowledge-skills-library.webp` | `/uploads/landing-media/current/usecase-knowledge-skills-library.webp` | Shows skill/knowledge library. |
| 8 | Use-case tabs — Insight / Dashboard insight | `pages[home].sections[capabilities].content.tabs[6].media.url` | `__LANDING_MEDIA_USECASE_INSIGHT__` | `public/uploads/landing-media/raw/2026-06-18/08-usecase-insight-business-readiness.png` | `public/uploads/landing-media/current/usecase-insight-business-readiness.webp` | `/uploads/landing-media/current/usecase-insight-business-readiness.webp` | Shows readiness / operating insight. |
| 9 | Platform features — Agent Hub | `pages[home].sections[platform].content.features[0].media.url` | `__LANDING_MEDIA_PLATFORM_AGENT_HUB__` | `public/uploads/landing-media/raw/2026-06-18/09-platform-agent-hub-ai-staff.png` | `public/uploads/landing-media/current/platform-agent-hub-ai-staff.webp` | `/uploads/landing-media/current/platform-agent-hub-ai-staff.webp` | Feature slot for AI staff / agent profiles. |
| 10 | Platform features — Tự động hóa | `pages[home].sections[platform].content.features[1].media.url` | `__LANDING_MEDIA_PLATFORM_AUTOMATION__` | `public/uploads/landing-media/raw/2026-06-18/10-platform-automation-cron.png` | `public/uploads/landing-media/current/platform-automation-cron.webp` | `/uploads/landing-media/current/platform-automation-cron.webp` | Feature slot for scheduled jobs / automation. |
| 11 | Platform features — Trình duyệt | `pages[home].sections[platform].content.features[2].media.url` | `__LANDING_MEDIA_PLATFORM_BROWSER__` | `public/uploads/landing-media/raw/2026-06-18/11-platform-browser-tool-config.png` | `public/uploads/landing-media/current/platform-browser-tool-config.webp` | `/uploads/landing-media/current/platform-browser-tool-config.webp` | Feature slot for browser/tool configuration. |
| 12 | Platform features — Connector | `pages[home].sections[platform].content.features[3].media.url` | `__LANDING_MEDIA_PLATFORM_CONNECTOR__` | `public/uploads/landing-media/raw/2026-06-18/12-platform-connectors-google-workspace.png` | `public/uploads/landing-media/current/platform-connectors-google-workspace.webp` | `/uploads/landing-media/current/platform-connectors-google-workspace.webp` | Feature slot for Google Workspace / connectors. |
| 13 | Platform features — Skill | `pages[home].sections[platform].content.features[4].media.url` | `__LANDING_MEDIA_PLATFORM_SKILL__` | `public/uploads/landing-media/raw/2026-06-18/13-platform-skills-library.png` | `public/uploads/landing-media/current/platform-skills-library.webp` | `/uploads/landing-media/current/platform-skills-library.webp` | Feature slot for skill library. |
| 14 | Platform features — Kênh làm việc | `pages[home].sections[platform].content.features[5].media.url` | `__LANDING_MEDIA_PLATFORM_WORK_CHANNELS__` | `public/uploads/landing-media/raw/2026-06-18/14-platform-work-channels-messaging.png` | `public/uploads/landing-media/current/platform-work-channels-messaging.webp` | `/uploads/landing-media/current/platform-work-channels-messaging.webp` | Feature slot for work channels / messaging. |
| 15 | Platform features — Ghép phiên | `pages[home].sections[platform].content.features[6].media.url` | `__LANDING_MEDIA_PLATFORM_SESSION_PAIRING__` | `public/uploads/landing-media/raw/2026-06-18/15-platform-session-pairing-gateway.png` | `public/uploads/landing-media/current/platform-session-pairing-gateway.webp` | `/uploads/landing-media/current/platform-session-pairing-gateway.webp` | Feature slot for session pairing / gateway. |
| 16 | Platform features — Đội ngũ | `pages[home].sections[platform].content.features[7].media.url` | `__LANDING_MEDIA_PLATFORM_TEAM__` | `public/uploads/landing-media/raw/2026-06-18/16-platform-team-ai-staff.png` | `public/uploads/landing-media/current/platform-team-ai-staff.webp` | `/uploads/landing-media/current/platform-team-ai-staff.webp` | Feature slot for teams / AI staff. |

## Suggested Codex instruction

```text
Use docs/landing-media-map.md. Update data/cms.json media.url fields according to the mapping table. Use the Processed public URL values, not the raw PNG files. Keep media.kind as "image" and keep poster empty unless the media is changed to video later. Do not create new screenshots or publish/deploy.
```

## Later replacement rule

When a better screenshot or video is ready later, prefer one of these two safe options:

1. Keep the same processed public URL filename and replace only the file contents.
2. Add a new file under `public/uploads/landing-media/current/`, then update the exact `cms.json` path from the table.

For the future hero video, change only the hero media object when ready:

```json
{
  "kind": "video",
  "url": "/uploads/landing-media/current/hero-demo-video.mp4",
  "poster": "/uploads/landing-media/current/hero-video-poster.webp"
}
```

Do not publish/deploy this change without explicit founder approval.

## Hero demo video — 2026-06-18

Generated landing-ready hero video files:

```text
public/uploads/landing-media/current/hero-business-os-workflow-demo.mp4
public/uploads/landing-media/current/hero-business-os-workflow-demo.webm
public/uploads/landing-media/current/hero-business-os-workflow-demo-poster.webp
```

Preview-only CMS value when founder approves replacing the current hero image:

```json
{
  "kind": "video",
  "url": "/uploads/landing-media/current/hero-business-os-workflow-demo.mp4",
  "poster": "/uploads/landing-media/current/hero-business-os-workflow-demo-poster.webp"
}
```

Video concept:

```text
Founder asks COO -> COO maps AI staff -> Workflow Map is created -> Execution Board runs -> Approval/report is held -> company loop is visible.
```

Build script:

```text
scripts/build_hero_demo_video.py
```

Notes:

- Source visuals are real AigenLabs Desktop screenshots already present in `public/uploads/landing-media/current/`.
- Cursor, click rings, zoom, captions, and the demo prompt are generated overlays.
- The output is intentionally silent for hero autoplay usage.
- The video is not currently wired into `data/cms.json`; the live local landing still uses the existing hero image until approval.
- Rebuild command from project root:

```bash
.venv/bin/python landing/aigenlabs-landing/scripts/build_hero_demo_video.py
```
