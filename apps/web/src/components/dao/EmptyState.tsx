"use client";

import React from "react";
import { DaoTabKey } from "@/types/dao";

interface EmptyStateProps {
  activeTab: DaoTabKey;
  isConnected: boolean;
}

/**
 * 📭 空状态组件
 */
export function EmptyState({ activeTab, isConnected }: EmptyStateProps) {
  const getTabName = () => {
    switch (activeTab) {
      case "proposal":
        return "治理提案";
      case "dispute":
        return "课程争议";
      case "history":
        return "历史记录";
      default:
        return "提案";
    }
  };

  const getEmptyMessage = () => {
    if (!isConnected) {
      return "请先连接钱包查看提案";
    }

    if (activeTab === "proposal") {
      return "点击上方按钮创建第一个提案";
    }

    if (activeTab === "dispute") {
      return "点击上方按钮提交课程争议";
    }

    return null;
  };

  return (
    <div className="text-center py-20 text-gray-400">
      <svg
        className="w-16 h-16 mx-auto mb-4 opacity-50"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>

      <p className="text-lg mb-2">暂无{getTabName()}</p>

      {getEmptyMessage() && (
        <p className="text-sm text-gray-500">{getEmptyMessage()}</p>
      )}
    </div>
  );
}
