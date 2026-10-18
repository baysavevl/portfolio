import {getTranslations} from "next-intl/server";
import type {Locale} from "@/i18n/locale";
import type {SiteSettings} from "@/lib/content/types";

interface SiteFooterProps {
  locale: Locale;
  settings: SiteSettings;
}

export async function SiteFooter({locale, settings}: SiteFooterProps) {
  const footer = await getTranslations({locale, namespace: "footer"});
  const links = [...settings.contactLinks, ...settings.socialLinks];

  return (
    <footer className="site-footer">
      <p>{footer("brandLine")}</p>
      <p>{settings.footerNote}</p>
      {links.length > 0 ? (
        <ul>
          {links.map((link) => (
            <li key={`${link.label}-${link.href}`}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      ) : null}
    </footer>
  );
}
