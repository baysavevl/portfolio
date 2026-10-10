import type {Metadata} from "next";
import {hasLocale} from "next-intl";
import {notFound} from "next/navigation";
import {setRequestLocale} from "next-intl/server";
import enMessages from "../../../../messages/en.json";
import viMessages from "../../../../messages/vi.json";
import {WorkIndex} from "@/components/work/work-index";
import {getLocalePath, type Locale} from "@/i18n/locale";
import {routing} from "@/i18n/routing";
import {getContentRepository} from "@/lib/content";
import {topicKeys, type TopicKey} from "@/lib/content/types";
import {buildPageMetadata} from "@/lib/seo/metadata";

type SearchValue = string | string[] | undefined;

function firstSearchValue(value: SearchValue): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function parseTopic(value: SearchValue): TopicKey | "all" {
  const candidate = firstSearchValue(value);
  return topicKeys.includes(candidate as TopicKey)
    ? (candidate as TopicKey)
    : "all";
}

type WorkPageProps = {
  params: Promise<{locale: string}>;
  searchParams: Promise<Record<string, SearchValue>>;
};

export async function generateMetadata({
  params
}: Pick<WorkPageProps, "params">): Promise<Metadata> {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = locale === "vi" ? viMessages : enMessages;
  const targetLocale: Locale = locale === "en" ? "vi" : "en";

  return buildPageMetadata({
    title: `${messages.work.title} — Vincent Luu`,
    description: messages.work.description,
    locale,
    pathname: getLocalePath(locale, "work"),
    translatedPathname: getLocalePath(targetLocale, "work")
  });
}

export default async function WorkPage({
  params,
  searchParams
}: WorkPageProps) {
  const [{locale}, query] = await Promise.all([params, searchParams]);

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const repository = getContentRepository();
  const [projects, topics] = await Promise.all([
    repository.listProjects(locale),
    repository.getTopics(locale)
  ]);

  return (
    <WorkIndex
      locale={locale}
      projects={projects}
      topics={topics}
      translationUnavailable={
        firstSearchValue(query.translation) === "unavailable"
      }
      activeTopic={parseTopic(query.topic)}
    />
  );
}
