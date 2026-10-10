import NextLink from "next/link";
import {getLocalePath, type Locale} from "@/i18n/locale";
import type {Resume} from "@/lib/content/types";

interface CareerPreviewProps {
  locale: Locale;
  heading: string;
  resumeLabel: string;
  resume: Resume;
}

export function CareerPreview({
  locale,
  heading,
  resumeLabel,
  resume
}: CareerPreviewProps) {
  return (
    <section
      id="professional-journey"
      className="home-section home-section--career section-rule"
      aria-labelledby="professional-journey-title"
    >
      <div className="home-section__heading">
        <h2 id="professional-journey-title">{heading}</h2>
      </div>
      <div className="career-preview__body">
        {resume.experience.length === 0 ? (
          <p className="home-empty-state">{resume.summary}</p>
        ) : (
          <ol className="career-preview__list">
            {resume.experience.slice(0, 3).map((experience) => (
              <li key={experience.id}>
                <h3>{experience.role}</h3>
                <p>{experience.organization}</p>
                <p>{experience.dateRange}</p>
              </li>
            ))}
          </ol>
        )}
        <NextLink
          href={getLocalePath(locale, "resume")}
          className="text-link"
        >
          {resumeLabel}
        </NextLink>
      </div>
    </section>
  );
}
