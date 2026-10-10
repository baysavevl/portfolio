import {hasLocale} from "next-intl";
import {notFound} from "next/navigation";
import {setRequestLocale} from "next-intl/server";
import {WorkIndex} from "@/components/work/work-index";
import {routing} from "@/i18n/routing";
import {getContentRepository} from "@/lib/content";
import {topicKeys, type TopicKey} from "@/lib/content/types";

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

export default async function WorkPage({
  params,
  searchParams
}: {
  params: Promise<{locale: string}>;
  searchParams: Promise<Record<string, SearchValue>>;
}) {
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
