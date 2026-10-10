import enMessages from "../../../../messages/en.json";
import viMessages from "../../../../messages/vi.json";
import {isLocale, locales} from "@/i18n/locale";
import {getPublishedContentRepository} from "@/lib/content";
import {getSiteUrl} from "@/lib/seo/metadata";
import {buildRssXml} from "@/lib/seo/rss";

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function GET(
  _request: Request,
  {params}: {params: Promise<{locale: string}>}
) {
  const {locale} = await params;

  if (!isLocale(locale)) {
    return new Response("Not found", {status: 404});
  }

  const repository = getPublishedContentRepository();
  const [posts, settings] = await Promise.all([
    repository.listPosts(locale),
    repository.getSettings(locale)
  ]);
  const messages = locale === "vi" ? viMessages : enMessages;
  const xml = buildRssXml({
    locale,
    siteUrl: getSiteUrl(),
    title: `${settings.seo.title} — ${messages.writing.title}`,
    description: messages.writing.description,
    posts
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600"
    }
  });
}
