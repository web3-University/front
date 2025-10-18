"use client";

import { useState } from "react";
import AchievementsTab from "@/components/learn/AchievementsTab";
import AnalyticsTab from "@/components/learn/AnalyticsTab";
import MyCoursesTab from "@/components/learn/MyCoursesTab";
import OverviewTab from "@/components/learn/OverviewTab";

type Tab = "overview" | "courses" | "achievements" | "analytics";

const tabs: { key: Tab; label: string }[] = [
  { key: "overview", label: "概览" },
  { key: "courses", label: "我的课程" },
  { key: "achievements", label: "成就收藏" },
  { key: "analytics", label: "学习分析" },
];

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="mx-auto max-w-[1280px] px-6">
        {/* 页面标题和副标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#2B2558] mb-3">学习中心</h1>
          <p className="text-lg text-[#6A6D94]">掌握Web3技能，获得代币奖励</p>
        </div>

        {/* 代币余额卡片 */}
        <div className="mb-8 flex items-center justify-between rounded-2xl bg-gradient-to-br from-[#FFB347] to-[#FF8A6B] p-6 shadow-lg">
          <div>
            <div className="mb-1 text-sm font-medium text-white/90">YD余额</div>
            <div className="text-4xl font-bold text-white">25,680</div>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <svg
              className="h-10 w-10 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
            </svg>
          </div>
        </div>

        {/* 标签导航 */}
        <div className="mb-8 flex gap-2 rounded-2xl bg-white/60 p-2 backdrop-blur-sm shadow-sm ring-1 ring-white/60">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 rounded-xl px-6 py-3 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-[#8A71FF] to-[#9D82FF] text-white shadow-md"
                  : "text-[#6A6D94] hover:bg-white/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 标签内容 */}
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "courses" && <MyCoursesTab />}
        {activeTab === "achievements" && <AchievementsTab />}
        {activeTab === "analytics" && <AnalyticsTab />}
      </div>
    </div>
  );
}
