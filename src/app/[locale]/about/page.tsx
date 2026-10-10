import {hasLocale} from "next-intl";
import {notFound} from "next/navigation";
import {setRequestLocale} from "next-intl/server";
import {AboutView} from "@/components/about/about-view";
import {routing} from "@/i18n/routing";
import {getContentRepository} from "@/lib/content";

export default async function AboutPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const profile = await getContentRepository().getProfile(locale);

  return <AboutView profile={profile} />;
}
