import {hasLocale} from "next-intl";
import {notFound} from "next/navigation";
import {setRequestLocale} from "next-intl/server";
import {HomeView} from "@/components/home/home-view";
import {routing} from "@/i18n/routing";
import {getContentRepository} from "@/lib/content";

export default async function HomePage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const data = await getContentRepository().getHome(locale);

  return <HomeView data={data} />;
}
