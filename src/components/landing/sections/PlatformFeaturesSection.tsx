import type { EditableMedia, PlatformFeaturesContent } from "@/lib/types";
import { AccentText } from "@/components/landing/AccentText";
import { IconGlyph } from "@/components/landing/IconGlyph";

interface PlatformFeaturesSectionProps {
  id: string;
  content: PlatformFeaturesContent;
}

type PlatformFeature = PlatformFeaturesContent["features"][number];

function ProofThumb({ media, title }: { media?: EditableMedia; title: string }) {
  if (media?.kind === "image" && media.url) {
    return <img src={media.url} alt={media.alt || media.title || title} loading="lazy" decoding="async" />;
  }

  if (media?.kind === "video" && media.url) {
    return (
      <video muted playsInline preload="none" poster={media.poster || undefined}>
        <source src={media.url} />
      </video>
    );
  }

  return <div className="proof-thumb-fallback" aria-hidden="true" />;
}

function ProofCard({ feature, muted }: { feature: PlatformFeature; muted?: boolean }) {
  const shortPoints = feature.slides.filter(Boolean).slice(0, 2);
  return (
    <article className="proof-card" aria-hidden={muted || undefined}>
      <div className="proof-card-media">
        <ProofThumb media={feature.media} title={feature.title} />
      </div>
      <div className="proof-card-body">
        <div className="proof-card-label">
          <span className="feature-icon proof-icon">
            <IconGlyph name={feature.icon} size={18} />
          </span>
          <span>{feature.badge || "Proof sản phẩm"}</span>
        </div>
        <h3>{feature.title}</h3>
        <p>{feature.description}</p>
        {shortPoints.length ? (
          <ul>
            {shortPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

function MarqueeRow({ items, direction }: { items: PlatformFeature[]; direction: "right" | "left" }) {
  const doubled = [...items, ...items];
  return (
    <div className={`proof-marquee-row proof-marquee-${direction}`}>
      <div className="proof-marquee-track">
        {doubled.map((feature, index) => (
          <ProofCard key={`${feature.title}-${index}`} feature={feature} muted={index >= items.length} />
        ))}
      </div>
    </div>
  );
}

export function PlatformFeaturesSection({ id, content }: PlatformFeaturesSectionProps) {
  const topRow = content.features.filter((_, index) => index % 2 === 0);
  const bottomRow = content.features.filter((_, index) => index % 2 === 1);

  return (
    <section id={id} className="platform proof-marquee-section section-anchor section-pad">
      <div className="container-wide">
        <div className="section-intro proof-intro">
          <span className="proof-kicker">{content.eyebrow}</span>
          <h2 id={`${id}-heading`} className="section-heading">
            <AccentText text={content.heading} accents={["Proof sản phẩm", "không chỉ lời hứa", "workflow thật", "app thật"]} />
          </h2>
          <p className="section-copy">{content.description}</p>
        </div>
      </div>
      <div className="proof-marquee-wrap" aria-label={content.heading}>
        <MarqueeRow items={topRow} direction="right" />
        <MarqueeRow items={bottomRow} direction="left" />
      </div>
    </section>
  );
}
