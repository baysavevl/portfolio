import type {Locale} from "@/i18n/locale";

export type SanityContentType =
  | "education"
  | "experience"
  | "post"
  | "profile"
  | "project"
  | "resumeAsset"
  | "siteSettings"
  | "topic";

export function localizedTags(
  type: SanityContentType,
  locale: Locale
): string[] {
  return [type, `${type}:${locale}`];
}

export function translatedContentTags(
  type: "post" | "project",
  locale: Locale
): string[] {
  return [...localizedTags(type, locale), "translation"];
}

export function resumeTags(locale: Locale): string[] {
  return [
    ...localizedTags("resumeAsset", locale),
    ...localizedTags("experience", locale),
    ...localizedTags("education", locale)
  ];
}

export function homeTags(locale: Locale): string[] {
  return [
    ...localizedTags("siteSettings", locale),
    ...localizedTags("profile", locale),
    ...localizedTags("topic", locale),
    ...translatedContentTags("post", locale),
    ...translatedContentTags("project", locale),
    ...resumeTags(locale)
  ].filter((tag, index, tags) => tags.indexOf(tag) === index);
}

export function searchTags(locale: Locale): string[] {
  return [
    ...localizedTags("post", locale),
    ...localizedTags("project", locale),
    ...localizedTags("topic", locale)
  ];
}
