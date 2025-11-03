// apps/web/src/i18n/server.ts
import { cookies, headers } from "next/headers";

import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type Locale,
  isSupportedLocale,
} from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { createTranslator, type Translator } from "@/i18n/translator";

const COOKIE_NAME = "NEXT_LOCALE";

async function matchFromAcceptLanguage(): Promise<Locale | undefined> {
  const headerStore = await headers(); // 先 await headers()
  const header = headerStore.get("accept-language"); // 然后调用 get()
  if (!header) return undefined;
  const [first] = header.split(",");
  if (!first) return undefined;
  const normalized = first.trim().toLowerCase();

  for (const locale of SUPPORTED_LOCALES) {
    if (locale.toLowerCase() === normalized) {
      return locale;
    }
  }

  if (normalized.startsWith("zh")) return "zh-CN";
  if (normalized.startsWith("en")) return "en";
  if (normalized.startsWith("ja")) return "ja";
  if (normalized.startsWith("de")) return "de";
  return undefined;
}

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies(); // 先 await cookies()
  const storedLocale = cookieStore.get(COOKIE_NAME)?.value; // 然后调用 get()
  if (isSupportedLocale(storedLocale)) {
    return storedLocale;
  }

  const matched = await matchFromAcceptLanguage(); // 添加 await
  if (matched) return matched;

  return DEFAULT_LOCALE;
}

export async function getServerMessages() {
  const locale = await getServerLocale();
  return {
    locale,
    messages: getDictionary(locale),
  };
}

// 注意：这个函数也需要改为异步
export async function getServerTranslator(
  namespace?: string,
): Promise<Translator> {
  const { messages } = await getServerMessages(); // 添加 await
  return createTranslator(messages, namespace);
}
