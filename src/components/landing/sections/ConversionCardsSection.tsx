import { ArrowRight, ChevronDown } from "lucide-react";
import type { ConversionCardsContent } from "@/lib/types";
import { IconGlyph } from "@/components/landing/IconGlyph";
import { cx } from "@/lib/utils";

interface ConversionCardsSectionProps {
  id: string;
  content: ConversionCardsContent;
}

export function ConversionCardsSection({ id, content }: ConversionCardsSectionProps) {
  const variant = content.variant ?? "default";
  const adaptiveCards = id === "pain-points" || id === "business-benefits";

  return (
    <section
      id={id}
      className={cx(
        "conversion section-anchor section-pad",
        `conversion-${variant}`,
        adaptiveCards && "conversion-mobile-compact",
        adaptiveCards && "conversion-desktop-balanced",
        adaptiveCards && `conversion-card-count-${content.cards.length}`
      )}
    >
      <div className="container-feature">
        <div className="section-intro">
          <span className="eyebrow">{content.eyebrow}</span>
          <h2 className="section-heading">{content.heading}</h2>
          <p className="section-copy">{content.description}</p>
        </div>
        <div className="conversion-grid">
          {content.cards.map((card) => {
            const badgeLabel = card.price || card.badge;

            return (
              <article key={card.title} className="conversion-card">
                <div className="conversion-card-topline">
                  <span className="conversion-icon">
                    <IconGlyph name={card.icon} />
                  </span>
                  {badgeLabel ? <span className="conversion-badge">{badgeLabel}</span> : null}
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
            );
          })}
        </div>
        {adaptiveCards ? (
          <div className="conversion-mobile-list">
            {content.cards.map((card) => {
              const badgeLabel = card.price || card.badge;
              const compactBullets = card.bullets?.filter(Boolean).slice(0, 2) ?? [];

              return (
                <details
                  key={`${card.title}-mobile`}
                  className="conversion-mobile-card"
                  name={`${id}-mobile-cards`}
                >
                  <summary>
                    <span className="conversion-icon">
                      <IconGlyph name={card.icon} />
                    </span>
                    <span className="conversion-mobile-summary-copy">
                      <span className="conversion-mobile-title-row">
                        <strong>{card.title}</strong>
                        {badgeLabel ? <span className="conversion-badge">{badgeLabel}</span> : null}
                      </span>
                      {compactBullets.length ? (
                        <span className="conversion-mobile-chips" aria-hidden="true">
                          {compactBullets.map((bullet) => (
                            <span key={bullet}>{bullet}</span>
                          ))}
                        </span>
                      ) : null}
                    </span>
                    <ChevronDown className="conversion-mobile-chevron" size={18} aria-hidden="true" />
                  </summary>
                  <div className="conversion-mobile-detail">
                    <p>{card.description}</p>
                    {card.bullets?.length ? (
                      <ul>
                        {card.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </details>
              );
            })}
          </div>
        ) : null}
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
