import type { SiteSettings } from "@/lib/types";
import { isExternalUrl } from "@/lib/utils";

interface SiteFooterProps {
  settings: SiteSettings;
}

function FooterLogo({ settings }: SiteFooterProps) {
  if (settings.brand.logoUrl) {
    return <img src={settings.brand.logoUrl} alt={settings.brand.name} className="footer-logo-image" />;
  }

  return (
    <span className="site-logo-text footer-logo-text">
      <span className="site-logo-mark">A</span>
      {settings.brand.logoText.replace(/^A/i, "")}
    </span>
  );
}

export function SiteFooter({ settings }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="container-faq footer-columns">
        {settings.footer.columns.map((column) => (
          <div key={column.title}>
            <h3>{column.title}</h3>
            <ul>
              {column.links.map((link) => (
                <li key={`${column.title}-${link.href}`}>
                  <a
                    href={link.href}
                    target={isExternalUrl(link.href) && !link.href.startsWith("mailto:") && !link.href.startsWith("tel:") ? "_blank" : undefined}
                    rel={isExternalUrl(link.href) && !link.href.startsWith("mailto:") && !link.href.startsWith("tel:") ? "noreferrer noopener" : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <div className="container-wide">
          <FooterLogo settings={settings} />
          <p>{settings.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
