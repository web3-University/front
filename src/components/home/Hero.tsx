"use client";

import { useTranslations } from "next-intl";
import { Metrics } from "@/components/stats/Metrics";
import { Button } from "@/components/ui/button";
import type { StatItem } from "@/lib/types";
import { useRouter } from "@/navigation";
// 主页顶部大横幅组件
export default function Hero() {
	const t = useTranslations("home.hero");
	const router = useRouter();

	const stats: StatItem[] = [
		{ value: "50,000+", label: t("stats.registeredUsers") },
		{ value: "2,500+", label: t("stats.courses") },
		{ value: "Ƀ 1.2M", label: t("stats.volume") },
		{ value: "15,000+", label: t("stats.nftCertificates") },
	];

	return (
		<section className="relative">
			<div className="mx-auto max-w-[1200px] px-6 pt-32 pb-24 text-center">
				{/* 顶部徽章 */}
				<div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-2 text-sm font-medium text-[#6A6D94] shadow-[0_12px_40px_rgba(160,168,255,0.18)] ring-1 ring-white/70">
					<span className="inline-flex h-2 w-2 rounded-full bg-[#FF8A6B]" />
					{t("badge")}
				</div>

				<h1 className="text-5xl font-extrabold leading-tight text-[#2B2558] md:text-7xl">
					<span className="bg-gradient-to-r from-[#FF7A7B] via-[#FF9D6B] to-[#8A71FF] bg-clip-text text-transparent">
						{t("titleHighlight")}
					</span>
				</h1>
				<p className="mx-auto mt-5 max-w-3xl text-lg text-[#6A6D94]">
					{t("description")}
				</p>

				{/* CTA 居中 */}
				<div className="mx-auto mt-10 flex max-w-lg flex-col gap-4 sm:flex-row sm:justify-center">
					<Button
						variant="primary"
						size="lg"
						onClick={() => router.push("/market")}
					>
						{t("primaryCta")}
					</Button>
					<Button
						variant="secondary"
						size="lg"
						onClick={() => router.push("/teacher")}
					>
						{t("secondaryCta")}
					</Button>
				</div>

				{/* 指标卡片（居中，四等分） */}
				<div className="mx-auto mt-16 max-w-5xl">
					<Metrics items={stats} />
				</div>
			</div>

			{/* 背景柔光 */}
			<div className="pointer-events-none absolute inset-0 -z-10">
				<div className="absolute left-[-10%] top-[10%] h-[22rem] w-[22rem] rounded-full bg-[#F1E3FF] opacity-60 blur-[120px]" />
				<div className="absolute right-[5%] top-[25%] h-[18rem] w-[18rem] rounded-full bg-[#FFE9D6] opacity-70 blur-[110px]" />
				<div className="absolute bottom-[-15%] left-1/2 h-[26rem] w-[40rem] -translate-x-1/2 rounded-[200px] bg-white/80 opacity-80 blur-[140px]" />
			</div>
		</section>
	);
}
