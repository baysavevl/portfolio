import {hasLocale} from "next-intl";
import {notFound} from "next/navigation";
import {setRequestLocale} from "next-intl/server";
import {ArticleView} from "@/components/writing/article-view";
import {locales, type Locale} from "@/i18n/locale";
import {routing} from "@/i18n/routing";
import {getContentRepository} from "@/lib/content";
import {resolveLocaleSwitch} from "@/lib/content/translation";

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

export default async function ArticlePage({
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

  return (
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
  );
}
