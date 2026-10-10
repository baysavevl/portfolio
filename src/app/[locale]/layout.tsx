import type {ReactNode} from "react";
import {hasLocale, NextIntlClientProvider} from "next-intl";
import {notFound} from "next/navigation";
import {getMessages, getTranslations, setRequestLocale} from "next-intl/server";
import {SiteFooter} from "@/components/layout/site-footer";
import {SiteHeader} from "@/components/layout/site-header";
import {SkipLink} from "@/components/layout/skip-link";
import {getLocalePath, locales, type Locale} from "@/i18n/locale";
import {routing} from "@/i18n/routing";
import {getContentRepository} from "@/lib/content";
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

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const targetLocale: Locale = locale === "en" ? "vi" : "en";
  const [messages, settings, accessibility] = await Promise.all([
    getMessages({locale}),
    getContentRepository().getSettings(locale),
    getTranslations({locale, namespace: "accessibility"})
  ]);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SkipLink label={accessibility("skipToContent")} />
          <SiteHeader
            currentLocale={locale}
            targetLocale={targetLocale}
            targetHref={getLocalePath(targetLocale, "home")}
          />
          <main id="main-content">{children}</main>
          <SiteFooter locale={locale} settings={settings} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
