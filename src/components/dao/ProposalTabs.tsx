"use client";

import React from "react";
import { DaoTabKey } from "@/types/dao";
import { PROPOSAL_TABS_DAO } from "@/lib/dao";

interface ProposalTabsProps {
  activeTab: DaoTabKey;
  isLoading: boolean;
  onTabChange: (tab: DaoTabKey) => void;
}

/**
 * 🔖 提案标签切换组件
 */
export function ProposalTabs({
  activeTab,
  isLoading,
  onTabChange,
}: ProposalTabsProps) {
  return (
    <div className="flex gap-3 mb-8 bg-white/5 backdrop-blur-sm rounded-2xl p-1.5 border border-white/10">
      {PROPOSAL_TABS_DAO.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          disabled={isLoading}
          className={`flex-1 px-8 py-3.5 font-semibold rounded-xl transition-all duration-300 ${
            activeTab === tab.key
              ? "bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30 scale-[1.02]"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
