"use client";

import { useId, useState } from "react";
import type { UseCaseTabsContent } from "@/lib/types";
import { AccentText } from "@/components/landing/AccentText";
import { CmsMediaFrame } from "@/components/landing/CmsMediaFrame";
import { cx } from "@/lib/utils";

interface UseCaseTabsSectionProps {
  id: string;
  content: UseCaseTabsContent;
}

export function UseCaseTabsSection({ id, content }: UseCaseTabsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const mobileTabBaseId = useId();
  const loopSteps = content.tabs.slice(0, 5);
  const activeStep = loopSteps[activeIndex] ?? loopSteps[0];

  if (!activeStep) return null;

  return (
    <section id={id} className="use-cases section-anchor section-pad">
      <div className="container-wide">
        <div className="use-cases-head">
          <h2 className="section-heading use-cases-title">
            <AccentText text={content.heading} accents={["vòng vận hành", "mục tiêu", "workflow"]} />
          </h2>
          <p className="section-copy">
            AigenLabs biến yêu cầu kinh doanh thành quy trình có người phụ trách, đầu ra và bằng chứng để theo dõi.
          </p>
        </div>
        <div className="operating-loop operating-loop-desktop">
          <div className="operating-steps" role="tablist" aria-label={content.heading}>
            {loopSteps.map((step, index) => (
              <button
                key={step.label}
                type="button"
                role="tab"
                aria-selected={activeIndex === index}
                className={cx("operating-step", activeIndex === index && "operating-step-active")}
                onClick={() => setActiveIndex(index)}
              >
                <span className="operating-step-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="operating-step-copy">
                  <strong>{step.title}</strong>
                  <span>{step.description}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="operating-media" role="tabpanel" aria-label={activeStep.title}>
            <CmsMediaFrame media={activeStep.media} fallbackTitle={activeStep.mediaTitle} fallbackLabel={activeStep.label} compact />
          </div>
        </div>
        <div className="operating-mobile-list" role="tablist" aria-label={`${content.heading} mobile`}>
          {loopSteps.map((step, index) => {
            const open = activeIndex === index;
            const tabId = `${mobileTabBaseId}-mobile-tab-${index}`;
            const panelId = `${mobileTabBaseId}-mobile-panel-${index}`;

            return (
              <article key={step.label} className={cx("operating-mobile-item", open && "operating-mobile-item-active")}>
                <button
                  id={tabId}
                  type="button"
                  role="tab"
                  aria-selected={open}
                  aria-controls={panelId}
                  className="operating-mobile-trigger"
                  onClick={() => setActiveIndex(index)}
                >
                  <span className="operating-step-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="operating-mobile-trigger-copy">
                    <strong>{step.title}</strong>
                    <span>{step.label}</span>
                  </span>
                </button>
                <div
                  id={panelId}
                  role="tabpanel"
                  aria-labelledby={tabId}
                  className={cx("operating-mobile-panel", open && "open")}
                >
                  <div>
                    <p>{step.description}</p>
                    <CmsMediaFrame
                      media={step.media}
                      fallbackTitle={step.mediaTitle}
                      fallbackLabel={step.label}
                      compact
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
