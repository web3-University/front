import createIntlMiddleware from "next-intl/middleware";

import { defaultLocale, localePrefix, locales } from "@/i18n/config";

export default createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix,
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
