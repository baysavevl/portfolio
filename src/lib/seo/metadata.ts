import type {Metadata} from "next";
import type {Locale} from "@/i18n/locale";

export const developmentSiteUrl = "http://localhost:3000";

export function getSiteUrl(explicitUrl?: string): string {
  const candidate =
    explicitUrl || process.env.NEXT_PUBLIC_SITE_URL || developmentSiteUrl;

  try {
    const url = new URL(candidate);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return developmentSiteUrl;
    }

    return url.toString().replace(/\/$/, "");
  } catch {
    return developmentSiteUrl;
  }
}

export function absoluteUrl(pathname: string, baseUrl = getSiteUrl()): string {
  return new URL(pathname, `${getSiteUrl(baseUrl)}/`).toString();
}

interface BuildAlternatesInput {
  locale: Locale;
  pathname: string;
  translatedPathname?: string | null;
  baseUrl?: string;
}

export function buildAlternates({
  locale,
  pathname,
  translatedPathname,
  baseUrl = getSiteUrl()
}: BuildAlternatesInput): NonNullable<Metadata["alternates"]> {
  const canonical = absoluteUrl(pathname, baseUrl);
  const languages: Record<string, string> = {[locale]: canonical};

  if (translatedPathname) {
    const targetLocale: Locale = locale === "en" ? "vi" : "en";
    languages[targetLocale] = absoluteUrl(translatedPathname, baseUrl);
  }

  return {canonical, languages};
}

interface BuildPageMetadataInput extends BuildAlternatesInput {
  title: string;
  description: string;
}

export function buildPageMetadata({
  title,
  description,
  locale,
  pathname,
  translatedPathname,
  baseUrl = getSiteUrl()
}: BuildPageMetadataInput): Metadata {
  const canonical = absoluteUrl(pathname, baseUrl);
  const socialImage = absoluteUrl(`/${locale}/opengraph-image`, baseUrl);
  const openGraphLocale = locale === "vi" ? "vi_VN" : "en_US";

  return {
    title,
    description,
    alternates: buildAlternates({
      locale,
      pathname,
      translatedPathname,
      baseUrl
    }),
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      siteName: "Vincent Luu — The Mindful Builder",
      locale: openGraphLocale,
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: `Vincent Luu — The Mindful Builder (${locale.toUpperCase()})`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage]
    }
  };
}
