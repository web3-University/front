"use client";

import { useMemo } from "react";

import { Coins, Globe2, ShieldCheck, UserCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/hooks";

type HighlightItem = {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
  iconBg: string;
  eyebrow?: string;
};

export default function InstructorInvitation() {
  const t = useTranslation("instructorInvitation");

  const highlights: HighlightItem[] = useMemo(
    () => [
      {
        icon: ShieldCheck,
        title: t("highlights.highEarnings.title"),
        description: t("highlights.highEarnings.description"),
        iconBg: "from-[#34D399] to-[#10B981]",
      },
      {
        icon: Coins,
        title: t("highlights.tokenRewards.title"),
        description: t("highlights.tokenRewards.description"),
        iconBg: "from-[#8B5CF6] to-[#6366F1]",
      },
      {
        icon: Globe2,
        title: t("highlights.globalReach.title"),
        description: t("highlights.globalReach.description"),
        iconBg: "from-[#FF7A50] to-[#F97316]",
      },
    ],
    [t],
  );

  const stats = useMemo(
    () => [
      { label: t("stats.activeInstructors"), value: "127" },
      { label: t("stats.totalRevenue"), value: "Ƀ 1.2M", highlight: true },
      { label: t("stats.averageRating"), value: "4.8" },
      { label: t("stats.totalStudents"), value: "15,000+" },
    ],
    [t],
  );

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-6 py-24 text-center text-white">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-medium backdrop-blur-md ring-1 ring-white/20">
          <UserCheck className="h-4 w-4" />
          {t("badge")}
        </div>

        <h2 className="text-3xl font-bold md:text-4xl">{t("title")}</h2>
        <p className="mx-auto mt-3 max-w-3xl text-base text-white/80">
          {t("description")}
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {highlights.map(
            ({ icon: Icon, eyebrow, title, description, iconBg }) => (
              <article
                key={title}
                className="group flex h-full flex-col items-center gap-4 rounded-3xl bg-gradient-to-br from-[#2D1F78] to-[#4E1F84] px-8 py-10 text-center text-white shadow-[0_22px_65px_rgba(24,7,56,0.45)] ring-1 ring-white/10 transition-transform duration-200 hover:-translate-y-2"
              >
                <div
                  className={`inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${iconBg} text-white shadow-[0_22px_45px_rgba(16,12,60,0.4)]`}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <div className="text-xs uppercase tracking-[0.18em] text-white/60">
                  {eyebrow}
                </div>
                <div className="text-2xl font-semibold">{title}</div>
                <p className="text-sm leading-relaxed text-white/75">
                  {description}
                </p>
              </article>
            ),
          )}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/teacher">
            <Button variant="primary" size="lg">
              {t("ctaPrimary")}
            </Button>
          </Link>
          <Link href="/course-create">
            <Button variant="secondary" size="lg">
              {t("ctaSecondary")}
            </Button>
          </Link>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl bg-white/10 px-6 py-8 text-center shadow-[0_18px_45px_rgba(24,7,56,0.3)] ring-1 ring-white/12 transition-transform duration-200 hover:-translate-y-1"
            >
              <span
                className={`text-3xl font-extrabold ${
                  item.highlight ? "text-[#FFD166]" : "text-white"
                }`}
              >
                {item.value}
              </span>
              <span className="mt-2 block text-base text-white/75">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4222AA] via-[#5523A8] to-[#7D2EDC] opacity-90" />
        <div className="absolute left-[-12%] top-[12%] h-[28rem] w-[28rem] rounded-full bg-[#7C5CFF]/45 blur-[200px]" />
        <div className="absolute right-[-6%] top-[45%] h-[26rem] w-[26rem] rounded-full bg-[#FF7ABF]/40 blur-[200px]" />
      </div>
    </section>
  );
}
