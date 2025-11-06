"use client";

import React from "react";
import { formatUnits } from "viem";

interface DAOConfigInfoProps {
  createFee?: number;
  tokenBalance?: bigint;
  votingPeriod?: number;
  allowance?: bigint;
}

/**
 * 📊 DAO 配置信息展示组件
 */
export function DAOConfigInfo({
  createFee,
  tokenBalance,
  votingPeriod,
  allowance,
}: DAOConfigInfoProps) {
  if (!createFee || !votingPeriod) {
    return null;
  }

  const hasEnoughBalance =
    tokenBalance && createFee && tokenBalance >= createFee;
  const isApproved = allowance && createFee && allowance >= createFee;

  return (
    <div className="mb-6 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <div className="text-gray-400 mb-1">提案押金</div>
          <div className="text-white font-semibold">
            {formatUnits(BigInt(createFee), 18)} YD
          </div>
        </div>

        <div>
          <div className="text-gray-400 mb-1">您的余额</div>
          <div
            className={`font-semibold ${
              hasEnoughBalance ? "text-green-400" : "text-red-400"
            }`}
          >
            {tokenBalance ? formatUnits(tokenBalance, 18) : "0"} YD
          </div>
        </div>

        <div>
          <div className="text-gray-400 mb-1">投票期限</div>
          <div className="text-white font-semibold">
            {Number(votingPeriod) / 86400} 天
          </div>
        </div>

        <div>
          <div className="text-gray-400 mb-1">授权状态</div>
          <div
            className={`font-semibold ${
              isApproved ? "text-green-400" : "text-yellow-400"
            }`}
          >
            {isApproved ? "✅ 已授权" : "❌ 未授权"}
          </div>
        </div>
      </div>
    </div>
  );
}
