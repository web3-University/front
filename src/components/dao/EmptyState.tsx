"use client";

import React from "react";
import { DaoTabKey } from "@/types/dao";
import { useTranslations } from "next-intl";

interface EmptyStateProps {
  activeTab: DaoTabKey;
  isConnected: boolean;
}

/**
 * 📭 空状态组件
 */
export function EmptyState({ activeTab, isConnected }: EmptyStateProps) {
  const t = useTranslations("dao.emptyState");

  const getTabName = () => {
    if (activeTab === "proposal") return t("tabs.proposal");
    if (activeTab === "dispute") return t("tabs.dispute");
    if (activeTab === "history") return t("tabs.history");
    return t("tabs.default");
  };

  const getEmptyMessage = () => {
    if (!isConnected) {
      return t("connectWalletPrompt");
    }

    if (activeTab === "proposal") {
      return t("createProposalHint");
    }

    if (activeTab === "dispute") {
      return t("createDisputeHint");
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

      <p className="text-lg mb-2">{t("title", { tab: getTabName() })}</p>

      {getEmptyMessage() && (
        <p className="text-sm text-gray-500">{getEmptyMessage()}</p>
      )}
    </div>
  );
}
