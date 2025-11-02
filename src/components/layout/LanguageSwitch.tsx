"use client";

import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { locales } from "@/i18n/config";
import { usePathname, useRouter } from "@/navigation";

export default function LanguageSwitch() {
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();
	const t = useTranslations("header.languageSwitch");

	const nextLocale = locale === "zh" ? "en" : "zh";
	const compactLabel = locale === "zh" ? "EN" : "中";
	const fullLabel = locale === "zh" ? t("toEnglish") : t("toChinese");

	useEffect(() => {
		console.log("[LanguageSwitch] render", {
			locale,
			pathname,
			nextLocale,
		});
	}, [locale, pathname, nextLocale]);

	const handleToggle = () => {
		const currentPath = pathname ?? "/";
		const localePattern = new RegExp(`^/(${locales.join("|")})(?=/|$)`, "i");
		const pathWithoutLocale = currentPath.replace(localePattern, "") || "/";

		console.log("[LanguageSwitch] toggle", {
			locale,
			nextLocale,
			currentPath,
			pathWithoutLocale,
		});

		router.replace(pathWithoutLocale, { locale: nextLocale });
	};

	return (
		<div className="fixed right-0 top-1/2 z-50 -translate-y-1/2">
			<button
				type="button"
				onClick={handleToggle}
				className={clsx(
					"group flex items-center gap-2 rounded-l-full bg-[#2B2558] px-2 py-2 text-white shadow-[0_10px_30px_rgba(62,56,120,0.25)] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B9A]/70 hover:bg-[#3A3380]",
				)}
				aria-label={fullLabel}
			>
				<span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-semibold uppercase tracking-wide">
					{compactLabel}
				</span>
				<span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 group-hover:max-w-[120px] group-hover:opacity-100">
					{fullLabel}
				</span>
			</button>
		</div>
	);
}
