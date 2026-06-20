import { ArrowRight } from "lucide-react";
import type { ConversionCardsContent } from "@/lib/types";
import { IconGlyph } from "@/components/landing/IconGlyph";
import { cx } from "@/lib/utils";

interface ConversionCardsSectionProps {
  id: string;
  content: ConversionCardsContent;
}

export function ConversionCardsSection({ id, content }: ConversionCardsSectionProps) {
  const variant = content.variant ?? "default";

  return (
    <section id={id} className={cx("conversion section-anchor section-pad", `conversion-${variant}`)}>
      <div className="container-feature">
        <div className="section-intro">
          <span className="eyebrow">{content.eyebrow}</span>
          <h2 className="section-heading">{content.heading}</h2>
          <p className="section-copy">{content.description}</p>
        </div>
        <div className="conversion-grid">
          {content.cards.map((card) => (
            <article key={card.title} className="conversion-card">
              <div className="conversion-card-topline">
                <span className="conversion-icon">
                  <IconGlyph name={card.icon} />
                </span>
                {card.badge ? <span className="conversion-badge">{card.badge}</span> : null}
              </div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              {card.bullets?.length ? (
                <ul>
                  {card.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
              {card.cta?.enabled !== false && card.cta ? (
                <a className="conversion-card-link" href={card.cta.href}>
                  {card.cta.label}
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              ) : null}
            </article>
          ))}
        </div>
        {(content.cta?.enabled !== false && content.cta) || content.note ? (
          <div className="conversion-footer-row">
            {content.cta?.enabled !== false && content.cta ? (
              <a className="btn btn-brand" href={content.cta.href}>
                {content.cta.label}
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            ) : null}
            {content.note ? <p>{content.note}</p> : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
