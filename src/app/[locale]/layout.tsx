import type {ReactNode} from "react";
import {notFound} from "next/navigation";
import {isLocale, locales} from "@/i18n/locale";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function LocaleRootLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
