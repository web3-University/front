import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { type Locale, locales } from "@/i18n/config";
import Providers from "../providers";

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  console.log("[LocaleLayout] incoming locale param", locale);

  setRequestLocale(locale as Locale);

  const messages = await getMessages({ locale });
  console.log("[LocaleLayout] loaded messages for", locale, {
    hasMessages: Boolean(messages),
  });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Providers>{children}</Providers>
    </NextIntlClientProvider>
  );
}
