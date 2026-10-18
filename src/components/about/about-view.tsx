import enMessages from "../../../messages/en.json";
import viMessages from "../../../messages/vi.json";
import {DemoBadge} from "@/components/content/demo-badge";
import {LocaleSwitchTarget} from "@/components/layout/locale-switch-context";
import {resolveLocaleSwitch} from "@/lib/content/translation";
import type {Profile} from "@/lib/content/types";

interface AboutViewProps {
  profile: Profile;
}

export function AboutView({profile}: AboutViewProps) {
  const messages = profile.locale === "vi" ? viMessages : enMessages;

  return (
    <div className="about-page">
      <LocaleSwitchTarget
        target={resolveLocaleSwitch({
          currentLocale: profile.locale,
          section: "about"
        })}
      />
      <header className="about-header">
        <p>{messages.about.title}</p>
        <h1>{profile.name}</h1>
        <p className="about-header__descriptor">{profile.descriptor}</p>
        <p className="about-header__introduction">{profile.introduction}</p>
      </header>

      <section className="about-section about-section--mindful">
        <div>
          <DemoBadge locale={profile.locale} />
          <h2>{messages.about.mindfulBuilding}</h2>
        </div>
        <p className="reading-measure">{messages.about.mindfulBuildingCopy}</p>
      </section>

      <section className="about-section">
        <h2>{messages.about.principles}</h2>
        <ol className="about-principles">
          {profile.principles.map((principle, index) => (
            <li key={principle.title}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>{principle.title}</h3>
              <p>{principle.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="about-section about-section--questions">
        <h2>{messages.about.questions}</h2>
        <ol>
          {profile.currentQuestions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}
