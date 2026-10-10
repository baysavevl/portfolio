import type {Metadata} from "next";
import {hasLocale} from "next-intl";
import {notFound} from "next/navigation";
import {setRequestLocale} from "next-intl/server";
import enMessages from "../../../../messages/en.json";
import viMessages from "../../../../messages/vi.json";
import {AboutView} from "@/components/about/about-view";
import {getLocalePath, type Locale} from "@/i18n/locale";
import {routing} from "@/i18n/routing";
import {
  getContentRepository,
  getPublishedContentRepository
} from "@/lib/content";
import {buildPageMetadata} from "@/lib/seo/metadata";

type AboutPageProps = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({
  params
}: AboutPageProps): Promise<Metadata> {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const profile = await getPublishedContentRepository().getProfile(locale);
  const messages = locale === "vi" ? viMessages : enMessages;
  const targetLocale: Locale = locale === "en" ? "vi" : "en";

  return buildPageMetadata({
    title: `${messages.about.title} — Vincent Luu`,
    description: profile.introduction,
    locale,
    pathname: getLocalePath(locale, "about"),
    translatedPathname: getLocalePath(targetLocale, "about")
  });
}

export default async function AboutPage({
  params
}: AboutPageProps) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const profile = await getContentRepository().getProfile(locale);

  return <AboutView profile={profile} />;
}
