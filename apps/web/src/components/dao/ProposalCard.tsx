"use client";

import { CheckCircle, ChevronRight, Clock, XCircle } from "lucide-react";
import React from "react";
import {
  CATEGORY_COLORS,
  calculateQuorumProgress,
  calculateVotePercentages,
} from "@/lib/dao";
import type { Proposal } from "@/types/dao";

interface ProposalCardProps {
  proposal: Proposal;
  isDetailed?: boolean;
  onClick?: () => void;
}

export default function ProposalCard({
  proposal,
  isDetailed = false,
  onClick,
}: ProposalCardProps) {
  const { forPercentage, againstPercentage, totalVotes } =
    calculateVotePercentages(proposal);
  const { quorumProgress } = calculateQuorumProgress(proposal);

  // 兼容 API 返回的大写状态和转换后的小写状态
  const status = (proposal as any).status;
  const isActive = status === "Active" || status === "active";
  const isPassed = status === "Succeeded" || status === "passed";
  const isRejected = status === "Failed" || status === "rejected";
  const isExecuted = status === "Executed" || status === "executed";
  const isCancelled = status === "Canceled" || status === "cancelled";

  return (
    <div
      className={`bg-white/90 backdrop-blur-md rounded-2xl ${
        isDetailed ? "border-2 border-purple-300" : "border border-gray-200"
      } p-6 hover:border-purple-400 hover:shadow-xl transition-all duration-300 ${
        !isDetailed ? "cursor-pointer" : ""
      }`}
      onClick={() => !isDetailed && onClick?.()}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                CATEGORY_COLORS[proposal.category] || "bg-gray-500"
              }`}
            >
              {proposal.category}
            </span>
            {isActive && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                进行中
              </span>
            )}
            {isPassed && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                已通过
              </span>
            )}
            {isRejected && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                未通过
              </span>
            )}
            {isExecuted && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                已执行
              </span>
            )}
            {isCancelled && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                已取消
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {proposal.title}
          </h3>
          <p className="text-gray-600 mb-3 leading-relaxed">
            {proposal.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>提议者: {proposal.author}</span>
            {proposal.endTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                截止: {proposal.endTime}
              </span>
            )}
          </div>
        </div>
        {!isDetailed && (
          <ChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
        )}
      </div>

      {isActive && (
        <>
          <div className="space-y-3 mb-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-green-600 font-semibold">
                  支持 {forPercentage}%
                </span>
                <span className="text-gray-600">
                  {proposal.votesFor.toLocaleString()} 票
                </span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${forPercentage}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-red-600 font-semibold">
                  反对 {againstPercentage}%
                </span>
                <span className="text-gray-600">
                  {proposal.votesAgainst.toLocaleString()} 票
                </span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${againstPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-700 font-medium">法定人数进度</span>
              <span className="text-gray-600">
                {totalVotes.toLocaleString()} /{" "}
                {proposal.quorum.toLocaleString()}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(quorumProgress, 100)}%` }}
              />
            </div>
          </div>

          {/* 提示用户点击查看详情进行投票 */}
          {!isDetailed && (
            <div className="pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                点击查看详情并投票 →
              </p>
            </div>
          )}
        </>
      )}

      {(isPassed || isRejected || isExecuted || isCancelled) && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-green-600 font-semibold">
              支持: {proposal.votesFor.toLocaleString()} 票
            </span>
            <span className="text-red-600 font-semibold">
              反对: {proposal.votesAgainst.toLocaleString()} 票
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
