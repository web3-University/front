"use client";

import { useState } from "react";
import UserInfoSection from "./UserInfoSection";
import NFTGallery from "./NFTGallery";

type Tab = "info" | "nft";

const tabs: { key: Tab; label: string }[] = [
  { key: "info", label: "个人信息" },
  { key: "nft", label: "我的NFT" },
];

export default function ProfileView() {
  const [activeTab, setActiveTab] = useState<Tab>("info");

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="mx-auto max-w-[1280px] px-6">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#2B2558] mb-3">个人中心</h1>
          <p className="text-lg text-[#6A6D94]">管理你的个人信息和NFT收藏</p>
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
        {activeTab === "info" && <UserInfoSection />}
        {activeTab === "nft" && <NFTGallery />}
      </div>
    </div>
  );
}
