// apps/web/src/i18n/config.ts
export const SUPPORTED_LOCALES = ["zh-CN", "en", "ja", "de"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "zh-CN";

export const LOCALE_LABELS: Record<Locale, string> = {
  "zh-CN": "中文",
  en: "English",
  ja: "日本語",
  de: "Deutsch",
};

export function isSupportedLocale(
  locale: string | undefined,
): locale is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(locale ?? "");
}
