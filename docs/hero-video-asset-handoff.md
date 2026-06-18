# Hero video asset handoff — AigenLabs Business OS

## Scope

This is a local draft hero video for the AigenLabs landing page.

Approved by founder in chat for this pass:

- Use current AigenLabs local app/config for product captures.
- Create a demo hero video asset from safe app screens.
- Simulate a local approval gate so viewers can understand approval exists.
- Save video/poster files in the landing project for review.

Not done:

- No publish/deploy.
- No outreach/send/spend.
- No connector install or account connection.
- No real approval/publish action was triggered.
- No customer/prospect data was intentionally used.

## Scenario

**Founder launch request → AI staff workflow → approval → COO report**

A startup founder asks AigenLabs Business OS to prepare go-to-market content safely. AigenLabs maps the goal into a workflow, shows AI staff/capabilities, tracks execution on a board, shows founder approval before publish, and ends with report readiness.

## Video beats

| Time | Beat | Message |
|---:|---|---|
| 0–2.5s | Business OS Command Center | `Từ một mục tiêu kinh doanh` |
| 2.5–5.0s | Workflow Map | `thành workflow rõ ràng` |
| 5.0–7.3s | AI staff/capabilities | `AI staff nhận vai trò` |
| 7.3–9.8s | Execution Board | `tiến độ được theo dõi` |
| 9.8–12.3s | Founder Approval | `Founder giữ quyền phê duyệt` |
| 12.3–15.0s | COO report/end state | `Báo cáo sẵn sàng mỗi ngày` |

## Draft outputs

Use these for local review:

```text
public/uploads/landing-media/video/draft/hero-business-os-demo-draft.mp4
public/uploads/landing-media/video/draft/hero-business-os-demo-draft.webm
public/uploads/landing-media/video/draft/hero-business-os-demo-poster.webp
public/uploads/landing-media/video/draft/hero-business-os-demo-manifest.json
```

Public URLs if served by the local Next/landing server:

```text
/uploads/landing-media/video/draft/hero-business-os-demo-draft.mp4
/uploads/landing-media/video/draft/hero-business-os-demo-draft.webm
/uploads/landing-media/video/draft/hero-business-os-demo-poster.webp
```

## Raw app captures used

Raw captures were copied into:

```text
public/uploads/landing-media/video/raw/2026-06-18/
```

Files:

```text
command_center.png
workflow_map.png
workflow_approval.png
execution_board.png
approvals_page.png
skills_tools.png
```

## Technical format

MP4:

```text
codec: h264
resolution: 1920x1080
frame rate: 24 fps
duration: 15.0s
size: ~4.2 MB
```

WebM:

```text
codec: vp9
resolution: 1920x1080
frame rate: 24 fps
duration: 15.0s
size: ~2.2 MB
```

Poster:

```text
format: WebP
resolution: 1920x1080
```

## Simulated approval note

The approval beat uses the real Workflow Map stage named **Founder Approval** plus a visual overlay card:

```text
Founder approval required
Approve demo / Approved
```

This is a local visual simulation for demo clarity. It does not represent a real publish approval or live customer action.

## Suggested CMS media object for hero draft

When the founder wants to preview this video inside the hero slot, update only the hero media object in `data/cms.json`:

```json
{
  "kind": "video",
  "title": "AigenLabs Business OS demo",
  "label": "AI staff workflow with approval",
  "alt": "Hero video showing AigenLabs Business OS workflow, AI staff and approval gate",
  "url": "/uploads/landing-media/video/draft/hero-business-os-demo-draft.mp4",
  "poster": "/uploads/landing-media/video/draft/hero-business-os-demo-poster.webp"
}
```

Optional WebM support would require component support for multiple `<source>` elements; current simple CMS media object uses one `url`.

## Review checklist

Before using this as final public hero media, review:

- Is the message clear within 3 seconds?
- Is the approval gate obvious enough?
- Are overlays readable on desktop and mobile crop?
- Does the AI staff scene feel like staff/capabilities rather than only a settings page?
- Is the execution board scene acceptable with demo task-card overlays?
- Should the final copy say `AI staff` or `Nhân sự AI`?
- Confirm no customer/prospect/secret data is visible.

## Git/tracking note

The project currently ignores:

```text
public/uploads/*
data/
```

So these video/media files are in the project directory for local review, but may not be tracked by git unless the ignore rules are changed or the assets are moved to a tracked folder such as:

```text
public/landing-media/video/
```

Do not deploy/publish without founder approval.
