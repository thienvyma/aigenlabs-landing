import type { Metadata } from "next";
import type { BlogPost, CmsPage, SiteSettings } from "@/lib/types";
import { parseSectionContent } from "@/cms/sections/schema";
import { blogPostPath } from "@/lib/blog";
import { getLocalizedPath, getSupportedLocales } from "@/lib/i18n";

export function absoluteUrl(settings: SiteSettings, urlOrPath: string): string {
  if (!urlOrPath) return settings.siteUrl;
  if (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) return urlOrPath;
  const base = settings.siteUrl.replace(/\/$/, "");
  const path = urlOrPath.startsWith("/") ? urlOrPath : `/${urlOrPath}`;
  return `${base}${path}`;
}

export function pageMetadata(settings: SiteSettings, page: CmsPage): Metadata {
  const canonical = absoluteUrl(settings, page.seo.canonicalPath || page.path);
  const ogImage = page.seo.ogImage || settings.brand.faviconUrl || "";
  const languages = Object.fromEntries(
    getSupportedLocales(settings).map((locale) => [
      locale.code,
      absoluteUrl(settings, getLocalizedPath(page.path, locale.code, settings))
    ])
  );
  return {
    title: page.seo.title,
    description: page.seo.description,
    keywords: page.seo.keywords,
    alternates: {
      canonical,
      languages
    },
    robots: {
      index: page.seo.robotsIndex,
      follow: page.seo.robotsFollow
    },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: settings.siteName,
      title: page.seo.ogTitle || page.seo.title,
      description: page.seo.ogDescription || page.seo.description,
      images: ogImage ? [{ url: absoluteUrl(settings, ogImage) }] : []
    },
    twitter: {
      card: page.seo.twitterCard,
      title: page.seo.ogTitle || page.seo.title,
      description: page.seo.ogDescription || page.seo.description,
      images: ogImage ? [absoluteUrl(settings, ogImage)] : []
    }
  };
}

export function jsonLdForPage(settings: SiteSettings, page: CmsPage): Array<Record<string, unknown>> {
  const schemas: Array<Record<string, unknown>> = [];
  const url = absoluteUrl(settings, page.path);

  if (page.seo.schemas.organization) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: settings.brand.name,
      url: settings.siteUrl,
      logo: settings.brand.logoUrl ? absoluteUrl(settings, settings.brand.logoUrl) : undefined
    });
  }

  if (page.seo.schemas.website) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: settings.siteName,
      url: settings.siteUrl
    });
  }

  if (page.seo.schemas.softwareApplication) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: settings.brand.name,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: page.seo.description,
      url
    });
  }

  if (page.seo.schemas.faq) {
    const faqSection = page.sections.find((section) => section.enabled && section.type === "faq");
    const content = faqSection ? parseSectionContent("faq", faqSection.content) : undefined;
    const items = content?.items ?? [];
    if (items.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer
          }
        }))
      });
    }
  }

  return schemas;
}

export function blogPostMetadata(settings: SiteSettings, post: BlogPost): Metadata {
  const canonicalPath = post.seo.canonicalPath || blogPostPath(post);
  const canonical = absoluteUrl(settings, canonicalPath);
  const ogImage = post.seo.ogImage || post.coverImage || settings.brand.faviconUrl || "";

  return {
    title: post.seo.title || post.title,
    description: post.seo.description || post.excerpt,
    keywords: post.seo.keywords,
    alternates: { canonical },
    robots: {
      index: post.seo.robotsIndex,
      follow: post.seo.robotsFollow
    },
    openGraph: {
      type: "article",
      url: canonical,
      siteName: settings.siteName,
      title: post.seo.ogTitle || post.seo.title || post.title,
      description: post.seo.ogDescription || post.seo.description || post.excerpt,
      images: ogImage ? [{ url: absoluteUrl(settings, ogImage) }] : [],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: post.authorName ? [post.authorName] : undefined,
      section: post.category || undefined
    },
    twitter: {
      card: post.seo.twitterCard,
      title: post.seo.ogTitle || post.seo.title || post.title,
      description: post.seo.ogDescription || post.seo.description || post.excerpt,
      images: ogImage ? [absoluteUrl(settings, ogImage)] : []
    }
  };
}

export function jsonLdForBlogPost(settings: SiteSettings, post: BlogPost): Record<string, unknown> {
  const url = absoluteUrl(settings, blogPostPath(post));
  const image = post.coverImage || post.seo.ogImage || settings.brand.faviconUrl;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: image ? absoluteUrl(settings, image) : undefined,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Organization",
      name: post.authorName || settings.brand.name
    },
    publisher: {
      "@type": "Organization",
      name: settings.brand.name,
      logo: settings.brand.logoUrl ? absoluteUrl(settings, settings.brand.logoUrl) : undefined
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url
    },
    articleSection: post.category || undefined
  };
}
