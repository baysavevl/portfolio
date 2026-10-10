import createMiddleware from "next-intl/middleware";
import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";
import {localeCookieName, localeFromCookie} from "@/i18n/locale";
import {routing} from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    const locale = localeFromCookie(
      request.cookies.get(localeCookieName)?.value
    );

    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|studio|_next|_vercel|.*\\..*).*)"]
};
