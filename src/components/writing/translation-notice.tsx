import NextLink from "next/link";
import enMessages from "../../../messages/en.json";
import viMessages from "../../../messages/vi.json";
import {getLocalePath, type Locale} from "@/i18n/locale";

interface TranslationNoticeProps {
  locale: Locale;
}

export function TranslationNotice({locale}: TranslationNoticeProps) {
  const messages = locale === "vi" ? viMessages : enMessages;

  return (
    <aside className="translation-notice" aria-live="polite">
      <p>{messages.translation.unavailable}</p>
      <NextLink href={getLocalePath(locale, "writing")}>
        {messages.translation.backToCollection}
      </NextLink>
    </aside>
  );
}
