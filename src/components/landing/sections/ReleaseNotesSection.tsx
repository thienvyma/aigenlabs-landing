import type { ReleaseNotesContent } from "@/lib/types";
import { AccentText } from "@/components/landing/AccentText";

interface ReleaseNotesSectionProps {
  id: string;
  content: ReleaseNotesContent;
}

export function ReleaseNotesSection({ id, content }: ReleaseNotesSectionProps) {
  return (
    <section id={id} className="release-notes section-anchor section-pad">
      <div className="container-wide release-container">
        <div className="section-intro">
          <h2 className="section-heading">
            <AccentText text={content.heading} accents={["Setup đầu tiên", "diễn ra", "workflow"]} />
          </h2>
          <a href={content.viewAllHref} className="release-link">
            {content.viewAllLabel} →
          </a>
        </div>
        <div className="release-grid">
          {content.items.map((item, index) => {
            const stepNumber = item.version.match(/\d+/)?.[0] ?? `${index + 1}`;

            return (
              <article key={`${item.version}-${item.date}`} className="release-card">
                <header className="release-card-header">
                  <span className="release-step-index" aria-hidden="true">
                    {stepNumber.padStart(2, "0")}
                  </span>
                  <div className="release-card-title-group">
                    <span className="release-step-label">{item.version}</span>
                    <h3>{item.date}</h3>
                  </div>
                </header>
                <ul className="release-card-list">
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
