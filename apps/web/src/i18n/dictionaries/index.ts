// apps/web/src/i18n/dictionaries/index.ts
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import type { MessageTree } from "@/i18n/translator";

import de from "./de";
import en from "./en";
import ja from "./ja";
import zhCN from "./zh-CN";

const dictionaries: Record<Locale, MessageTree> = {
  "zh-CN": zhCN,
  en,
  ja,
  de,
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
}

export type Messages = ReturnType<typeof getDictionary>;
