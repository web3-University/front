"use client";

import { useState } from "react";
import { Award, Gift, Check } from "lucide-react";

type AchievementRarity = "common" | "rare" | "epic" | "legendary";

type Achievement = {
  id: number;
  title: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  progress?: number;
  isCompleted: boolean;
  completedDate?: string;
};

const rarityConfig: Record<
  AchievementRarity,
  { label: string; color: string; borderColor: string; bgGradient: string }
> = {
  common: {
    label: "COMMON",
    color: "text-[#9E9E9E]",
    borderColor: "ring-[#9E9E9E]/30",
    bgGradient: "from-[#9E9E9E]/10 to-[#757575]/5",
  },
  rare: {
    label: "RARE",
    color: "text-[#5B9EFF]",
    borderColor: "ring-[#5B9EFF]/30",
    bgGradient: "from-[#5B9EFF]/10 to-[#4A8EFF]/5",
  },
  epic: {
    label: "EPIC",
    color: "text-[#9C27B0]",
    borderColor: "ring-[#9C27B0]/30",
    bgGradient: "from-[#9C27B0]/10 to-[#7B1FA2]/5",
  },
  legendary: {
    label: "LEGENDARY",
    color: "text-[#FF9800]",
    borderColor: "ring-[#FF9800]/30",
    bgGradient: "from-[#FF9800]/10 to-[#F57C00]/5",
  },
};

const completedAchievements: Achievement[] = [
  {
    id: 1,
    title: "DeFi 探索者",
    description: "完成第一门 DeFi 课程",
    icon: "🏆",
    rarity: "common",
    isCompleted: true,
    completedDate: "2024-01-15",
  },
  {
    id: 2,
    title: "编程大师",
    description: "完成10门编程课程",
    icon: "💻",
    rarity: "rare",
    isCompleted: true,
    completedDate: "2024-02-20",
  },
];

const inProgressAchievements: Achievement[] = [
  {
    id: 3,
    title: "连续学习者",
    description: "连续30天学习",
    icon: "🔥",
    rarity: "epic",
    isCompleted: false,
    progress: 78,
  },
  {
    id: 4,
    title: "社区贡献者",
    description: "帮助100名学员解答问题",
    icon: "🤝",
    rarity: "legendary",
    isCompleted: false,
    progress: 45,
  },
];

export default function AchievementsTab() {
  const [showNFTHint] = useState(true);
  const nftCollected = 2;
  const nftTotal = 4;

  return (
    <div className="space-y-6">
      {/* 页面标题和NFT收藏品提示 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#2B2558]">成就收藏</h2>
        {showNFTHint && (
          <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FFB347] to-[#FF8A6B] px-4 py-2 text-sm font-medium text-white shadow-md">
            <Gift className="h-4 w-4" />
            <span>
              NFT收藏品 {nftCollected}/{nftTotal} 已获得
            </span>
          </div>
        )}
      </div>

      {/* 已获得成就 */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Check className="h-5 w-5 text-[#4CAF50]" />
          <h3 className="text-lg font-bold text-[#2B2558]">已获得</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {completedAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${rarityConfig[achievement.rarity].bgGradient} p-6 backdrop-blur-sm shadow-md ring-2 ${rarityConfig[achievement.rarity].borderColor} transition-all hover:shadow-xl hover:-translate-y-1`}
            >
              {/* 光效背景 */}
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-white/30 to-transparent opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />

              <div className="relative">
                {/* 成就图标 */}
                <div className="mb-4 flex justify-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/50 text-5xl shadow-lg">
                    {achievement.icon}
                  </div>
                </div>

                {/* 成就名称 */}
                <h4 className="mb-2 text-center text-lg font-bold text-[#2B2558]">
                  {achievement.title}
                </h4>

                {/* 成就描述 */}
                <p className="mb-3 text-center text-sm text-[#6A6D94]">
                  {achievement.description}
                </p>

                {/* 稀有度标签 */}
                <div className="mb-3 flex justify-center">
                  <span
                    className={`rounded-full border ${rarityConfig[achievement.rarity].color} border-current px-3 py-1 text-xs font-bold tracking-wider`}
                  >
                    {rarityConfig[achievement.rarity].label}
                  </span>
                </div>

                {/* 完成日期 */}
                {achievement.completedDate && (
                  <div className="flex items-center justify-center gap-1 text-xs text-[#4CAF50]">
                    <Check className="h-3.5 w-3.5" />
                    <span>已获得 - {achievement.completedDate}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 进行中的成就 */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-[#8A71FF]" />
          <h3 className="text-lg font-bold text-[#2B2558]">进行中</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {inProgressAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${rarityConfig[achievement.rarity].bgGradient} p-6 backdrop-blur-sm shadow-md ring-2 ${rarityConfig[achievement.rarity].borderColor} transition-all hover:shadow-xl hover:-translate-y-1`}
            >
              {/* 光效背景 */}
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-white/30 to-transparent opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />

              <div className="relative">
                {/* 成就图标 */}
                <div className="mb-4 flex justify-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/50 text-5xl shadow-lg grayscale-[30%] group-hover:grayscale-0 transition-all">
                    {achievement.icon}
                  </div>
                </div>

                {/* 成就名称 */}
                <h4 className="mb-2 text-center text-lg font-bold text-[#2B2558]">
                  {achievement.title}
                </h4>

                {/* 成就描述 */}
                <p className="mb-3 text-center text-sm text-[#6A6D94]">
                  {achievement.description}
                </p>

                {/* 稀有度标签 */}
                <div className="mb-4 flex justify-center">
                  <span
                    className={`rounded-full border ${rarityConfig[achievement.rarity].color} border-current px-3 py-1 text-xs font-bold tracking-wider`}
                  >
                    {rarityConfig[achievement.rarity].label}
                  </span>
                </div>

                {/* 进度条 */}
                {achievement.progress !== undefined && (
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-[#6A6D94]">进度</span>
                      <span className="font-bold text-[#2B2558]">
                        {achievement.progress}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/60">
                      <div
                        className={`h-full bg-gradient-to-r ${achievement.rarity === "epic" ? "from-[#9C27B0] to-[#BA68C8]" : "from-[#FF9800] to-[#FFB74D]"} transition-all`}
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
