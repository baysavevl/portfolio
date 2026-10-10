"use client";

import {useState} from "react";
import type {Locale} from "@/i18n/locale";
import {Link} from "@/i18n/navigation";

interface MobileMenuItem {
  href: string;
  label: string;
}

interface MobileMenuProps {
  locale: Locale;
  items: MobileMenuItem[];
  openLabel: string;
  closeLabel: string;
  navigationLabel: string;
}

export function MobileMenu({
  locale,
  items,
  openLabel,
  closeLabel,
  navigationLabel
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mobile-menu">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        onClick={() => setIsOpen((value) => !value)}
        className="mobile-menu__trigger"
      >
        {isOpen ? closeLabel : openLabel}
      </button>

      {isOpen ? (
        <nav id="mobile-navigation" aria-label={navigationLabel}>
          <ul className="mobile-menu__list">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  locale={locale}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
