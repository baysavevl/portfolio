import NextLink from "next/link";
import enMessages from "../../../messages/en.json";
import viMessages from "../../../messages/vi.json";
import {DemoBadge} from "@/components/content/demo-badge";
import {LocaleSwitchTarget} from "@/components/layout/locale-switch-context";
import {getLocalePath, type Locale} from "@/i18n/locale";
import type {LocaleSwitchTarget as LocaleSwitchTargetValue} from "@/lib/content/translation";
import type {Project, Topic} from "@/lib/content/types";

interface CaseStudyViewProps {
  locale: Locale;
  project: Project;
  topics: Topic[];
  localeSwitchTarget: LocaleSwitchTargetValue;
}

export function CaseStudyView({
  locale,
  project,
  topics,
  localeSwitchTarget
}: CaseStudyViewProps) {
  const messages = locale === "vi" ? viMessages : enMessages;
  const topicLabels = new Map(topics.map((topic) => [topic.key, topic.label]));
  const sections = [
    {key: "context", label: messages.work.context, content: project.context},
    {key: "role", label: messages.work.role, content: project.role},
    {key: "outcome", label: messages.work.outcome, content: project.outcome},
    {
      key: "reflection",
      label: messages.work.reflection,
      content: project.reflection
    }
  ];

  return (
    <article className="case-study-page">
      <LocaleSwitchTarget target={localeSwitchTarget} />
      <header className="case-study-header">
        <NextLink href={getLocalePath(locale, "work")} className="text-link">
          ← {messages.work.back}
        </NextLink>
        <div className="case-study-header__meta">
          {project.isDemo ? <DemoBadge locale={locale} /> : null}
          <ul className="topic-list" aria-label={messages.work.title}>
            {project.topics.map((topic) => (
              <li key={topic}>{topicLabels.get(topic) ?? topic}</li>
            ))}
          </ul>
        </div>
        <h1>{project.title}</h1>
        <p>{project.summary}</p>
      </header>

      <div className="case-study-sections">
        {sections.slice(0, 2).map((section, index) => (
          <section key={section.key} className="case-study-section">
            <p aria-hidden="true">{String(index + 1).padStart(2, "0")}</p>
            <h2>{section.label}</h2>
            <div className="reading-measure">{section.content}</div>
          </section>
        ))}

        <section className="case-study-section">
          <p aria-hidden="true">03</p>
          <h2>{messages.work.decisions}</h2>
          <ol className="case-study-decisions reading-measure">
            {project.decisions.map((decision) => (
              <li key={decision}>{decision}</li>
            ))}
          </ol>
        </section>

        {sections.slice(2).map((section, index) => (
          <section key={section.key} className="case-study-section">
            <p aria-hidden="true">{String(index + 4).padStart(2, "0")}</p>
            <h2>{section.label}</h2>
            <div className="reading-measure">{section.content}</div>
          </section>
        ))}
      </div>

      <footer className="article-footer">
        <NextLink href={getLocalePath(locale, "work")} className="text-link">
          ← {messages.work.back}
        </NextLink>
      </footer>
    </article>
  );
}
