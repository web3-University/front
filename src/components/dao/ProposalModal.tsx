"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Proposal } from "@/lib/api/dao";
import ProposalCard from "./ProposalCard";
import { formatUnits } from "viem";
import { getUserVote, VoteOption } from "@/lib/api/dao";
import type { Vote } from "@/lib/api/dao";

/**
 * 📋 提案详情模态框
 *
 * 功能：
 * 1. 展示提案完整信息
 * 2. 处理用户投票
 * 3. 显示用户投票状态和权重
 * 4. 支持执行提案和领取奖励
 */

interface ProposalModalProps {
  proposal: Proposal | null;
  onClose: () => void;
  onVote?: (proposalId: number, option: VoteOption) => Promise<void>;
  isVoting?: boolean;
  userAddress?: string;
  userVotingPower?: bigint;
  onClaimReward?: (proposalId: number) => Promise<void>;
  onFinalize?: (proposalId: number) => Promise<void>;
  daoAddress?: string;
}

export default function ProposalModal({
  proposal,
  onClose,
  onVote,
  isVoting = false,
  userAddress,
  userVotingPower,
  onClaimReward,
  onFinalize,
  daoAddress = "0x5E3Ab3256cfa5C89bEb63DbB8e12ba42d63F216f",
}: ProposalModalProps) {
  const t = useTranslations("dao.proposalModal");
  // ==================== 状态管理 ====================
  const [userVote, setUserVote] = useState<Vote | null>(null);
  const [loadingVoteStatus, setLoadingVoteStatus] = useState(false);
  const [isClaimingReward, setIsClaimingReward] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);

  // ==================== 生命周期 ====================

  // 当提案或用户地址变化时，获取投票状态
  useEffect(() => {
    if (proposal && userAddress) {
      const isActive = checkIfActive(proposal);
      if (isActive) {
        fetchUserVoteStatus();
      } else {
        setUserVote(null);
      }
    } else {
      setUserVote(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposal?.proposalId, userAddress]);

  // ==================== 业务逻辑 ====================

  /**
   * 检查提案是否处于活跃状态
   */
  const checkIfActive = (prop: Proposal): boolean => {
    const status = (prop as any).status?.toLowerCase();
    return status === "active";
  };

  /**
   * 获取用户对当前提案的投票状态
   */
  const fetchUserVoteStatus = async () => {
    if (!proposal || !userAddress) return;

    setLoadingVoteStatus(true);
    try {
      const res = await getUserVote(proposal.proposalId, userAddress);
      if (res?.data) {
        setUserVote(res.data);
      } else {
        setUserVote(null);
      }
    } catch (error) {
      console.error("获取投票状态失败:", error);
      setUserVote(null);
    } finally {
      setLoadingVoteStatus(false);
    }
  };

  /**
   * 处理投票
   */
  const handleVote = async (option: VoteOption) => {
    if (!onVote || !proposal) return;

    try {
      await onVote(proposal.proposalId, option);
      // 投票成功后重新获取投票状态
      await fetchUserVoteStatus();
    } catch (error) {
      console.error("投票失败:", error);
    }
  };

  /**
   * 处理领取奖励
   */
  const handleClaimReward = async () => {
    if (!onClaimReward || !proposal) return;

    setIsClaimingReward(true);
    try {
      await onClaimReward(proposal.proposalId);
    } catch (error) {
      console.error("领取奖励失败:", error);
    } finally {
      setIsClaimingReward(false);
    }
  };

  /**
   * 处理执行提案
   */
  const handleFinalize = async () => {
    if (!onFinalize || !proposal) return;

    setIsFinalizing(true);
    try {
      await onFinalize(proposal.proposalId);
    } catch (error) {
      console.error("执行提案失败:", error);
    } finally {
      setIsFinalizing(false);
    }
  };

  // ==================== 辅助方法 ====================

  /**
   * 获取状态显示信息
   */
  const getStatusDisplay = (status: string) => {
    const normalized = status?.toLowerCase() ?? "unknown";
    const statusMap: Record<string, { key: string; color: string }> = {
      active: { key: "status.active", color: "text-green-600" },
      succeeded: { key: "status.passed", color: "text-blue-600" },
      passed: { key: "status.passed", color: "text-blue-600" },
      executed: { key: "status.executed", color: "text-purple-600" },
      failed: { key: "status.rejected", color: "text-red-600" },
      rejected: { key: "status.rejected", color: "text-red-600" },
      canceled: { key: "status.canceled", color: "text-gray-600" },
      cancelled: { key: "status.canceled", color: "text-gray-600" },
    };

    const entry = statusMap[normalized] || {
      key: "status.default",
      color: "text-gray-600",
    };
    return {
      label: t(entry.key, { status }),
      color: entry.color,
    };
  };

  // ==================== 渲染 ====================

  if (!proposal) return null;

  // 检查用户是否已投票
  const hasVoted = !!userVote;

  // 格式化投票权重
  const votingPowerDisplay = userVotingPower
    ? formatUnits(userVotingPower, 18)
    : "0";

  // 检查提案是否处于活跃状态
  const isActive = checkIfActive(proposal);

  // 获取状态显示
  const statusDisplay = getStatusDisplay((proposal as any).status);

  // 检查是否可以执行提案
  const canExecute =
    (proposal as any).status === "Succeeded" ||
    (proposal as any).status === "passed";

  // 检查是否可以领取奖励（假设规则：已投票且提案已执行）
  const canClaimReward =
    hasVoted &&
    ((proposal as any).status === "Executed" ||
      (proposal as any).status === "executed");

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50 p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-gray-50 to-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          {/* 头部 */}
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t("title")}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-3xl font-light leading-none hover:rotate-90 transition-all duration-300"
              aria-label={t("closeLabel")}
            >
              ×
            </button>
          </div>

          {/* 提案卡片 */}
          <ProposalCard
            proposal={proposal}
            daoAddress={daoAddress}
            isDetailed={true}
          />

          {/* 活跃提案：投票区域 */}
          {isActive && (
            <div className="mt-8 space-y-4">
              {/* 用户投票信息 */}
              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">
                  {t("votingInfo.heading")}
                </h3>
                {loadingVoteStatus ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                    <span className="ml-2 text-gray-600">
                      {t("votingInfo.loading")}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {t("votingInfo.weightLabel")}
                      </span>
                      <span className="font-bold text-gray-900 text-lg">
                        {t("votingInfo.weightValue", {
                          votes: votingPowerDisplay,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {t("votingInfo.statusLabel")}
                      </span>
                      <span
                        className={`font-bold ${hasVoted ? "text-green-600" : "text-orange-600"}`}
                      >
                        {hasVoted
                          ? t("votingInfo.status.voted")
                          : t("votingInfo.status.notVoted")}
                      </span>
                    </div>
                    {hasVoted && userVote && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">
                            {t("votingInfo.choiceLabel")}
                          </span>
                          <span
                            className={`font-bold ${userVote.option === VoteOption.For ? "text-green-600" : "text-red-600"}`}
                          >
                            {userVote.option === VoteOption.For
                              ? t("votingInfo.choice.for")
                              : t("votingInfo.choice.against")}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">
                            {t("votingInfo.powerLabel")}
                          </span>
                          <span className="font-bold text-gray-700">
                            {t("votingInfo.powerValue", {
                              power: parseFloat(
                                userVote.votingPower,
                              ).toLocaleString(),
                            })}
                          </span>
                        </div>
                      </>
                    )}
                    {userAddress && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">
                          {t("votingInfo.walletLabel")}
                        </span>
                        <span className="font-mono text-xs text-gray-700">
                          {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 投票按钮 */}
              {userAddress ? (
                <div className="flex gap-4">
                  <button
                    onClick={() => handleVote(VoteOption.For)}
                    disabled={
                      isVoting ||
                      hasVoted ||
                      !userVotingPower ||
                      userVotingPower === BigInt(0)
                    }
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2"
                  >
                    {isVoting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>{t("votingButtons.loading")}</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{t("votingButtons.for")}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleVote(VoteOption.Against)}
                    disabled={
                      isVoting ||
                      hasVoted ||
                      !userVotingPower ||
                      userVotingPower === BigInt(0)
                    }
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2"
                  >
                    {isVoting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>{t("votingButtons.loading")}</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        <span>{t("votingButtons.against")}</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
                  <p className="text-yellow-800 font-medium">
                    {t("alerts.connectWalletToVote")}
                  </p>
                </div>
              )}

              {/* 投票提示 */}
              {userVotingPower === BigInt(0) && userAddress && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <p className="text-orange-800 text-sm">
                    <strong>{t("alerts.tipLabel")}</strong>{" "}
                    {t("alerts.noVotingPower")}
                  </p>
                </div>
              )}

              {hasVoted && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-blue-800 text-sm">
                    <strong>{t("alerts.noticeLabel")}</strong>{" "}
                    {t("alerts.alreadyVoted")}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 已结束的提案：显示最终结果和操作按钮 */}
          {!isActive && (
            <div className="mt-8 space-y-4">
              {/* 最终结果 */}
              <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">
                  {t("results.heading")}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {t("results.finalStatus")}
                    </span>
                    <span
                      className={`font-bold text-lg ${statusDisplay.color}`}
                    >
                      {statusDisplay.label}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-600 font-semibold">
                      {t("results.forLabel")}
                    </span>
                    <span className="font-bold text-gray-900">
                      {t("results.voteValue", {
                        count: proposal.forVotes.toLocaleString(),
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-red-600 font-semibold">
                      {t("results.againstLabel")}
                    </span>
                    <span className="font-bold text-gray-900">
                      {t("results.voteValue", {
                        count: proposal.againstVotes.toLocaleString(),
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-4">
                {/* 执行提案按钮 */}
                {canExecute && onFinalize && (
                  <button
                    onClick={handleFinalize}
                    disabled={isFinalizing}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isFinalizing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>{t("actions.executing")}</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        <span>{t("actions.execute")}</span>
                      </>
                    )}
                  </button>
                )}

                {/* 领取奖励按钮 */}
                {canClaimReward && onClaimReward && (
                  <button
                    onClick={handleClaimReward}
                    disabled={isClaimingReward}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isClaimingReward ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>{t("actions.claiming")}</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{t("actions.claim")}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
