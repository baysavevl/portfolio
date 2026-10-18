import NextLink from "next/link";
import {getLocalePath, type Locale} from "@/i18n/locale";
import type {ProjectSummary, Topic} from "@/lib/content/types";

interface SelectedWorkProps {
  locale: Locale;
  heading: string;
  viewLabelTemplate: string;
  projects: ProjectSummary[];
  topics: Topic[];
}

export function SelectedWork({
  locale,
  heading,
  viewLabelTemplate,
  projects,
  topics
}: SelectedWorkProps) {
  const labels = new Map(topics.map((topic) => [topic.key, topic.label]));

  return (
    <section
      id="selected-work"
      className="home-section home-section--work section-rule"
      aria-labelledby="selected-work-title"
    >
      <div className="home-section__heading">
        <h2 id="selected-work-title">{heading}</h2>
      </div>
      <div className="selected-work__list">
        {projects.map((project, index) => (
          <article className="selected-work__row" key={project.id}>
            <p className="selected-work__number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </p>
            <div className="selected-work__body">
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
            </div>
            <div className="selected-work__aside">
              <ul className="topic-list" aria-label={project.title}>
                {project.topics.map((topic) => (
                  <li key={topic}>{labels.get(topic) ?? topic}</li>
                ))}
              </ul>
              <NextLink
                href={getLocalePath(locale, "work", project.slug)}
                className="text-link"
              >
                {viewLabelTemplate.replace("{title}", project.title)}
              </NextLink>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
