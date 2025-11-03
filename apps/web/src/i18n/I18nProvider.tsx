"use client";

// apps/web/src/i18n/I18nProvider.tsx

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary, type Messages } from "@/i18n/dictionaries";
import { createTranslator, type Translator } from "@/i18n/translator";

type I18nContextValue = {
  locale: Locale;
  t: Translator;
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

type I18nProviderProps = {
  locale?: Locale;
  messages?: Messages;
  children: ReactNode;
};

const COOKIE_NAME = "NEXT_LOCALE";
const ONE_YEAR = 60 * 60 * 24 * 365;

export function I18nProvider({
  locale: initialLocale = DEFAULT_LOCALE,
  messages: initialMessages,
  children,
}: I18nProviderProps) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [messages, setMessages] = useState<Messages>(
    initialMessages ?? getDictionary(initialLocale),
  );

  const translator = useMemo(() => createTranslator(messages), [messages]);

  const handleChangeLocale = useCallback(
    (nextLocale: Locale) => {
      if (nextLocale === locale) return;
      const nextMessages = getDictionary(nextLocale);
      setLocaleState(nextLocale);
      setMessages(nextMessages);

      // 持久化到 Cookie，便于服务端读取
      document.cookie = `${COOKIE_NAME}=${nextLocale}; path=/; max-age=${ONE_YEAR}`;

      // 触发服务端组件刷新，确保服务端渲染的文案同步
      router.refresh();
    },
    [locale, router],
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      t: translator,
      setLocale: handleChangeLocale,
    }),
    [handleChangeLocale, locale, translator],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18nContext() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18nContext must be used within an I18nProvider");
  }
  return context;
}
