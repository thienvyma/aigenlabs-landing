"use client";

import { useEffect, useId, useState } from "react";
import { Bot, Globe2, Headphones, Mail, MessageCircle, MessageSquare, Phone, X } from "lucide-react";
import type { FloatingDockContact, FloatingDockContent } from "@/lib/types";
import { cx, isExternalUrl } from "@/lib/utils";

interface FloatingDockProps {
  content: FloatingDockContent;
}

type ContactPlatform = "chatbot" | "email" | "facebook" | "messenger" | "phone" | "website" | "zalo" | "support";
type WebhookTrigger = FloatingDockContent["webhook"]["trigger"];

function platformFrom(icon: string, href = ""): ContactPlatform {
  const normalizedIcon = icon.toLowerCase();
  const normalizedHref = href.toLowerCase();
  if (normalizedIcon.includes("zalo") || normalizedHref.includes("zalo.me")) return "zalo";
  if (normalizedIcon.includes("facebook") || normalizedHref.includes("facebook.com")) return "facebook";
  if (normalizedIcon.includes("messenger") || normalizedHref.includes("m.me") || normalizedHref.includes("messenger.com")) return "messenger";
  if (normalizedIcon.includes("chatbot") || normalizedIcon.includes("bot")) return "chatbot";
  if (normalizedIcon.includes("phone") || normalizedHref.startsWith("tel:")) return "phone";
  if (normalizedIcon.includes("email") || normalizedIcon.includes("mail") || normalizedHref.startsWith("mailto:")) return "email";
  if (normalizedIcon.includes("web") || normalizedHref.startsWith("http")) return "website";
  return "support";
}

function ZaloGlyph() {
  return <span className="brand-glyph brand-glyph-zalo" aria-hidden="true">Zalo</span>;
}

function FacebookGlyph() {
  return <span className="brand-glyph brand-glyph-facebook" aria-hidden="true">f</span>;
}

function ContactIcon({ icon, href = "", size = 20 }: { icon: string; href?: string; size?: number }) {
  const platform = platformFrom(icon, href);
  if (platform === "zalo") return <ZaloGlyph />;
  if (platform === "facebook") return <FacebookGlyph />;
  if (platform === "messenger") return <MessageCircle size={size} aria-hidden="true" />;
  if (platform === "chatbot") return <Bot size={size} aria-hidden="true" />;
  if (platform === "phone") return <Phone size={size} aria-hidden="true" />;
  if (platform === "email") return <Mail size={size} aria-hidden="true" />;
  if (platform === "website") return <Globe2 size={size} aria-hidden="true" />;
  return <Headphones size={size} aria-hidden="true" />;
}

function channelHint(platform: ContactPlatform) {
  switch (platform) {
    case "zalo":
      return "Zalo chat";
    case "facebook":
      return "Facebook page";
    case "messenger":
      return "Messenger";
    case "chatbot":
      return "Chatbot";
    case "phone":
      return "Điện thoại";
    case "email":
      return "Gửi mail";
    case "website":
      return "Website";
    default:
      return "Kênh hỗ trợ";
  }
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

function shouldSendWebhook(configuredTrigger: WebhookTrigger, currentTrigger: Exclude<WebhookTrigger, "both">) {
  return configuredTrigger === "both" || configuredTrigger === currentTrigger;
}

export function FloatingDock({ content }: FloatingDockProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const contacts = content.contacts.filter((contact) => contact.enabled !== false && contact.href.trim().length > 0);
  const webhook = content.webhook;
  const helperLabel = content.helperLabel || "Hỗ trợ";
  const helperTooltip = content.helperTooltip || helperLabel;
  const helperPlatform = platformFrom(content.helperIcon || "support");

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function sendWebhook(trigger: Exclude<WebhookTrigger, "both">, contact?: FloatingDockContact) {
    if (!webhook.enabled || !webhook.url.trim() || !shouldSendWebhook(webhook.trigger, trigger)) return;

    const payload = {
      event: webhook.eventName || "floating_helper",
      trigger,
      contact: contact ? { label: contact.label, icon: contact.icon } : undefined,
      page: typeof window !== "undefined" ? { href: window.location.href, path: window.location.pathname } : undefined,
      timestamp: new Date().toISOString()
    };
    const body = JSON.stringify(payload);
    const blob = new Blob([body], { type: "text/plain;charset=UTF-8" });

    if (navigator.sendBeacon?.(webhook.url, blob)) return;

    void fetch(webhook.url, {
      method: "POST",
      body: blob,
      keepalive: true,
      mode: isExternalUrl(webhook.url) ? "no-cors" : "same-origin"
    }).catch(() => undefined);
  }

  function toggleHelper() {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen) sendWebhook("helper_open");
  }

  if (!content.showBackToTop || (!contacts.length && !webhook.enabled)) return null;

  return (
    <div className={cx("floating-dock", open && "floating-dock-open")}>
      {open ? (
        <div id={panelId} className="floating-helper-panel" aria-hidden={false}>
          {contacts.map((contact) => {
            const href = normalizeContactHref(contact.href);
            const platform = platformFrom(contact.icon, href);
            return (
              <a
                key={`${contact.label}-${contact.href}`}
                className={cx("helper-channel", `helper-channel-${platform}`)}
                aria-label={contact.label}
                href={href}
                target={opensInNewTab(href) ? "_blank" : undefined}
                rel={opensInNewTab(href) ? "noreferrer noopener" : undefined}
                onClick={() => sendWebhook("contact_click", contact)}
              >
                <span className="helper-channel-icon">
                  <ContactIcon icon={contact.icon} href={href} />
                </span>
                <span className="helper-channel-copy">
                  <strong>{contact.label}</strong>
                  <small>{channelHint(platform)}</small>
                </span>
              </a>
            );
          })}
        </div>
      ) : null}
      <button
        type="button"
        className={cx("dock-button", "helper-toggle", `helper-toggle-${helperPlatform}`)}
        aria-label={helperLabel}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggleHelper}
      >
        <span className="helper-toggle-icon">
          {open ? <X size={22} aria-hidden="true" /> : <ContactIcon icon={content.helperIcon || "support"} size={22} />}
        </span>
        <span className="helper-toggle-tooltip">{helperTooltip}</span>
      </button>
    </div>
  );
}
