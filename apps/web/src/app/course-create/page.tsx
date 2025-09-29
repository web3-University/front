"use client";

import React, { useState } from "react";
import { CourseProvider } from "./components/CourseContext";
import ProgressBar from "./components/ProgressBar";
import BasicInfoTab from "./tabs/BasicInfoTab";
import ContentTab from "./tabs/ContentTab";
import PricingTab from "./tabs/PricingTab";
import PreviewTab from "./tabs/PreviewTab";
import QuickActions from "./components/QuickActions";
import CompletionStatus from "./components/CompletionStatus";
import RewardInfo from "./components/RewardInfo";
import CreationSuggestions from "./components/CreationSuggestions";

// 课程创建页面组件
const page = () => {
  // 当前激活的标签页
  const [activeTab, setActiveTab] = useState("basicInfo");

  return (
    // 使用CourseProvider包裹所有需要访问课程数据的组件
    <CourseProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-6">
        <div className="max-w-7xl mx-auto mt-26">
          <h1 className="text-white text-xl font-bold">课程创建工作台</h1>
          {/* 顶部标题 */}
          <p className="text-sm text-gray-400 mb-6">
            创建高质量的Web3教育课程，获得代币奖励
          </p>

          {/* 进度条 */}
          <ProgressBar />

          <div className="flex gap-6">
            {/* 主内容区域 - 根据激活的标签页显示不同组件 */}
            <div className="flex-1">
              {/* 标签页导航 */}
              <div className="flex mb-6 bg-gray-800 p-1 rounded-lg flex gap-4 text-sm">
                <button
                  onClick={() => setActiveTab("basicInfo")}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === "basicInfo"
                      ? "bg-blue-600 text-white"
                      : "text-gray-300"
                  }`}
                >
                  基本信息
                </button>
                <button
                  onClick={() => setActiveTab("courseContent")}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === "courseContent"
                      ? "bg-blue-600 text-white"
                      : "text-gray-300"
                  }`}
                >
                  课程内容
                </button>
                <button
                  onClick={() => setActiveTab("pricingSetting")}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === "pricingSetting"
                      ? "bg-blue-600 text-white"
                      : "text-gray-300"
                  }`}
                >
                  定价设置
                </button>
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === "preview"
                      ? "bg-blue-600 text-white"
                      : "text-gray-300"
                  }`}
                >
                  预览发布
                </button>
              </div>
              {activeTab === "basicInfo" && <BasicInfoTab />}
              {activeTab === "courseContent" && <ContentTab />}
              {activeTab === "pricingSetting" && <PricingTab />}
              {activeTab === "preview" && <PreviewTab />}
            </div>

            {/* 右侧边栏 - 快捷操作和状态信息 */}
            <div className="w-80">
              <QuickActions />
              <CompletionStatus />
              <CreationSuggestions />
              <RewardInfo />
            </div>
          </div>
        </div>
      </div>
    </CourseProvider>
  );
};

export default page;
