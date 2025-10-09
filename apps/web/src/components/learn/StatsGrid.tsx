import type { ReactNode } from "react";

type StatItem = {
  icon: ReactNode;
  value: string;
  label: string;
  color: string;
};

type StatsGridProps = {
  stats: StatItem[];
};

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/80 to-white/60 p-6 backdrop-blur-sm shadow-md ring-1 ring-white/60 transition-all hover:-translate-y-1 hover:shadow-xl"
        >
          {/* 背景渐变装饰 */}
          <div
            className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${stat.color} opacity-10 blur-2xl transition-opacity group-hover:opacity-20`}
          />

          <div className="relative">
            {/* 图标 */}
            <div
              className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}
            >
              {stat.icon}
            </div>

            {/* 数值 */}
            <div className="mb-1 text-3xl font-bold text-[#2B2558]">
              {stat.value}
            </div>

            {/* 标签 */}
            <div className="text-sm text-[#6A6D94]">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
