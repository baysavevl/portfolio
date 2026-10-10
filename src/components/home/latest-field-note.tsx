import NextLink from "next/link";
import {DemoBadge} from "@/components/content/demo-badge";
import {getLocalePath, type Locale} from "@/i18n/locale";
import type {PostSummary, Topic} from "@/lib/content/types";

interface LatestFieldNoteProps {
  locale: Locale;
  heading: string;
  emptyMessage: string;
  readLabelTemplate: string;
  post: PostSummary | null;
  topics: Topic[];
}

export function LatestFieldNote({
  locale,
  heading,
  emptyMessage,
  readLabelTemplate,
  post,
  topics
}: LatestFieldNoteProps) {
  const labels = new Map(topics.map((topic) => [topic.key, topic.label]));

  return (
    <section
      id="latest-field-note"
      className="home-section home-section--field-note section-rule"
      aria-labelledby="latest-field-note-title"
    >
      <div className="home-section__heading">
        <h2 id="latest-field-note-title">{heading}</h2>
      </div>

      {post ? (
        <article className="field-note-feature">
          <div className="field-note-feature__meta">
            {post.isDemo ? <DemoBadge locale={locale} /> : null}
            <span>
              {locale === "vi"
                ? `${post.readingMinutes} phút đọc`
                : `${post.readingMinutes} min read`}
            </span>
          </div>
          <h3>{post.title}</h3>
          <p>{post.summary}</p>
          <ul className="topic-list" aria-label={heading}>
            {post.topics.map((topic) => (
              <li key={topic}>{labels.get(topic) ?? topic}</li>
            ))}
          </ul>
          <NextLink
            href={getLocalePath(locale, "writing", post.slug)}
            className="text-link"
          >
            {readLabelTemplate.replace("{title}", post.title)}
          </NextLink>
        </article>
      ) : (
        <p className="home-empty-state">{emptyMessage}</p>
      )}
    </section>
  );
}
