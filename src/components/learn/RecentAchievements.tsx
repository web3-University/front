"use client";

import { Award, ChevronRight } from "lucide-react";

const achievements = [
  {
    id: 1,
    title: "DeFi 探索者",
    icon: "🏆",
    rarity: "common",
    rarityLabel: "普通",
    rarityColor: "from-[#9E9E9E] to-[#757575]",
  },
  {
    id: 2,
    title: "编程大师",
    icon: "💻",
    rarity: "rare",
    rarityLabel: "稀有",
    rarityColor: "from-[#5B9EFF] to-[#4A8EFF]",
  },
];

export default function RecentAchievements() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-white/80 to-white/60 p-6 backdrop-blur-sm shadow-md ring-1 ring-white/60">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-[#8A71FF]" />
          <h2 className="text-xl font-bold text-[#2B2558]">最新成就</h2>
        </div>
        <button
          type="button"
          className="flex items-center gap-1 text-sm font-medium text-[#8A71FF] transition-colors hover:text-[#7A61EF]"
        >
          查看全部
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className="group relative overflow-hidden rounded-xl bg-white/60 p-5 transition-all hover:bg-white/80 hover:shadow-md"
          >
            {/* 背景光效 */}
            <div
              className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${achievement.rarityColor} opacity-10 blur-2xl transition-opacity group-hover:opacity-20`}
            />

            <div className="relative flex items-center gap-4">
              {/* 成就图标 */}
              <div
                className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${achievement.rarityColor} text-3xl shadow-lg`}
              >
                {achievement.icon}
              </div>

              {/* 成就信息 */}
              <div className="flex-1">
                <h3 className="mb-1 font-semibold text-[#2B2558]">
                  {achievement.title}
                </h3>
                <div
                  className={`inline-block rounded-full bg-gradient-to-r ${achievement.rarityColor} px-3 py-1 text-xs font-medium text-white`}
                >
                  {achievement.rarityLabel}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
