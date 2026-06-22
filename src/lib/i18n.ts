import type { FooterSettings, LocaleSettings, NavigationSettings, SiteSettings } from "@/lib/types";

export const fallbackDefaultLocale = "vi";
export const builtInLocales = [
  { code: "vi", label: "Vietnamese", nativeLabel: "Tiếng Việt", pathPrefix: "" }
] as const;

function fallbackNavigation(_locale: string, navigation: NavigationSettings): NavigationSettings {
  return navigation;
}

function fallbackFooter(_locale: string, footer: FooterSettings): FooterSettings {
  return footer;
}

export function getSupportedLocales(settings: SiteSettings): LocaleSettings[] {
  if (settings.supportedLocales?.length) {
    return settings.supportedLocales.map((locale) => ({
      ...locale,
      pathPrefix: locale.pathPrefix === "/" ? "" : locale.pathPrefix.replace(/\/+$/, "")
    }));
  }

  const defaultLocale = settings.defaultLocale || fallbackDefaultLocale;
  return builtInLocales.map((locale) => ({
    code: locale.code,
    label: locale.label,
    nativeLabel: locale.nativeLabel,
    pathPrefix: locale.code === defaultLocale ? "" : locale.pathPrefix,
    navigation: fallbackNavigation(locale.code, settings.navigation),
    footer: fallbackFooter(locale.code, settings.footer)
  }));
}

export function getDefaultLocale(settings: SiteSettings): string {
  return settings.defaultLocale || fallbackDefaultLocale;
}

export function isSupportedLocale(settings: SiteSettings, locale: string): boolean {
  return getSupportedLocales(settings).some((entry) => entry.code === locale);
}

export function getLocaleSettings(settings: SiteSettings, locale: string): LocaleSettings | undefined {
  return getSupportedLocales(settings).find((entry) => entry.code === locale);
}

export function getLocalizedSiteSettings(settings: SiteSettings, locale: string): SiteSettings {
  const localized = getLocaleSettings(settings, locale);
  return {
    ...settings,
    navigation: localized?.navigation ?? settings.navigation,
    footer: localized?.footer ?? settings.footer
  };
}

export function getLocalePrefix(settings: SiteSettings, locale: string): string {
  const localized = getLocaleSettings(settings, locale);
  if (localized) return localized.pathPrefix;
  return locale === getDefaultLocale(settings) ? "" : `/${locale}`;
}

export function stripLocalePrefix(pathname: string, settings: SiteSettings): { locale: string; basePath: string } {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const locales = getSupportedLocales(settings)
    .filter((locale) => locale.pathPrefix)
    .sort((a, b) => b.pathPrefix.length - a.pathPrefix.length);

  for (const locale of locales) {
    if (path === locale.pathPrefix || path.startsWith(`${locale.pathPrefix}/`)) {
      const stripped = path.slice(locale.pathPrefix.length) || "/";
      return { locale: locale.code, basePath: stripped.startsWith("/") ? stripped : `/${stripped}` };
    }
  }

  return { locale: getDefaultLocale(settings), basePath: path };
}

export function getLocaleFromPath(pathname: string, settings: SiteSettings): string {
  return stripLocalePrefix(pathname, settings).locale;
}

export function getLocalizedPath(pathname: string, targetLocale: string, settings: SiteSettings): string {
  const { basePath } = stripLocalePrefix(pathname, settings);
  const prefix = getLocalePrefix(settings, targetLocale);
  if (!prefix) return basePath;
  return basePath === "/" ? prefix : `${prefix}${basePath}`;
}
