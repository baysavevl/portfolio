import {hasLocale} from "next-intl";
import {notFound} from "next/navigation";
import {setRequestLocale} from "next-intl/server";
import {WritingIndex} from "@/components/writing/writing-index";
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

export default async function WritingPage({
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
  const [posts, searchEntries, topics] = await Promise.all([
    repository.listPosts(locale),
    repository.listSearchEntries(locale),
    repository.getTopics(locale)
  ]);

  return (
    <WritingIndex
      locale={locale}
      posts={posts}
      searchEntries={searchEntries}
      topics={topics}
      initialQuery={firstSearchValue(query.q)}
      initialTopic={parseTopic(query.topic)}
      translationUnavailable={
        firstSearchValue(query.translation) === "unavailable"
      }
    />
  );
}
