import type { EditableMedia } from "@/lib/types";
import { MediaPreview } from "@/components/landing/MediaPreview";

interface CmsMediaFrameProps {
  media?: EditableMedia;
  fallbackTitle: string;
  fallbackLabel: string;
  compact?: boolean;
  autoPlayVideo?: boolean;
}

export function CmsMediaFrame({ media, fallbackTitle, fallbackLabel, compact = false, autoPlayVideo = false }: CmsMediaFrameProps) {
  if (media?.kind === "image" && media.url) {
    return (
      <div className="cms-media-window">
        <div className="cms-media-bar" aria-hidden="true">
          <span className="cms-media-dot red" />
          <span className="cms-media-dot yellow" />
          <span className="cms-media-dot cyan" />
        </div>
        <img src={media.url} alt={media.alt || media.title} />
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
        <video
          autoPlay={autoPlayVideo}
          controls={!autoPlayVideo}
          loop={autoPlayVideo}
          muted={autoPlayVideo}
          playsInline
          poster={media.poster || undefined}
          preload={autoPlayVideo ? "auto" : "metadata"}
        >
          <source src={media.url} />
        </video>
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
