import type {Metadata} from "next";
import {hasLocale} from "next-intl";
import {notFound} from "next/navigation";
import {setRequestLocale} from "next-intl/server";
import {HomeView} from "@/components/home/home-view";
import {JsonLd} from "@/components/seo/json-ld";
import {getLocalePath, type Locale} from "@/i18n/locale";
import {routing} from "@/i18n/routing";
import {
  getContentRepository,
  getPublishedContentRepository
} from "@/lib/content";
import {buildPageMetadata, getSiteUrl} from "@/lib/seo/metadata";
import {
  buildPersonJsonLd,
  buildWebsiteJsonLd
} from "@/lib/seo/structured-data";

type HomePageProps = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({
  params
}: HomePageProps): Promise<Metadata> {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const settings = await getPublishedContentRepository().getSettings(locale);
  const targetLocale: Locale = locale === "en" ? "vi" : "en";

  return buildPageMetadata({
    title: settings.seo.title,
    description: settings.seo.description,
    locale,
    pathname: getLocalePath(locale, "home"),
    translatedPathname: getLocalePath(targetLocale, "home")
  });
}

export default async function HomePage({
  params
}: HomePageProps) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const data = await getContentRepository().getHome(locale);

  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd data={buildPersonJsonLd({profile: data.profile, siteUrl})} />
      <JsonLd
        data={buildWebsiteJsonLd({
          locale,
          siteUrl,
          description: data.settings.seo.description
        })}
      />
      <HomeView data={data} />
    </>
  );
}
