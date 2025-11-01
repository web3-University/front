"use client";

import { ArrowRight, Award, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import NFTGallery from "./NFTGallery";
// import TransactionHistory from "./TransactionHistory";
import UserInfoSection from "./UserInfoSection";

type Tab = "profile" | "nft";
// type Tab = "profile" | "nft" | "transactions";

export default function ProfileView() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="mx-auto max-w-[1280px] px-6">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#2B2558] mb-3">个人中心</h1>
          <p className="text-lg text-[#6A6D94]">管理你的个人信息</p>
        </div>

        {/* 跳转到学习中心的引导卡片 */}
        <Link href="/learn">
          <div className="mb-8 group cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-[#8A71FF] to-[#9D82FF] p-6 shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                  <Award className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    前往学习中心
                  </h3>
                  <p className="text-sm text-white/90">
                    查看课程进度、学习分析和NFT成就收藏
                  </p>
                </div>
              </div>
              <ArrowRight className="h-6 w-6 text-white transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        {/* Tab 切换 */}
        <div className="mb-8">
          <div className="flex gap-2 rounded-2xl bg-white/60 p-2 backdrop-blur-sm shadow-sm ring-1 ring-white/60">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium transition-all ${
                activeTab === "profile"
                  ? "bg-gradient-to-r from-[#8A71FF] to-[#9D7FFF] text-white shadow-md"
                  : "text-[#6A6D94] hover:bg-white/50"
              }`}
            >
              <User className="h-5 w-5" />
              个人信息
            </button>
            <button
              onClick={() => setActiveTab("nft")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium transition-all ${
                activeTab === "nft"
                  ? "bg-gradient-to-r from-[#8A71FF] to-[#9D7FFF] text-white shadow-md"
                  : "text-[#6A6D94] hover:bg-white/50"
              }`}
            >
              <Sparkles className="h-5 w-5" />
              NFT收藏
            </button>
            {/* 交易记录 Tab 暂时隐藏 */}
            {/* <button
              onClick={() => setActiveTab("transactions")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium transition-all ${
                activeTab === "transactions"
                  ? "bg-gradient-to-r from-[#8A71FF] to-[#9D7FFF] text-white shadow-md"
                  : "text-[#6A6D94] hover:bg-white/50"
              }`}
            >
              <Receipt className="h-5 w-5" />
              交易记录
            </button> */}
          </div>
        </div>

        {/* Tab 内容 */}
        <div>
          {activeTab === "profile" && <UserInfoSection />}
          {activeTab === "nft" && <NFTGallery />}
          {/* {activeTab === "transactions" && <TransactionHistory />} */}
        </div>
      </div>
    </div>
  );
}
