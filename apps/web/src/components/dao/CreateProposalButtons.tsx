"use client";

import React, { useMemo } from "react";

import { useTranslation } from "@/i18n/hooks";
import { DaoTabKey } from "@/types/dao";

interface CreateProposalButtonsProps {
  activeTab: DaoTabKey;
  isConnected: boolean;
  isCreating: boolean;
  onCreateProposal: () => void;
  onCreateDispute: () => void;
}

/**
 * ➕ 创建提案按钮组件
 */
export function CreateProposalButtons({
  activeTab,
  isConnected,
  isCreating,
  onCreateProposal,
  onCreateDispute,
}: CreateProposalButtonsProps) {
  const tButtons = useTranslation("daoCreateButtons");
  const tPurchase = useTranslation("purchase");
  const tDisputeModal = useTranslation("daoDisputeModal");

  const proposalButtonLabel = useMemo(() => {
    if (!isConnected) return tPurchase("connectWalletFirst");
    if (isCreating) return tDisputeModal("actions.submitting");
    return tButtons("submitProposal");
  }, [isConnected, isCreating, tButtons, tDisputeModal, tPurchase]);

  const disputeButtonLabel = useMemo(() => {
    if (!isConnected) return tPurchase("connectWalletFirst");
    if (isCreating) return tDisputeModal("actions.submitting");
    return tButtons("submitDispute");
  }, [isConnected, isCreating, tButtons, tDisputeModal, tPurchase]);

  if (activeTab === "history") {
    return null;
  }

  if (activeTab === "proposal") {
    return (
      <div className="flex justify-end mb-8">
        <button
          onClick={onCreateProposal}
          disabled={!isConnected || isCreating}
          className="group px-6 py-2.5 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white rounded-lg font-medium shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-300 hover:scale-[1.02] flex items-center gap-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <span className="text-base font-light">+</span>
          <span>{proposalButtonLabel}</span>
        </button>
      </div>
    );
  }

  if (activeTab === "dispute") {
    return (
      <div className="flex justify-end mb-8">
        <button
          onClick={onCreateDispute}
          disabled={!isConnected || isCreating}
          className="group px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300 hover:scale-[1.02] flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>{disputeButtonLabel}</span>
        </button>
      </div>
    );
  }

  return null;
}
