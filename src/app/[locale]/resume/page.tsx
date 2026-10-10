import {hasLocale} from "next-intl";
import {notFound} from "next/navigation";
import {setRequestLocale} from "next-intl/server";
import {ResumeView} from "@/components/resume/resume-view";
import {routing} from "@/i18n/routing";
import {getContentRepository} from "@/lib/content";

export default async function ResumePage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const resume = await getContentRepository().getResume(locale);

  return <ResumeView resume={resume} />;
}
