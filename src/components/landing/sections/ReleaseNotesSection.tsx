import type { ReleaseNotesContent } from "@/lib/types";

interface ReleaseNotesSectionProps {
  id: string;
  content: ReleaseNotesContent;
}

export function ReleaseNotesSection({ id, content }: ReleaseNotesSectionProps) {
  return (
    <section id={id} className="release-notes section-anchor section-pad">
      <div className="container-wide release-container">
        <div className="section-intro">
          <h2 className="section-heading">{content.heading}</h2>
          <a href={content.viewAllHref} className="release-link">
            {content.viewAllLabel} →
          </a>
        </div>
        <div className="release-grid">
          {content.items.map((item) => (
            <article key={`${item.version}-${item.date}`} className="release-card">
              <header>
                <span>{item.version}</span>
                <time>{item.date}</time>
              </header>
              <ol>
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
