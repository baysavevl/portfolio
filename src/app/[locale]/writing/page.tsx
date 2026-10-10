import type {Metadata} from "next";
import {hasLocale} from "next-intl";
import {notFound} from "next/navigation";
import {setRequestLocale} from "next-intl/server";
import enMessages from "../../../../messages/en.json";
import viMessages from "../../../../messages/vi.json";
import {WritingIndex} from "@/components/writing/writing-index";
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

type WritingPageProps = {
  params: Promise<{locale: string}>;
  searchParams: Promise<Record<string, SearchValue>>;
};

export async function generateMetadata({
  params
}: Pick<WritingPageProps, "params">): Promise<Metadata> {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = locale === "vi" ? viMessages : enMessages;
  const targetLocale: Locale = locale === "en" ? "vi" : "en";

  return buildPageMetadata({
    title: `${messages.writing.title} — Vincent Luu`,
    description: messages.writing.description,
    locale,
    pathname: getLocalePath(locale, "writing"),
    translatedPathname: getLocalePath(targetLocale, "writing")
  });
}

export default async function WritingPage({
  params,
  searchParams
}: WritingPageProps) {
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
