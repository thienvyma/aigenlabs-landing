"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Globe2, Headphones, Mail, MessageCircle, MessageSquare, Phone } from "lucide-react";
import type { FloatingDockContact, FloatingDockContent } from "@/lib/types";
import { cx, isExternalUrl } from "@/lib/utils";

interface FloatingDockProps {
  content: FloatingDockContent;
}

function ZaloGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true" focusable="false">
      <path
        d="M6.5 7.5h11L7 16.5h10.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.25"
      />
    </svg>
  );
}

function ContactIcon({ contact }: { contact: FloatingDockContact }) {
  const icon = contact.icon.toLowerCase();
  const href = contact.href.toLowerCase();
  if (icon.includes("zalo")) return <ZaloGlyph />;
  if (icon.includes("messenger")) return <MessageCircle size={19} aria-hidden="true" />;
  if (icon.includes("message") || icon.includes("chat")) return <MessageSquare size={19} aria-hidden="true" />;
  if (icon.includes("phone") || href.startsWith("tel:")) return <Phone size={19} aria-hidden="true" />;
  if (icon.includes("email") || icon.includes("mail") || href.startsWith("mailto:")) return <Mail size={19} aria-hidden="true" />;
  if (icon.includes("web") || href.startsWith("http")) return <Globe2 size={19} aria-hidden="true" />;
  return <Headphones size={19} aria-hidden="true" />;
}

function normalizeContactHref(href: string) {
  const trimmed = href.trim();
  if (!trimmed) return "";
  if (/^(https?:\/\/|mailto:|tel:|#|\/)/i.test(trimmed)) return trimmed;
  if (/^[\w.-]+\.[a-z]{2,}(?::\d+)?(?:[/?#].*)?$/i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
}

function opensInNewTab(href: string) {
  return isExternalUrl(href) && !href.startsWith("mailto:") && !href.startsWith("tel:");
}

export function FloatingDock({ content }: FloatingDockProps) {
  const [visible, setVisible] = useState(false);
  const contacts = content.contacts.filter((contact) => contact.enabled !== false && contact.href.trim().length > 0);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="floating-dock">
      {content.showBackToTop ? (
        <button
          type="button"
          aria-label="Back to top"
          className={cx("dock-button", "dock-back-top", visible && "visible")}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUp size={19} aria-hidden="true" />
          <span>Back to top</span>
        </button>
      ) : null}
      {contacts.map((contact) => {
        const href = normalizeContactHref(contact.href);
        return (
          <a
            key={`${contact.label}-${contact.href}`}
            className="dock-button dock-contact-button"
            aria-label={contact.label}
            href={href}
            target={opensInNewTab(href) ? "_blank" : undefined}
            rel={opensInNewTab(href) ? "noreferrer noopener" : undefined}
          >
            <ContactIcon contact={contact} />
            <span>{contact.label}</span>
          </a>
        );
      })}
    </div>
  );
}
