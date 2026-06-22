"use client";

import { useEffect, useRef } from "react";
import type { EditableMedia } from "@/lib/types";

interface CmsVideoProps {
  media: EditableMedia;
  autoPlayVideo: boolean;
  playbackRate: number;
}

export function CmsVideo({ media, autoPlayVideo, playbackRate }: CmsVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.defaultPlaybackRate = playbackRate;
    video.playbackRate = playbackRate;
  }, [playbackRate]);

  return (
    <video
      ref={videoRef}
      autoPlay={autoPlayVideo}
      controls={!autoPlayVideo}
      loop={autoPlayVideo}
      muted={autoPlayVideo}
      playsInline
      poster={media.poster || undefined}
      preload={autoPlayVideo ? "auto" : "metadata"}
      onLoadedMetadata={(event) => {
        event.currentTarget.defaultPlaybackRate = playbackRate;
        event.currentTarget.playbackRate = playbackRate;
      }}
    >
      <source src={media.url} />
    </video>
  );
}
