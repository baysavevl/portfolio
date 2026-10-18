import type {Metadata} from "next";
import {hasLocale} from "next-intl";
import {notFound} from "next/navigation";
import {setRequestLocale} from "next-intl/server";
import enMessages from "../../../../../messages/en.json";
import viMessages from "../../../../../messages/vi.json";
import {JsonLd} from "@/components/seo/json-ld";
import {CaseStudyView} from "@/components/work/case-study-view";
import {getLocalePath, type Locale} from "@/i18n/locale";
import {routing} from "@/i18n/routing";
import {
  getContentRepository,
  getPublishedContentRepository
} from "@/lib/content";
import {resolveLocaleSwitch} from "@/lib/content/translation";
import {buildPageMetadata, getSiteUrl} from "@/lib/seo/metadata";
import {
  buildBreadcrumbJsonLd,
  buildCreativeWorkJsonLd
} from "@/lib/seo/structured-data";

type CaseStudyPageProps = {
  params: Promise<{locale: string; slug: string}>;
};

export async function generateMetadata({
  params
}: CaseStudyPageProps): Promise<Metadata> {
  const {locale, slug} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const repository = getPublishedContentRepository();
  const project = await repository.getProject(locale, slug);

  if (!project) {
    const messages = locale === "vi" ? viMessages : enMessages;

    return buildPageMetadata({
      title: `${messages.work.title} — Vincent Luu`,
      description: messages.work.description,
      locale,
      pathname: getLocalePath(locale, "work", slug)
    });
  }

  const targetLocale: Locale = locale === "en" ? "vi" : "en";
  const translatedRoute = await repository.getTranslatedRoute(
    "project",
    project.translationGroup,
    targetLocale
  );

  return buildPageMetadata({
    title: project.seo.title,
    description: project.seo.description,
    locale,
    pathname: getLocalePath(locale, "work", project.slug),
    translatedPathname: translatedRoute?.href
  });
}

export default async function CaseStudyPage({
  params
}: CaseStudyPageProps) {
  const {locale, slug} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const repository = getContentRepository();
  const project = await repository.getProject(locale, slug);

  if (!project) {
    notFound();
  }

  const targetLocale: Locale = locale === "en" ? "vi" : "en";
  const [translatedRoute, topics] = await Promise.all([
    repository.getTranslatedRoute(
      "project",
      project.translationGroup,
      targetLocale
    ),
    repository.getTopics(locale)
  ]);
  const messages = locale === "vi" ? viMessages : enMessages;
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd data={buildCreativeWorkJsonLd({project, siteUrl})} />
      <JsonLd
        data={buildBreadcrumbJsonLd({
          siteUrl,
          items: [
            {name: messages.nav.home, pathname: getLocalePath(locale, "home")},
            {
              name: messages.work.title,
              pathname: getLocalePath(locale, "work")
            },
            {
              name: project.title,
              pathname: getLocalePath(locale, "work", project.slug)
            }
          ]
        })}
      />
      <CaseStudyView
        locale={locale}
        project={project}
        topics={topics}
        localeSwitchTarget={resolveLocaleSwitch({
          currentLocale: locale,
          section: "work",
          topics: project.topics,
          translatedRoute
        })}
      />
    </>
  );
}
