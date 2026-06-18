"use client";

import { useState } from "react";
import type { UseCaseTabsContent } from "@/lib/types";
import { CmsMediaFrame } from "@/components/landing/CmsMediaFrame";
import { cx } from "@/lib/utils";

interface UseCaseTabsSectionProps {
  id: string;
  content: UseCaseTabsContent;
}

export function UseCaseTabsSection({ id, content }: UseCaseTabsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTab = content.tabs[activeIndex] ?? content.tabs[0];

  if (!activeTab) return null;

  return (
    <section id={id} className="use-cases section-anchor section-pad">
      <div className="container-wide">
        <h2 className="section-heading use-cases-title">{content.heading}</h2>
        <div className="tab-rail-scroll" role="tablist" aria-label={content.heading}>
          <div className="tab-rail">
            {content.tabs.map((tab, index) => (
              <button
                key={tab.label}
                type="button"
                role="tab"
                aria-selected={activeIndex === index}
                className={cx("tab-pill", activeIndex === index && "tab-pill-active")}
                onClick={() => setActiveIndex(index)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <article className="use-case-card">
          <div className="use-case-copy">
            <span className="eyebrow">{activeTab.label}</span>
            <h3>{activeTab.title}</h3>
            <p>{activeTab.description}</p>
          </div>
          <div className="use-case-media">
            <CmsMediaFrame media={activeTab.media} fallbackTitle={activeTab.mediaTitle} fallbackLabel={activeTab.label} compact />
          </div>
        </article>
      </div>
    </section>
  );
}
