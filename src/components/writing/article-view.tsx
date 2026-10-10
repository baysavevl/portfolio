import NextLink from "next/link";
import enMessages from "../../../messages/en.json";
import viMessages from "../../../messages/vi.json";
import {DemoBadge} from "@/components/content/demo-badge";
import {LocaleSwitchTarget} from "@/components/layout/locale-switch-context";
import {ArticleBody} from "@/components/writing/article-body";
import {TableOfContents} from "@/components/writing/table-of-contents";
import {getLocalePath, type Locale} from "@/i18n/locale";
import type {LocaleSwitchTarget as LocaleSwitchTargetValue} from "@/lib/content/translation";
import type {Post, PostSummary, Topic} from "@/lib/content/types";

interface ArticleViewProps {
  locale: Locale;
  post: Post;
  topics: Topic[];
  relatedPosts: PostSummary[];
  localeSwitchTarget: LocaleSwitchTargetValue;
}

function formatDate(locale: Locale, value: string): string {
  return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC"
  }).format(new Date(value));
}

export function ArticleView({
  locale,
  post,
  topics,
  relatedPosts,
  localeSwitchTarget
}: ArticleViewProps) {
  const messages = locale === "vi" ? viMessages : enMessages;
  const topicLabels = new Map(topics.map((topic) => [topic.key, topic.label]));
  const readingTime =
    locale === "vi"
      ? `${post.readingMinutes} phút đọc`
      : `${post.readingMinutes} min read`;

  return (
    <article className="article-page">
      <LocaleSwitchTarget target={localeSwitchTarget} />

      <header className="article-header">
        <NextLink
          href={getLocalePath(locale, "writing")}
          className="article-header__back text-link"
        >
          ← {messages.writing.back}
        </NextLink>
        <div className="article-header__meta">
          <time dateTime={post.publishedAt}>
            {messages.writing.publishedOn.replace(
              "{date}",
              formatDate(locale, post.publishedAt)
            )}
          </time>
          <span>{readingTime}</span>
          {post.isDemo ? <DemoBadge locale={locale} /> : null}
        </div>
        <h1>{post.title}</h1>
        <p className="article-header__summary">{post.summary}</p>
        <ul className="topic-list" aria-label={messages.writing.title}>
          {post.topics.map((topic) => (
            <li key={topic}>{topicLabels.get(topic) ?? topic}</li>
          ))}
        </ul>
      </header>

      <div className="article-layout">
        <TableOfContents
          blocks={post.body}
          label={messages.writing.tableOfContents}
        />
        <ArticleBody blocks={post.body} />
      </div>

      {relatedPosts.length > 0 ? (
        <aside className="related-writing" aria-labelledby="related-writing-title">
          <h2 id="related-writing-title">{messages.writing.related}</h2>
          <ol>
            {relatedPosts.map((related) => (
              <li key={related.id}>
                <NextLink
                  href={getLocalePath(locale, "writing", related.slug)}
                >
                  {related.title}
                </NextLink>
                <p>{related.summary}</p>
              </li>
            ))}
          </ol>
        </aside>
      ) : null}

      <footer className="article-footer">
        <NextLink href={getLocalePath(locale, "writing")} className="text-link">
          ← {messages.writing.back}
        </NextLink>
      </footer>
    </article>
  );
}
