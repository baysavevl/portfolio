import NextLink from "next/link";
import enMessages from "../../../messages/en.json";
import viMessages from "../../../messages/vi.json";
import {DemoBadge} from "@/components/content/demo-badge";
import {LocaleSwitchTarget} from "@/components/layout/locale-switch-context";
import {TranslationNotice} from "@/components/writing/translation-notice";
import {getLocalePath, type Locale} from "@/i18n/locale";
import {resolveLocaleSwitch} from "@/lib/content/translation";
import type {ProjectSummary, Topic, TopicKey} from "@/lib/content/types";

interface WorkIndexProps {
  locale: Locale;
  projects: ProjectSummary[];
  topics: Topic[];
  translationUnavailable: boolean;
  activeTopic: TopicKey | "all";
}

export function WorkIndex({
  locale,
  projects,
  topics,
  translationUnavailable,
  activeTopic
}: WorkIndexProps) {
  const messages = locale === "vi" ? viMessages : enMessages;
  const topicLabels = new Map(topics.map((topic) => [topic.key, topic.label]));
  const orderedProjects =
    translationUnavailable && activeTopic !== "all"
      ? [...projects].sort(
          (left, right) =>
            Number(right.topics.includes(activeTopic)) -
            Number(left.topics.includes(activeTopic))
        )
      : projects;

  return (
    <div className="work-page">
      <LocaleSwitchTarget
        target={resolveLocaleSwitch({currentLocale: locale, section: "work"})}
      />
      <header className="collection-intro">
        <p className="collection-intro__eyebrow">The Mindful Builder / 02</p>
        <h1>{messages.work.title}</h1>
        <p>{messages.work.description}</p>
      </header>

      {translationUnavailable ? (
        <TranslationNotice locale={locale} section="work" />
      ) : null}

      {orderedProjects.length > 0 ? (
        <section className="work-list" aria-label={messages.work.title}>
          {orderedProjects.map((project, index) => (
            <article className="work-entry" key={project.id}>
              <p className="work-entry__number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </p>
              <div className="work-entry__body">
                <div className="work-entry__label">
                  {project.isDemo ? <DemoBadge locale={locale} /> : null}
                </div>
                <h2>
                  <NextLink href={getLocalePath(locale, "work", project.slug)}>
                    {project.title}
                  </NextLink>
                </h2>
                <p>{project.summary}</p>
              </div>
              <ul className="topic-list" aria-label={project.title}>
                {project.topics.map((topic) => (
                  <li key={topic}>{topicLabels.get(topic) ?? topic}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      ) : (
        <section className="collection-empty" aria-live="polite">
          <p>{messages.work.empty}</p>
          <NextLink href={getLocalePath(locale, "writing")} className="text-link">
            {messages.work.writingLink}
          </NextLink>
        </section>
      )}
    </div>
  );
}
