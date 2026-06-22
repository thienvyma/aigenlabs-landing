import type { EditableMedia } from "@/lib/types";
import { CmsVideo } from "@/components/landing/CmsVideo";
import { MediaPreview } from "@/components/landing/MediaPreview";

interface CmsMediaFrameProps {
  media?: EditableMedia;
  fallbackTitle: string;
  fallbackLabel: string;
  compact?: boolean;
  autoPlayVideo?: boolean;
  videoPlaybackRate?: number;
}

export function CmsMediaFrame({
  media,
  fallbackTitle,
  fallbackLabel,
  compact = false,
  autoPlayVideo = false,
  videoPlaybackRate = 1,
}: CmsMediaFrameProps) {
  if (media?.kind === "image" && media.url) {
    return (
      <div className="cms-media-window">
        <div className="cms-media-bar" aria-hidden="true">
          <span className="cms-media-dot red" />
          <span className="cms-media-dot yellow" />
          <span className="cms-media-dot cyan" />
        </div>
        <img src={media.url} alt={media.alt || media.title} loading="lazy" decoding="async" />
      </div>
    );
  }

  if (media?.kind === "video" && media.url) {
    return (
      <div className="cms-media-window">
        <div className="cms-media-bar" aria-hidden="true">
          <span className="cms-media-dot red" />
          <span className="cms-media-dot yellow" />
          <span className="cms-media-dot cyan" />
        </div>
        <CmsVideo media={media} autoPlayVideo={autoPlayVideo} playbackRate={videoPlaybackRate} />
      </div>
    );
  }

  return (
    <MediaPreview
      title={media?.title || fallbackTitle}
      label={media?.label || fallbackLabel}
      compact={compact}
    />
  );
}
