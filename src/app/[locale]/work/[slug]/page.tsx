import {hasLocale} from "next-intl";
import {notFound} from "next/navigation";
import {setRequestLocale} from "next-intl/server";
import {CaseStudyView} from "@/components/work/case-study-view";
import {locales, type Locale} from "@/i18n/locale";
import {routing} from "@/i18n/routing";
import {getContentRepository} from "@/lib/content";
import {resolveLocaleSwitch} from "@/lib/content/translation";

export async function generateStaticParams() {
  const repository = getContentRepository();
  const localizedProjects = await Promise.all(
    locales.map(async (locale) => ({
      locale,
      projects: await repository.listProjects(locale)
    }))
  );

  return localizedProjects.flatMap(({locale, projects}) =>
    projects.map((project) => ({locale, slug: project.slug}))
  );
}

export default async function CaseStudyPage({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
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

  return (
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
  );
}
