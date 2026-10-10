import enMessages from "../../../messages/en.json";
import viMessages from "../../../messages/vi.json";
import {OperatorObserver} from "@/components/home/operator-observer";
import {Link} from "@/i18n/navigation";
import type {Profile} from "@/lib/content/types";

interface HeroProps {
  profile: Profile;
}

export function Hero({profile}: HeroProps) {
  const copy = profile.locale === "vi" ? viMessages.hero : enMessages.hero;

  return (
    <section className="hero section-rule" aria-labelledby="hero-title">
      <div className="editorial-grid hero__grid">
        <div className="hero__copy">
          <p className="hero__identity">
            <span>{profile.name}</span>
            <span>{profile.descriptor}</span>
          </p>
          <h1 id="hero-title">{profile.positioning}</h1>
          <p className="hero__introduction">{profile.introduction}</p>
          <div className="hero__actions">
            <Link href="/writing" locale={profile.locale}>
              {copy.writingAction}
            </Link>
            <Link href="/work" locale={profile.locale}>
              {copy.workAction}
            </Link>
          </div>
        </div>

        <div className="hero__visual">
          <OperatorObserver
            operatorLabel={copy.operator}
            observerLabel={copy.observer}
            initialMode={profile.heroInitialMode}
            operatorAlt={copy.operatorAlt}
            observerAlt={copy.observerAlt}
            splitAlt={copy.splitAlt}
            rangeLabel={copy.rangeLabel}
          />
        </div>
      </div>
    </section>
  );
}
