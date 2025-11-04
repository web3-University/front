"use client";

import React, { useMemo } from "react";

import { useTranslation } from "@/i18n/hooks";
import { DaoTabKey } from "@/types/dao";

interface EmptyStateProps {
  activeTab: DaoTabKey;
  isConnected: boolean;
}

/**
 * 📭 空状态组件
 */
export function EmptyState({ activeTab, isConnected }: EmptyStateProps) {
  const t = useTranslation("daoEmpty");

  const tabLabel = useMemo(() => {
    switch (activeTab) {
      case "proposal":
        return t("tabs.proposal");
      case "dispute":
        return t("tabs.dispute");
      case "history":
        return t("tabs.history");
      default:
        return t("tabs.default");
    }
  }, [activeTab, t]);

  const helperMessage = useMemo(() => {
    if (!isConnected) {
      return t("messages.connectWallet");
    }
    if (activeTab === "proposal") {
      return t("messages.createProposal");
    }
    if (activeTab === "dispute") {
      return t("messages.submitDispute");
    }
    return null;
  }, [activeTab, isConnected, t]);

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

      <p className="text-lg mb-2">{t("title", { tab: tabLabel })}</p>

      {helperMessage && (
        <p className="text-sm text-gray-500">{helperMessage}</p>
      )}
    </div>
  );
}
