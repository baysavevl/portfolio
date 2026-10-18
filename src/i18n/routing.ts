import {defineRouting} from "next-intl/routing";
import {
  defaultLocale,
  localeCookieName,
  locales
} from "@/i18n/locale";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: false,
  localeCookie: {
    name: localeCookieName,
    path: "/",
    maxAge: 31_536_000,
    sameSite: "lax"
  }
});
