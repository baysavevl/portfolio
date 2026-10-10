import type {MetadataRoute} from "next";
import {absoluteUrl, getSiteUrl} from "@/lib/seo/metadata";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/api/draft-mode", "/api/revalidate"]
    },
    sitemap: absoluteUrl("/sitemap.xml", siteUrl),
    host: siteUrl
  };
}
