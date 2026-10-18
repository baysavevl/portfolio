"use client";

import {useRouter} from "next/navigation";
import enMessages from "../../../messages/en.json";
import viMessages from "../../../messages/vi.json";
import {getLocalePath, type Locale} from "@/i18n/locale";
import type {Topic, TopicKey} from "@/lib/content/types";

interface SearchControlsProps {
  locale: Locale;
  topics: Topic[];
  query: string;
  topic: TopicKey | "all";
  resultCount: number;
  onQueryChange: (query: string) => void;
  onTopicChange: (topic: TopicKey | "all") => void;
}

export function SearchControls({
  locale,
  topics,
  query,
  topic,
  resultCount,
  onQueryChange,
  onTopicChange
}: SearchControlsProps) {
  const router = useRouter();
  const messages = locale === "vi" ? viMessages : enMessages;
  const hasFilters = query.trim().length > 0 || topic !== "all";

  function updateUrl(nextQuery: string, nextTopic: TopicKey | "all") {
    const params = new URLSearchParams();

    if (nextQuery.trim()) {
      params.set("q", nextQuery.trim());
    }

    if (nextTopic !== "all") {
      params.set("topic", nextTopic);
    }

    const search = params.toString();
    const path = getLocalePath(locale, "writing");
    router.replace(search ? `${path}?${search}` : path, {scroll: false});
  }

  function setQuery(nextQuery: string) {
    onQueryChange(nextQuery);
    updateUrl(nextQuery, topic);
  }

  function setTopic(nextTopic: TopicKey | "all") {
    onTopicChange(nextTopic);
    updateUrl(query, nextTopic);
  }

  function reset() {
    onQueryChange("");
    onTopicChange("all");
    updateUrl("", "all");
  }

  const resultLabel =
    locale === "vi"
      ? `${resultCount} kết quả`
      : `${resultCount} ${resultCount === 1 ? "result" : "results"}`;

  return (
    <div className="search-controls">
      <div className="search-controls__input">
        <label htmlFor="writing-search">{messages.search.label}</label>
        <input
          id="writing-search"
          type="search"
          value={query}
          placeholder={messages.search.placeholder}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
      </div>

      <div className="search-controls__topics" aria-label={messages.search.allTopics}>
        <button
          type="button"
          aria-pressed={topic === "all"}
          onClick={() => setTopic("all")}
        >
          {messages.search.allTopics}
        </button>
        {topics.map((entry) => (
          <button
            key={entry.key}
            type="button"
            aria-pressed={topic === entry.key}
            onClick={() => setTopic(entry.key)}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className="search-controls__status">
        <p aria-live="polite">{resultLabel}</p>
        {hasFilters ? (
          <button type="button" onClick={reset}>
            {messages.search.reset}
          </button>
        ) : null}
      </div>
    </div>
  );
}
