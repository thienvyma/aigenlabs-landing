import { Mail, Phone } from "lucide-react";
import type { HeroSectionContent, SiteSettings } from "@/lib/types";
import { AccentText } from "@/components/landing/AccentText";
import { CmsMediaFrame } from "@/components/landing/CmsMediaFrame";

interface HeroSectionProps {
  id: string;
  content: HeroSectionContent;
  settings: SiteSettings;
}

function ContactIcon({ href, size }: { href: string; size: number }) {
  if (href.startsWith("tel:")) return <Phone size={size} aria-hidden="true" />;
  return <Mail size={size} aria-hidden="true" />;
}

function HeroProofMedia({ content, settings }: { content: HeroSectionContent; settings: SiteSettings }) {
  const media = content.preview;
  if (media?.kind === "image" && media.url) {
    return (
      <div className="hero-proof-card">
        <img src={media.url} alt={media.alt || media.title} fetchPriority="high" decoding="async" />
      </div>
    );
  }

  return (
    <CmsMediaFrame
      media={media}
      fallbackTitle={content.preview.title}
      fallbackLabel={content.preview.label || settings.brand.name}
      autoPlayVideo
      videoPlaybackRate={1.35}
    />
  );
}

export function HeroSection({ id, content, settings }: HeroSectionProps) {
  return (
    <section id={id} className="hero section-anchor">
      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />
      <div className="container-wide hero-inner">
        <div className="hero-copy">
          <div className="hero-wordmark" aria-label={`${settings.brand.name} Business OS`}>
            {content.wordmark}
          </div>
          <h1>
            <AccentText text={content.headline} accents={["AI Agent", "Business OS", "workflow", "công ty bạn"]} />
          </h1>
          <p>{content.subheadline}</p>
          <div className="hero-actions">
            {content.primaryCta.enabled !== false ? (
              <a className="btn btn-brand" href={content.primaryCta.href}>
                <ContactIcon href={content.primaryCta.href} size={20} />
                {content.primaryCta.label}
              </a>
            ) : null}
            {content.secondaryCta.enabled ? (
              <a className="btn btn-outline" href={content.secondaryCta.href}>
                <ContactIcon href={content.secondaryCta.href} size={20} />
                {content.secondaryCta.label}
              </a>
            ) : null}
          </div>
        </div>
        <div className="hero-media">
          <HeroProofMedia content={content} settings={settings} />
        </div>
      </div>
    </section>
  );
}
