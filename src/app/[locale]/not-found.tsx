"use client";

import {usePathname} from "next/navigation";
import enMessages from "../../../messages/en.json";
import viMessages from "../../../messages/vi.json";
import {ErrorPanel} from "@/components/layout/error-panel";
import {getLocalePath, type Locale} from "@/i18n/locale";

export default function NotFound() {
  const pathname = usePathname();
  const locale: Locale = pathname?.split("/")[1] === "vi" ? "vi" : "en";
  const copy = locale === "vi" ? viMessages.errors : enMessages.errors;

  return (
    <ErrorPanel
      title={copy.notFoundTitle}
      description={copy.notFoundDescription}
      actionLabel={copy.home}
      actionHref={getLocalePath(locale, "home")}
      links={[
        {href: getLocalePath(locale, "writing"), label: copy.writing},
        {href: getLocalePath(locale, "work"), label: copy.work}
      ]}
    />
  );
}
