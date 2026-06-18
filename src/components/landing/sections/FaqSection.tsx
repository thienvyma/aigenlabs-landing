"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqContent } from "@/lib/types";
import { cx } from "@/lib/utils";

interface FaqSectionProps {
  id: string;
  content: FaqContent;
}

export function FaqSection({ id, content }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section id={id} className="faq section-anchor section-pad">
      <div className="container-faq">
        <h2 className="section-heading">{content.heading}</h2>
        <div className="faq-list">
          {content.items.map((item, index) => {
            const open = openIndex === index;
            return (
              <article key={item.question} className="faq-item">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? -1 : index)}
                >
                  <span>{item.question}</span>
                  <ChevronDown size={20} className={cx(open && "open")} aria-hidden="true" />
                </button>
                <div className={cx("faq-panel", open && "open")}>
                  <div>
                    <p>{item.answer}</p>
                    {item.linkHref && item.linkLabel ? <a href={item.linkHref}>{item.linkLabel} →</a> : null}
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
