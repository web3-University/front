import { getRequestConfig } from "next-intl/server";

import { defaultLocale, type Locale, locales } from "./config";

const messageLoaders: Record<
  Locale,
  () => Promise<{ default: Record<string, unknown> }>
> = {
  zh: () => import("../messages/zh.json"),
  en: () => import("../messages/en.json"),
};

export default getRequestConfig(async ({ locale }) => {
  const normalizedLocale = (
    locales.includes(locale as Locale) ? locale : defaultLocale
  ) as Locale;

  console.log("[i18n/request] resolving messages", {
    requested: locale,
    normalizedLocale,
  });

  const { default: messages } = await messageLoaders[normalizedLocale]();

  return { locale: normalizedLocale, messages };
});
