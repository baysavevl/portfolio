"use client";

import NextLink from "next/link";
import {localeCookieName, type Locale} from "@/i18n/locale";

interface LocaleSwitcherProps {
  currentLocale: Locale;
  targetLocale: Locale;
  targetHref: string;
  missingTranslation: boolean;
}

export function LocaleSwitcher({
  currentLocale,
  targetLocale,
  targetHref,
  missingTranslation
}: LocaleSwitcherProps) {
  function rememberLocale() {
    document.cookie = `${localeCookieName}=${targetLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }

  return (
    <NextLink
      href={targetHref}
      hrefLang={targetLocale}
      lang={targetLocale}
      aria-label={targetLocale.toUpperCase()}
      data-current-locale={currentLocale}
      data-missing-translation={missingTranslation ? "true" : "false"}
      onClick={rememberLocale}
      className="locale-switcher"
    >
      {targetLocale.toUpperCase()}
    </NextLink>
  );
}
