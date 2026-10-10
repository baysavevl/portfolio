import NextLink from "next/link";
import enMessages from "../../../messages/en.json";
import viMessages from "../../../messages/vi.json";
import {
  getLocalePath,
  type Locale,
  type PublicSection
} from "@/i18n/locale";

interface TranslationNoticeProps {
  locale: Locale;
  section?: Extract<PublicSection, "writing" | "work">;
}

export function TranslationNotice({
  locale,
  section = "writing"
}: TranslationNoticeProps) {
  const messages = locale === "vi" ? viMessages : enMessages;

  return (
    <aside className="translation-notice" aria-live="polite">
      <p>{messages.translation.unavailable}</p>
      <NextLink href={getLocalePath(locale, section)}>
        {messages.translation.backToCollection}
      </NextLink>
    </aside>
  );
}
