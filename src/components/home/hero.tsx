import enMessages from "../../../messages/en.json";
import viMessages from "../../../messages/vi.json";
import NextLink from "next/link";
import {OperatorObserver} from "@/components/home/operator-observer";
import {getLocalePath} from "@/i18n/locale";
import type {Profile} from "@/lib/content/types";

interface HeroProps {
  profile: Profile;
}

export function Hero({profile}: HeroProps) {
  const copy = profile.locale === "vi" ? viMessages.hero : enMessages.hero;

  return (
    <section
      id="introduction"
      className="hero section-rule"
      aria-labelledby="hero-title"
    >
      <div className="editorial-grid hero__grid">
        <div className="hero__copy">
          <p className="hero__identity">
            <span>{profile.name}</span>
            <span>{profile.descriptor}</span>
          </p>
          <h1 id="hero-title">{profile.positioning}</h1>
          <p className="hero__introduction">{profile.introduction}</p>
          <div className="hero__actions">
            <NextLink href={getLocalePath(profile.locale, "writing")}>
              {copy.writingAction}
            </NextLink>
            <NextLink href={getLocalePath(profile.locale, "work")}>
              {copy.workAction}
            </NextLink>
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
