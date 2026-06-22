"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Globe2, Mail, Menu, Phone, X } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import { getLocalizedPath, getSupportedLocales } from "@/lib/i18n";
import { cx, isExternalUrl } from "@/lib/utils";

interface SiteNavProps {
  settings: SiteSettings;
  currentLocale: string;
  currentPath: string;
}

function SmartLink({
  href,
  className,
  children,
  ariaLabel,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
      target={
        isExternalUrl(href) &&
        !href.startsWith("mailto:") &&
        !href.startsWith("tel:")
          ? "_blank"
          : undefined
      }
      rel={
        isExternalUrl(href) &&
        !href.startsWith("mailto:") &&
        !href.startsWith("tel:")
          ? "noreferrer noopener"
          : undefined
      }
    >
      {children}
    </a>
  );
}

function Logo({ settings }: { settings: SiteSettings }) {
  if (settings.brand.logoUrl) {
    return (
      <img
        src={settings.brand.logoUrl}
        alt={settings.brand.name}
        className="site-logo-image"
      />
    );
  }

  return (
    <span className="site-logo-text">
      <img
        className="site-logo-mark-image"
        src="/brand/aigenlabs-icon-primary.svg"
        alt=""
        aria-hidden="true"
      />
      {settings.brand.logoText.replace(/^A/i, "")}
    </span>
  );
}

function ContactIcon({ href, size }: { href: string; size: number }) {
  if (href.startsWith("tel:")) return <Phone size={size} aria-hidden="true" />;
  return <Mail size={size} aria-hidden="true" />;
}

export function SiteNav({
  settings,
  currentLocale,
  currentPath,
}: SiteNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const locales = getSupportedLocales(settings);
  const homePath = getLocalizedPath("/", currentLocale, settings);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cx("site-nav", scrolled && "site-nav-scrolled")}>
      <div className="site-nav-inner">
        <SmartLink
          href={homePath}
          className="site-logo"
          ariaLabel={settings.brand.name}
        >
          <Logo settings={settings} />
        </SmartLink>

        <nav className="site-nav-links" aria-label="Primary navigation">
          {settings.navigation.items.map((item) => (
            <div key={item.label} className="nav-item-wrap">
              <SmartLink href={item.href} className="nav-link">
                <span>{item.label}</span>
                {item.badge ? (
                  <span className="nav-badge">{item.badge}</span>
                ) : null}
                {item.kind === "dropdown" ? (
                  <ChevronDown size={16} aria-hidden="true" />
                ) : null}
              </SmartLink>
              {item.kind === "dropdown" && item.children?.length ? (
                <div className="nav-dropdown">
                  {item.children.map((child) => (
                    <SmartLink
                      key={child.href}
                      href={child.href}
                      className="nav-dropdown-link"
                    >
                      {child.label}
                    </SmartLink>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>

        <div className="site-nav-actions">
          <div className="nav-language" aria-label="Language selector">
            <Globe2 size={18} aria-hidden="true" />
            <span>{settings.navigation.languageLabel}</span>
            <span className="nav-language-options">
              {locales.map((locale) => (
                <SmartLink
                  key={locale.code}
                  href={getLocalizedPath(currentPath, locale.code, settings)}
                  className={cx(
                    "nav-language-option",
                    locale.code === currentLocale && "active",
                  )}
                  ariaLabel={`View ${locale.nativeLabel}`}
                >
                  {locale.code.toUpperCase()}
                </SmartLink>
              ))}
            </span>
          </div>
          {settings.navigation.secondaryCta.enabled ? (
            <SmartLink
              href={settings.navigation.secondaryCta.href}
              className="nav-outline"
            >
              {settings.navigation.secondaryCta.label}
            </SmartLink>
          ) : null}
          {settings.navigation.signIn.enabled ? (
            <SmartLink
              href={settings.navigation.signIn.href}
              className="nav-signin"
            >
              {settings.navigation.signIn.label}
            </SmartLink>
          ) : null}
          {settings.navigation.primaryCta.enabled ? (
            <SmartLink
              href={settings.navigation.primaryCta.href}
              className="nav-primary"
            >
              <ContactIcon
                href={settings.navigation.primaryCta.href}
                size={16}
              />
              {settings.navigation.primaryCta.label}
            </SmartLink>
          ) : null}
          <button
            type="button"
            className="nav-mobile-toggle"
            aria-label="Open navigation menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X size={24} aria-hidden="true" />
            ) : (
              <Menu size={24} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {open ? (
        <div className="mobile-menu">
          {settings.navigation.items.map((item) => (
            <SmartLink
              key={item.label}
              href={item.href}
              className="mobile-menu-link"
            >
              {item.label}
            </SmartLink>
          ))}
          <div className="mobile-language-row" aria-label="Language selector">
            {locales.map((locale) => (
              <SmartLink
                key={locale.code}
                href={getLocalizedPath(currentPath, locale.code, settings)}
                className={cx(
                  "mobile-language-link",
                  locale.code === currentLocale && "active",
                )}
              >
                {locale.nativeLabel}
              </SmartLink>
            ))}
          </div>
          {settings.navigation.secondaryCta.enabled ? (
            <SmartLink
              href={settings.navigation.secondaryCta.href}
              className="btn btn-outline mobile-menu-cta"
            >
              <ContactIcon
                href={settings.navigation.secondaryCta.href}
                size={18}
              />
              {settings.navigation.secondaryCta.label}
            </SmartLink>
          ) : null}
          {settings.navigation.primaryCta.enabled ? (
            <SmartLink
              href={settings.navigation.primaryCta.href}
              className="btn btn-dark mobile-menu-cta"
            >
              <ContactIcon
                href={settings.navigation.primaryCta.href}
                size={18}
              />
              {settings.navigation.primaryCta.label}
            </SmartLink>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
