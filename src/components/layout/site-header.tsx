import {getTranslations} from "next-intl/server";
import type {Locale} from "@/i18n/locale";
import {Link} from "@/i18n/navigation";
import {LocaleSwitcher} from "@/components/layout/locale-switcher";
import {MobileMenu} from "@/components/layout/mobile-menu";

interface SiteHeaderProps {
  currentLocale: Locale;
}

export async function SiteHeader({currentLocale}: SiteHeaderProps) {
  const [navigation, accessibility] = await Promise.all([
    getTranslations({locale: currentLocale, namespace: "nav"}),
    getTranslations({locale: currentLocale, namespace: "accessibility"})
  ]);
  const items = [
    {href: "/work", label: navigation("work")},
    {href: "/writing", label: navigation("writing")},
    {href: "/about", label: navigation("about")},
    {href: "/resume", label: navigation("resume")}
  ];

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link
          href="/"
          locale={currentLocale}
          aria-label={`${navigation("home")} — Vincent Luu`}
          className="site-identity"
        >
          <span>Vincent Luu</span>
          <span>The Mindful Builder</span>
        </Link>

        <nav
          className="desktop-navigation"
          aria-label={accessibility("mainNavigation")}
        >
          <ul>
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} locale={currentLocale}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <LocaleSwitcher />
          <MobileMenu
            locale={currentLocale}
            items={items}
            openLabel={navigation("menu")}
            closeLabel={navigation("closeMenu")}
            navigationLabel={accessibility("mobileNavigation")}
          />
        </div>
      </div>
    </header>
  );
}
