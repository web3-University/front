// apps/web/src/i18n/hooks.ts
import { useCallback } from "react";

import type { Locale } from "@/i18n/config";
import { useI18nContext } from "@/i18n/I18nProvider";
import type { TranslationValues } from "@/i18n/translator";

export function useLocale() {
  const { locale, setLocale } = useI18nContext();
  return { locale, setLocale };
}

export function useTranslation(namespace?: string) {
  const { t } = useI18nContext();

  return useCallback(
    (key: string, values?: TranslationValues) =>
      t(namespace ? `${namespace}.${key}` : key, values),
    [namespace, t],
  );
}

export function useTranslator() {
  return useI18nContext().t;
}

export function useChangeLocale(): [(locale: Locale) => void, Locale] {
  const { locale, setLocale } = useI18nContext();
  return [setLocale, locale];
}
