"use client";

import {usePathname} from "next/navigation";
import enMessages from "../../../messages/en.json";
import viMessages from "../../../messages/vi.json";
import {ErrorPanel} from "@/components/layout/error-panel";
import {getLocalePath, type Locale} from "@/i18n/locale";

export default function ErrorBoundary({
  error,
  retry
}: {
  error: Error & {digest?: string};
  retry: () => void;
}) {
  void error;

  const pathname = usePathname();
  const locale: Locale = pathname?.split("/")[1] === "vi" ? "vi" : "en";
  const copy = locale === "vi" ? viMessages.errors : enMessages.errors;

  return (
    <ErrorPanel
      title={copy.runtimeTitle}
      description={copy.runtimeDescription}
      actionLabel={copy.tryAgain}
      onAction={retry}
      links={[{href: getLocalePath(locale, "home"), label: copy.home}]}
    />
  );
}
