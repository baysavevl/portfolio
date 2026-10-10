import type {Metadata} from "next";
import {hasLocale} from "next-intl";
import {notFound} from "next/navigation";
import {setRequestLocale} from "next-intl/server";
import enMessages from "../../../../messages/en.json";
import viMessages from "../../../../messages/vi.json";
import {ResumeView} from "@/components/resume/resume-view";
import {getLocalePath, type Locale} from "@/i18n/locale";
import {routing} from "@/i18n/routing";
import {getContentRepository} from "@/lib/content";
import {buildPageMetadata} from "@/lib/seo/metadata";

type ResumePageProps = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({
  params
}: ResumePageProps): Promise<Metadata> {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const resume = await getContentRepository().getResume(locale);
  const messages = locale === "vi" ? viMessages : enMessages;
  const targetLocale: Locale = locale === "en" ? "vi" : "en";

  return buildPageMetadata({
    title: `${messages.resume.title} — Vincent Luu`,
    description: resume.summary,
    locale,
    pathname: getLocalePath(locale, "resume"),
    translatedPathname: getLocalePath(targetLocale, "resume")
  });
}

export default async function ResumePage({
  params
}: ResumePageProps) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const resume = await getContentRepository().getResume(locale);

  return <ResumeView resume={resume} />;
}
