"use client";

import NextLink from "next/link";
import {useLocaleSwitchTarget} from "@/components/layout/locale-switch-context";
import {localeCookieName, type Locale} from "@/i18n/locale";

interface LocaleSwitcherProps {
  currentLocale?: Locale;
  targetLocale?: Locale;
  targetHref?: string;
  missingTranslation?: boolean;
}

export function LocaleSwitcher({
  currentLocale,
  targetLocale,
  targetHref,
  missingTranslation
}: LocaleSwitcherProps = {}) {
  const contextTarget = useLocaleSwitchTarget();
  const resolvedTarget =
    currentLocale && targetLocale && targetHref
      ? {
          currentLocale,
          targetLocale,
          targetHref,
          missingTranslation: missingTranslation ?? false
        }
      : contextTarget;

  if (!resolvedTarget) {
    throw new Error(
      "LocaleSwitcher requires explicit target props or LocaleSwitchProvider"
    );
  }

  const {
    currentLocale: resolvedCurrentLocale,
    targetLocale: resolvedTargetLocale,
    targetHref: resolvedTargetHref,
    missingTranslation: resolvedMissingTranslation
  } = resolvedTarget;

  function rememberLocale() {
    document.cookie = `${localeCookieName}=${resolvedTargetLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }

  return (
    <NextLink
      href={resolvedTargetHref}
      hrefLang={resolvedTargetLocale}
      lang={resolvedTargetLocale}
      aria-label={resolvedTargetLocale.toUpperCase()}
      data-current-locale={resolvedCurrentLocale}
      data-missing-translation={
        resolvedMissingTranslation ? "true" : "false"
      }
      onClick={rememberLocale}
      className="locale-switcher"
    >
      {resolvedTargetLocale.toUpperCase()}
    </NextLink>
  );
}
