interface MediaPreviewProps {
  title: string;
  label?: string;
  compact?: boolean;
}

export function MediaPreview({ title, label = "AI workspace", compact = false }: MediaPreviewProps) {
  return (
    <div className="cms-media-window">
      <div className="cms-media-bar" aria-hidden="true">
        <span className="cms-media-dot red" />
        <span className="cms-media-dot yellow" />
        <span className="cms-media-dot cyan" />
      </div>
      <div className={compact ? "media-preview-screen media-preview-screen-compact" : "media-preview-screen"}>
        <div className="media-preview-sidebar">
          <strong>AigenLabs</strong>
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="media-preview-canvas">
          <div className="media-preview-toolbar">
            <span>{label}</span>
            <i />
            <i />
          </div>
          <div className="media-preview-document">
            <p>{title}</p>
            <div className="media-preview-lines">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="media-preview-result">
              <b>AI</b>
              <span />
              <span />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
