import type {Metadata} from "next";
import {hasLocale} from "next-intl";
import {notFound} from "next/navigation";
import {setRequestLocale} from "next-intl/server";
import enMessages from "../../../../../messages/en.json";
import viMessages from "../../../../../messages/vi.json";
import {JsonLd} from "@/components/seo/json-ld";
import {ArticleView} from "@/components/writing/article-view";
import {getLocalePath, locales, type Locale} from "@/i18n/locale";
import {routing} from "@/i18n/routing";
import {getContentRepository} from "@/lib/content";
import {resolveLocaleSwitch} from "@/lib/content/translation";
import {buildPageMetadata, getSiteUrl} from "@/lib/seo/metadata";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd
} from "@/lib/seo/structured-data";

type ArticlePageProps = {
  params: Promise<{locale: string; slug: string}>;
};

export async function generateStaticParams() {
  const repository = getContentRepository();
  const localizedPosts = await Promise.all(
    locales.map(async (locale) => ({
      locale,
      posts: await repository.listPosts(locale)
    }))
  );

  return localizedPosts.flatMap(({locale, posts}) =>
    posts.map((post) => ({locale, slug: post.slug}))
  );
}

export async function generateMetadata({
  params
}: ArticlePageProps): Promise<Metadata> {
  const {locale, slug} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const repository = getContentRepository();
  const post = await repository.getPost(locale, slug);

  if (!post) {
    notFound();
  }

  const targetLocale: Locale = locale === "en" ? "vi" : "en";
  const translatedRoute = await repository.getTranslatedRoute(
    "post",
    post.translationGroup,
    targetLocale
  );

  return buildPageMetadata({
    title: post.seo.title,
    description: post.seo.description,
    locale,
    pathname: getLocalePath(locale, "writing", post.slug),
    translatedPathname: translatedRoute?.href
  });
}

export default async function ArticlePage({
  params
}: ArticlePageProps) {
  const {locale, slug} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const repository = getContentRepository();
  const post = await repository.getPost(locale, slug);

  if (!post) {
    notFound();
  }

  const targetLocale: Locale = locale === "en" ? "vi" : "en";
  const [translatedRoute, posts, topics] = await Promise.all([
    repository.getTranslatedRoute("post", post.translationGroup, targetLocale),
    repository.listPosts(locale),
    repository.getTopics(locale)
  ]);
  const relatedPosts = posts
    .filter(
      (candidate) =>
        candidate.id !== post.id &&
        candidate.topics.some((topic) => post.topics.includes(topic))
    )
    .slice(0, 3);
  const messages = locale === "vi" ? viMessages : enMessages;
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd data={buildArticleJsonLd({post, siteUrl})} />
      <JsonLd
        data={buildBreadcrumbJsonLd({
          siteUrl,
          items: [
            {name: messages.nav.home, pathname: getLocalePath(locale, "home")},
            {
              name: messages.writing.title,
              pathname: getLocalePath(locale, "writing")
            },
            {
              name: post.title,
              pathname: getLocalePath(locale, "writing", post.slug)
            }
          ]
        })}
      />
      <ArticleView
        locale={locale}
        post={post}
        topics={topics}
        relatedPosts={relatedPosts}
        localeSwitchTarget={resolveLocaleSwitch({
          currentLocale: locale,
          section: "writing",
          topics: post.topics,
          translatedRoute
        })}
      />
    </>
  );
}
