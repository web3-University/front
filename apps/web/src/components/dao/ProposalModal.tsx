"use client";

import React, { useState, useEffect } from "react";
import { Proposal } from "@/types/dao";
import ProposalCard from "./ProposalCard";
import { formatUnits } from "viem";
import { getUserVote, VoteOption } from "@/lib/api/dao";
import type { Vote } from "@/lib/api/dao";

interface ProposalModalProps {
  proposal: Proposal | null;
  onClose: () => void;
  onVote?: (proposalId: number, option: VoteOption) => Promise<void>;
  isVoting?: boolean;
  userAddress?: string;
  userVotingPower?: bigint;
  onClaimReward?: (proposalId: number) => Promise<void>;
  onFinalize?: (proposalId: number) => Promise<void>;
}

export default function ProposalModal({
  proposal,
  onClose,
  onVote,
  isVoting = false,
  userAddress,
  userVotingPower,
}: ProposalModalProps) {
  const [userVote, setUserVote] = useState<Vote | null>(null);
  const [loadingVoteStatus, setLoadingVoteStatus] = useState(false);

  // 当提案或用户地址变化时,获取投票状态
  useEffect(() => {
    // 注意: API返回的状态是大写的 "Active"
    if (proposal && userAddress) {
      // 检查原始API状态或转换后的状态
      const isActive =
        (proposal as any).status === "Active" ||
        (proposal as any).status === "active";
      if (isActive) {
        fetchUserVoteStatus();
      } else {
        setUserVote(null);
      }
    } else {
      setUserVote(null);
    }
  }, [proposal?.id, userAddress]);

  /**
   * 获取用户对当前提案的投票状态
   */
  const fetchUserVoteStatus = async () => {
    if (!proposal || !userAddress) return;

    setLoadingVoteStatus(true);
    try {
      const res = await getUserVote(proposal.id, userAddress);
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

  if (!proposal) return null;

  const handleVote = async (option: VoteOption) => {
    if (!onVote) return;

    try {
      await onVote(proposal.id, option);
      // 投票成功后重新获取投票状态
      await fetchUserVoteStatus();
    } catch (error) {
      console.error("投票失败:", error);
    }
  };

  // 检查用户是否已投票
  const hasVoted = !!userVote;

  // 格式化投票权重
  const votingPowerDisplay = userVotingPower
    ? formatUnits(userVotingPower, 18)
    : "0";

  // 检查提案是否处于活跃状态
  const isActive =
    (proposal as any).status === "Active" ||
    (proposal as any).status === "active";

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50 p-6"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-gray-50 to-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-3xl font-bold text-gray-900">提案详情</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-3xl font-light leading-none hover:rotate-90 transition-all duration-300"
            >
              ×
            </button>
          </div>

          <ProposalCard proposal={proposal} isDetailed={false} />

          {/* 投票信息区域 - 仅在提案活跃时显示 */}
          {isActive && (
            <div className="mt-8 space-y-4">
              {/* 用户投票权重信息 */}
              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">
                  投票信息
                </h3>
                {loadingVoteStatus ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                    <span className="ml-2 text-gray-600">加载投票状态...</span>
                  </div>
                ) : (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">您的投票权重:</span>
                      <span className="font-bold text-gray-900 text-lg">
                        {votingPowerDisplay} 票
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">投票状态:</span>
                      <span
                        className={`font-bold ${hasVoted ? "text-green-600" : "text-orange-600"}`}
                      >
                        {hasVoted ? "已投票" : "未投票"}
                      </span>
                    </div>
                    {hasVoted && userVote && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">您的选择:</span>
                        <span
                          className={`font-bold ${userVote.option === VoteOption.For ? "text-green-600" : "text-red-600"}`}
                        >
                          {userVote.option === VoteOption.For
                            ? "✓ 支持课程"
                            : "✗ 反对课程"}
                        </span>
                      </div>
                    )}
                    {hasVoted && userVote && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">投票权重:</span>
                        <span className="font-bold text-gray-700">
                          {parseFloat(userVote.votingPower).toLocaleString()} YD
                        </span>
                      </div>
                    )}
                    {userAddress && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">钱包地址:</span>
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
                        <span>投票中...</span>
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
                        <span>支持课程</span>
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
                        <span>投票中...</span>
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
                        <span>反对课程</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
                  <p className="text-yellow-800 font-medium">
                    请先连接钱包以进行投票
                  </p>
                </div>
              )}

              {/* 投票提示 */}
              {userVotingPower === BigInt(0) && userAddress && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <p className="text-orange-800 text-sm">
                    <strong>提示:</strong> 您当前没有投票权重,请先获取 YD Token
                  </p>
                </div>
              )}

              {hasVoted && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-blue-800 text-sm">
                    <strong>注意:</strong> 您已对此提案投票,无法再次投票
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 已结束的提案显示最终结果 */}
          {!isActive && (
            <div className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">投票结果</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">最终状态:</span>
                  <span
                    className={`font-bold text-lg ${
                      (proposal as any).status === "Succeeded" ||
                      (proposal as any).status === "Executed" ||
                      (proposal as any).status === "passed" ||
                      (proposal as any).status === "executed"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {((proposal as any).status === "Succeeded" ||
                      (proposal as any).status === "passed") &&
                      "通过"}
                    {((proposal as any).status === "Failed" ||
                      (proposal as any).status === "rejected") &&
                      "未通过"}
                    {((proposal as any).status === "Executed" ||
                      (proposal as any).status === "executed") &&
                      "已执行"}
                    {((proposal as any).status === "Canceled" ||
                      (proposal as any).status === "cancelled") &&
                      "已取消"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-semibold">支持票:</span>
                  <span className="font-bold text-gray-900">
                    {proposal.votesFor.toLocaleString()} 票
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-600 font-semibold">反对票:</span>
                  <span className="font-bold text-gray-900">
                    {proposal.votesAgainst.toLocaleString()} 票
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
