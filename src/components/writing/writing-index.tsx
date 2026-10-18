"use client";

import {useMemo, useState} from "react";
import NextLink from "next/link";
import enMessages from "../../../messages/en.json";
import viMessages from "../../../messages/vi.json";
import {DemoBadge} from "@/components/content/demo-badge";
import {LocaleSwitchTarget} from "@/components/layout/locale-switch-context";
import {SearchControls} from "@/components/writing/search-controls";
import {TranslationNotice} from "@/components/writing/translation-notice";
import {getLocalePath, type Locale} from "@/i18n/locale";
import {filterSearchEntries} from "@/lib/content/search";
import {resolveLocaleSwitch} from "@/lib/content/translation";
import type {
  PostSummary,
  SearchEntry,
  Topic,
  TopicKey
} from "@/lib/content/types";

interface WritingIndexProps {
  locale: Locale;
  posts: PostSummary[];
  searchEntries: SearchEntry[];
  topics: Topic[];
  initialQuery: string;
  initialTopic: TopicKey | "all";
  translationUnavailable: boolean;
}

function formatDate(locale: Locale, value: string): string {
  return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC"
  }).format(new Date(value));
}

function FieldNote({
  locale,
  post,
  topics
}: {
  locale: Locale;
  post: PostSummary;
  topics: Topic[];
}) {
  const messages = locale === "vi" ? viMessages : enMessages;
  const topicLabels = new Map(topics.map((topic) => [topic.key, topic.label]));
  const readingTime =
    locale === "vi"
      ? `${post.readingMinutes} phút đọc`
      : `${post.readingMinutes} min read`;

  return (
    <article className="writing-entry">
      <div className="writing-entry__meta">
        <time dateTime={post.publishedAt}>{formatDate(locale, post.publishedAt)}</time>
        <span>{readingTime}</span>
        {post.isDemo ? <DemoBadge locale={locale} /> : null}
      </div>
      <h2>
        <NextLink href={getLocalePath(locale, "writing", post.slug)}>
          {post.title}
        </NextLink>
      </h2>
      <p>{post.summary}</p>
      <ul className="topic-list" aria-label={messages.writing.title}>
        {post.topics.map((topic) => (
          <li key={topic}>{topicLabels.get(topic) ?? topic}</li>
        ))}
      </ul>
    </article>
  );
}

export function WritingIndex({
  locale,
  posts,
  searchEntries,
  topics,
  initialQuery,
  initialTopic,
  translationUnavailable
}: WritingIndexProps) {
  const messages = locale === "vi" ? viMessages : enMessages;
  const [query, setQuery] = useState(initialQuery);
  const [topic, setTopic] = useState<TopicKey | "all">(initialTopic);
  const chronologicalPosts = useMemo(
    () =>
      [...posts].sort((left, right) =>
        right.publishedAt.localeCompare(left.publishedAt)
      ),
    [posts]
  );
  const filteredPosts = useMemo(() => {
    const matchingIds = new Set(
      filterSearchEntries(
        searchEntries.filter((entry) => entry.kind === "post"),
        query,
        topic
      ).map((entry) => entry.id)
    );

    return chronologicalPosts.filter((post) => matchingIds.has(post.id));
  }, [chronologicalPosts, query, searchEntries, topic]);
  const hasFilters = query.trim().length > 0 || topic !== "all";
  const featured = chronologicalPosts.filter((post) => post.featured);
  const remaining = chronologicalPosts.filter((post) => !post.featured);
  const activeTopic = topics.find((entry) => entry.key === topic)?.label;
  const activeFilters = [query.trim(), activeTopic].filter(Boolean).join(", ");

  return (
    <div className="writing-page">
      <LocaleSwitchTarget
        target={resolveLocaleSwitch({currentLocale: locale, section: "writing"})}
      />
      <header className="collection-intro">
        <p className="collection-intro__eyebrow">The Mindful Builder / 01</p>
        <h1>{messages.writing.title}</h1>
        <p>{messages.writing.description}</p>
      </header>

      {translationUnavailable ? <TranslationNotice locale={locale} /> : null}

      <SearchControls
        locale={locale}
        topics={topics}
        query={query}
        topic={topic}
        resultCount={filteredPosts.length}
        onQueryChange={setQuery}
        onTopicChange={setTopic}
      />

      {hasFilters ? (
        <section className="writing-results" aria-label={messages.writing.allNotes}>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <FieldNote key={post.id} locale={locale} post={post} topics={topics} />
            ))
          ) : (
            <div className="writing-empty">
              <p>{messages.search.noResults}</p>
              <p>
                {messages.search.activeFilters.replace(
                  "{filters}",
                  activeFilters || messages.search.allTopics
                )}
              </p>
            </div>
          )}
        </section>
      ) : posts.length > 0 ? (
        <>
          {featured.length > 0 ? (
            <section className="writing-section" aria-labelledby="featured-writing-title">
              <h2 id="featured-writing-title">{messages.writing.featured}</h2>
              <div className="writing-results writing-results--featured">
                {featured.map((post) => (
                  <FieldNote key={post.id} locale={locale} post={post} topics={topics} />
                ))}
              </div>
            </section>
          ) : null}
          <section className="writing-section" aria-labelledby="all-writing-title">
            <h2 id="all-writing-title">{messages.writing.allNotes}</h2>
            <div className="writing-results">
              {remaining.map((post) => (
                <FieldNote key={post.id} locale={locale} post={post} topics={topics} />
              ))}
            </div>
          </section>
        </>
      ) : (
        <p className="writing-empty">{messages.writing.empty}</p>
      )}
    </div>
  );
}
