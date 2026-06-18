import { ArrowRight } from "lucide-react";
import type { SecurityCardsContent } from "@/lib/types";
import { IconGlyph } from "@/components/landing/IconGlyph";

interface SecurityCardsSectionProps {
  id: string;
  content: SecurityCardsContent;
}

export function SecurityCardsSection({ id, content }: SecurityCardsSectionProps) {
  return (
    <section id={id} className="security section-anchor section-pad">
      <div className="container-feature">
        <div className="section-intro">
          <span className="eyebrow">{content.eyebrow}</span>
          <h2 className="section-heading">{content.heading}</h2>
          <p className="section-copy">{content.description}</p>
        </div>
        <div className="security-grid">
          {content.cards.map((card) => (
            <article key={card.title} className="security-card">
              <div className="security-icon">
                <IconGlyph name={card.icon} />
              </div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
        <div className="security-cta-row">
          {content.cta.enabled !== false ? (
            <a className="btn btn-brand" href={content.cta.href}>
              {content.cta.label}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          ) : null}
          <p>{content.note}</p>
        </div>
      </div>
    </section>
  );
}
