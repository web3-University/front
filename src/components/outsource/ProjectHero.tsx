"use client";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/hooks";

interface ProjectHeroProps {
  onPostProject: () => void;
}

export default function ProjectHero({ onPostProject }: ProjectHeroProps) {
  const t = useTranslation("projectHero");
  const stats = [
    { value: "2,350+", label: t("stats.activeProjects") },
    { value: "8,600+", label: t("stats.developers") },
    { value: "Ƀ 850K", label: t("stats.totalVolume") },
    { value: "98.5%", label: t("stats.completionRate") },
  ];

  return (
    <section className="relative overflow-hidden pt-32 pb-24">
      {/* 背景效果 */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* 渐变光晕 */}
        <div className="absolute left-[-15%] top-[-5%] h-[30rem] w-[30rem] animate-blob rounded-full bg-[#E6D8FF] opacity-60 blur-[140px]" />
        <div className="absolute right-[-10%] top-[15%] h-[28rem] w-[28rem] animate-blob rounded-full bg-[#FFE6CF] opacity-70 blur-[130px] animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[30%] h-[25rem] w-[25rem] animate-blob rounded-full bg-[#FFD8E6] opacity-50 blur-[120px] animation-delay-4000" />

        {/* 网格背景 */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(138, 113, 255, 0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(138, 113, 255, 0.5) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="mx-auto max-w-[1200px] px-6 text-center">
        {/* Ping指示器 */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 shadow-lg ring-1 ring-white/80 backdrop-blur-sm">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8A71FF] opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-[#8A71FF]"></span>
          </span>
          <span className="text-sm font-semibold text-[#2B2558]">
            {t("badge")}
          </span>
        </div>

        {/* 标题 */}
        <h1 className="text-5xl font-extrabold leading-tight text-[#2B2558] md:text-7xl">
          <span className="bg-gradient-to-r from-[#8A71FF] via-[#FF9D6B] to-[#FF7A7B] bg-clip-text text-transparent">
            {t("title")}
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg text-[#6A6D94]">
          {t("description.line1")}
          <br />
          {t("description.line2")}
        </p>

        {/* CTA 按钮 */}
        <div className="mx-auto mt-10 flex max-w-lg flex-col gap-4 sm:flex-row sm:justify-center">
          <Button
            onClick={onPostProject}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#8A71FF] to-[#FF9D6B] px-8 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {t("actions.postProject")}
            </span>
            <div className="absolute inset-0 -z-0 bg-gradient-to-r from-[#7A61EF] to-[#EF8D5B] opacity-0 transition-opacity group-hover:opacity-100" />
          </Button>

          <button className="group rounded-xl border-2 border-[#8A71FF] bg-white px-8 py-4 font-semibold text-[#8A71FF] transition-all hover:bg-[#8A71FF] hover:text-white hover:shadow-lg">
            <span className="flex items-center gap-2">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {t("actions.viewGuide")}
            </span>
          </button>
        </div>

        {/* 统计数据 */}
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group rounded-2xl bg-white/60 p-6 shadow-[0_18px_40px_rgba(160,168,255,0.12)] ring-1 ring-white/80 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(160,168,255,0.20)]"
            >
              <div className="text-3xl font-bold text-[#8A71FF]">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-[#6A6D94]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}
