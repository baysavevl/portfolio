import enMessages from "../../../messages/en.json";
import viMessages from "../../../messages/vi.json";
import {LocaleSwitchTarget} from "@/components/layout/locale-switch-context";
import {resolveLocaleSwitch} from "@/lib/content/translation";
import type {Resume} from "@/lib/content/types";

interface ResumeViewProps {
  resume: Resume;
}

function formatDate(locale: Resume["locale"], value: string): string {
  return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${value}T00:00:00.000Z`));
}

export function ResumeView({resume}: ResumeViewProps) {
  const messages = resume.locale === "vi" ? viMessages : enMessages;

  return (
    <div className="resume-page">
      <LocaleSwitchTarget
        target={resolveLocaleSwitch({
          currentLocale: resume.locale,
          section: "resume"
        })}
      />
      <header className="resume-header">
        <p className="collection-intro__eyebrow">Vincent Luu / CV</p>
        <h1>{messages.resume.title}</h1>
        {resume.pdfUrl && resume.pdfLabel ? (
          <a href={resume.pdfUrl} className="resume-download">
            {messages.resume.download.replace("{label}", resume.pdfLabel)}
          </a>
        ) : null}
        {resume.effectiveDate ? (
          <p className="resume-effective-date">
            {messages.resume.effectiveDate.replace(
              "{date}",
              formatDate(resume.locale, resume.effectiveDate)
            )}
          </p>
        ) : null}
      </header>

      <section className="resume-section resume-section--summary">
        <h2>{messages.resume.summary}</h2>
        <p className="reading-measure">{resume.summary}</p>
      </section>

      {resume.experience.length > 0 ? (
        <section className="resume-section">
          <h2>{messages.resume.experience}</h2>
          <ol className="resume-timeline">
            {resume.experience.map((experience) => (
              <li key={experience.id}>
                <p>{experience.dateRange}</p>
                <div>
                  <h3>{experience.role}</h3>
                  <p className="resume-timeline__organization">
                    {experience.organization}
                    {experience.location ? ` · ${experience.location}` : ""}
                  </p>
                  <p>{experience.description}</p>
                  {experience.achievements.length > 0 ? (
                    <ul>
                      {experience.achievements.map((achievement) => (
                        <li key={achievement}>{achievement}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {resume.education.length > 0 ? (
        <section className="resume-section">
          <h2>{messages.resume.education}</h2>
          <ol className="resume-timeline">
            {resume.education.map((education) => (
              <li key={education.id}>
                <p>{education.dateRange}</p>
                <div>
                  <h3>{education.program}</h3>
                  <p className="resume-timeline__organization">
                    {education.institution}
                  </p>
                  {education.notes ? <p>{education.notes}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {resume.capabilities.length > 0 ? (
        <section className="resume-section">
          <h2>{messages.resume.capabilities}</h2>
          <ul className="resume-capabilities">
            {resume.capabilities.map((capability) => (
              <li key={capability}>{capability}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
