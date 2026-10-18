import {getLocalePath, type Locale, type PublicSection} from "@/i18n/locale";
import type {TopicKey, TranslatedRoute} from "@/lib/content/types";

export interface LocaleSwitchTarget {
  currentLocale: Locale;
  targetLocale: Locale;
  targetHref: string;
  missingTranslation: boolean;
}

type StableLocaleSwitchInput = {
  currentLocale: Locale;
  section: PublicSection;
};

type ContentLocaleSwitchInput = {
  currentLocale: Locale;
  section: "writing" | "work";
  topics: TopicKey[];
  translatedRoute: TranslatedRoute | null;
};

export type ResolveLocaleSwitchInput =
  | StableLocaleSwitchInput
  | ContentLocaleSwitchInput;

export function resolveLocaleSwitch(
  input: ResolveLocaleSwitchInput
): LocaleSwitchTarget {
  const targetLocale: Locale = input.currentLocale === "en" ? "vi" : "en";

  if ("translatedRoute" in input && input.translatedRoute) {
    return {
      currentLocale: input.currentLocale,
      targetLocale,
      targetHref: input.translatedRoute.href,
      missingTranslation: false
    };
  }

  if ("topics" in input) {
    const params = new URLSearchParams({translation: "unavailable"});
    const [firstTopic] = input.topics;

    if (firstTopic) {
      params.set("topic", firstTopic);
    }

    return {
      currentLocale: input.currentLocale,
      targetLocale,
      targetHref: `${getLocalePath(targetLocale, input.section)}?${params.toString()}`,
      missingTranslation: true
    };
  }

  return {
    currentLocale: input.currentLocale,
    targetLocale,
    targetHref: getLocalePath(targetLocale, input.section),
    missingTranslation: false
  };
}
