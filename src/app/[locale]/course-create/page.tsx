"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import BasicInfoTab from "@/components/courseCreate/BasicInfoTab";
import CompletionStatus from "@/components/courseCreate/CompletionStatus";
import ContentTab from "@/components/courseCreate/ContentTab";
import CreationSuggestions from "@/components/courseCreate/CreationSuggestions";
import PreviewTab from "@/components/courseCreate/PreviewTab";
import PricingTab from "@/components/courseCreate/PricingTab";
import ProgressBar from "@/components/courseCreate/ProgressBar";
import QuickActions from "@/components/courseCreate/QuickActions";
import RewardInfo from "@/components/courseCreate/RewardInfo";

export default function Page() {
  const [activeTab, setActiveTab] = useState("basicInfo");
  const tLayout = useTranslations("courseCreate.layout");
  const tabs = [
    "basicInfo",
    "courseContent",
    "pricingSetting",
    "preview",
  ] as const;

  const handlePreview = () => {
    setActiveTab("preview");
  };
  return (
    <div className="min-h-screen p-6 pt-20">
      <div className="max-w-7xl mx-auto mt-10">
        {/* 顶部标题 */}
        <h1 className="text-gray-900 text-2xl font-bold mb-1">
          {tLayout("title")}
        </h1>
        <p className="text-sm text-gray-600 mb-6">{tLayout("subtitle")}</p>

        <ProgressBar />

        <div className="flex gap-6 mt-6">
          {/* 主内容区域 */}
          <div className="flex-1">
            <div className="flex mb-6 bg-white/70 p-2 rounded-xl gap-4 text-sm border border-purple-100 shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg transition font-medium ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {tLayout(`tabs.${tab}`)}
                </button>
              ))}
            </div>

            {/* tab 显示内容 */}
            {activeTab === "basicInfo" && <BasicInfoTab />}
            {activeTab === "courseContent" && <ContentTab />}
            {activeTab === "pricingSetting" && <PricingTab />}
            {activeTab === "preview" && <PreviewTab />}
          </div>

          {/* 右侧边栏 */}
          <div className="w-80 space-y-4">
            <QuickActions onPreview={handlePreview} />
            <CompletionStatus />
            <CreationSuggestions />
            <RewardInfo />
          </div>
        </div>
      </div>
    </div>
  );
}
