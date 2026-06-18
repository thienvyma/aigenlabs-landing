import { Mail, Phone } from "lucide-react";
import type { HeroSectionContent, SiteSettings } from "@/lib/types";
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

export function HeroSection({ id, content, settings }: HeroSectionProps) {
  const enabledChips = content.chips.filter((chip) => chip.enabled);
  return (
    <section id={id} className="hero section-anchor">
      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />
      <div className="container-wide hero-inner">
        <div className="hero-wordmark" aria-label={settings.brand.name}>
          <span className="hero-logo-mark">A</span>
          <span>{content.wordmark.replace(/^A/i, "")}</span>
        </div>
        <h1>{content.headline}</h1>
        <div className="hero-chips">
          {enabledChips.map((chip) => (
            <span key={chip.label} className="hero-chip">
              <span aria-hidden="true">✦</span>
              {chip.label}
            </span>
          ))}
        </div>
        <p>{content.subheadline}</p>
        <div className="hero-actions">
          {content.primaryCta.enabled !== false ? (
            <a className="btn btn-dark" href={content.primaryCta.href}>
              <ContactIcon href={content.primaryCta.href} size={20} />
              {content.primaryCta.label}
            </a>
          ) : null}
          {content.secondaryCta.enabled ? (
            <a className="btn btn-brand" href={content.secondaryCta.href}>
              <ContactIcon href={content.secondaryCta.href} size={20} />
              {content.secondaryCta.label}
            </a>
          ) : null}
        </div>
        <div className="hero-media">
          <CmsMediaFrame media={content.preview} fallbackTitle={content.preview.title} fallbackLabel={content.preview.label || settings.brand.name} autoPlayVideo />
        </div>
      </div>
    </section>
  );
}
