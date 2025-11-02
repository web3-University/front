"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";

export default function PlatformAdvantages() {
	const locale = useLocale();
	const t = useTranslations("home.platformAdvantages");

	const advantages = useMemo(
		() => [
			{
				icon: "₿",
				title: t("items.tokenIncentive.title"),
				description: t("items.tokenIncentive.description"),
			},
			{
				icon: "🛡",
				title: t("items.blockchainCertificate.title"),
				description: t("items.blockchainCertificate.description"),
			},
			{
				icon: "🌐",
				title: t("items.daoGovernance.title"),
				description: t("items.daoGovernance.description"),
			},
		],
		// Recompute when locale or translation function changes
		[locale, t],
	);

	return (
		<section className="relative overflow-hidden">
			<div className="mx-auto max-w-[1200px] px-6 py-24 text-center">
				<h2 className="text-3xl font-bold text-[#2B2558] md:text-4xl">
					{t("title")}
				</h2>
				<p className="mt-3 text-base text-[#6A6D94]">{t("subtitle")}</p>

				<div className="mt-16 grid gap-6 md:grid-cols-3">
					{advantages.map((item) => (
						<article
							key={item.title}
							className="group flex h-full flex-col items-center rounded-3xl bg-gradient-to-b from-white to-[#F6F4FF] px-8 py-12 text-center shadow-[0_22px_55px_rgba(162,167,255,0.2)] ring-1 ring-[#ECEBFF] transition-transform duration-200 hover:-translate-y-2"
						>
							<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFB347] to-[#FF6B9A] text-3xl font-semibold text-white shadow-[0_20px_45px_rgba(255,133,133,0.3)]">
								{item.icon}
							</div>
							<h3 className="mt-6 text-xl font-semibold text-[#2B2558]">
								{item.title}
							</h3>
							<p className="mt-3 text-sm leading-relaxed text-[#6A6D94]">
								{item.description}
							</p>
						</article>
					))}
				</div>
			</div>

			<div className="pointer-events-none absolute inset-0 -z-10">
				<div className="absolute left-[-15%] top-[40%] h-[28rem] w-[28rem] rounded-full bg-[#E4E2FF] opacity-60 blur-[160px]" />
				<div className="absolute right-[-10%] top-[20%] h-[26rem] w-[26rem] rounded-full bg-[#FFE4F2] opacity-70 blur-[180px]" />
			</div>
		</section>
	);
}
