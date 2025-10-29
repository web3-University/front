"use client";

import { useEffect } from "react";
import { Proposal } from "@/lib/api/dao";
import { useDao } from "@web3-university/uni-wallet-lib";

/**
 * 📋 提案卡片组件（示例）
 *
 * 演示如何正确地在组件层面获取链上数据
 *
 * 关键点：
 * 1. useDao().getProposal() 在组件顶层调用（遵守 React hooks 规则）
 * 2. 使用 useEffect 监听链上数据变化
 * 3. 调用 updateProposalWithChainData 更新全局状态
 */

interface ProposalCardProps {
  proposal: Proposal;
  daoAddress: string;
  onChainDataUpdate?: (proposalId: number, chainData: any) => void;
}

export default function ProposalCard({
  proposal,
  daoAddress,
  onChainDataUpdate,
}: ProposalCardProps) {
  const dao = useDao(daoAddress as `0x${string}`);

  // ✅ 正确：在组件顶层调用 hook
  // 注意：Proposal 使用 proposalId 字段
  const chainProposal = dao.getProposal(proposal.proposalId.toString());

  // 监听链上数据变化
  useEffect(() => {
    if (chainProposal.data && onChainDataUpdate) {
      // 更新全局状态
      onChainDataUpdate(proposal.proposalId, {
        forVotes: Number(chainProposal.data.forVotes),
        againstVotes: Number(chainProposal.data.againstVotes),
        status: chainProposal.data.status,
        startTime: chainProposal.data.startTime,
        endTime: chainProposal.data.endTime,
        proposer: chainProposal.data.proposer,
      });
    }
  }, [chainProposal.data, proposal.proposalId, onChainDataUpdate]);

  // 显示链上数据（如果有）或 API 数据
  // 注意：forVotes 和 againstVotes 在 Proposal 中是 string 类型
  const displayData = chainProposal.data
    ? {
        forVotes: Number(chainProposal.data.forVotes),
        againstVotes: Number(chainProposal.data.againstVotes),
      }
    : {
        forVotes: Number(proposal.forVotes),
        againstVotes: Number(proposal.againstVotes),
      };

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* 提案标题 */}
      <h3 className="text-lg font-semibold mb-2">
        提案 #{proposal.proposalId}
      </h3>

      {/* 提案原因 */}
      <p className="text-gray-600 mb-4 line-clamp-2">{proposal.reason}</p>

      {/* 投票数据 */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-green-600 font-semibold">
            👍 {displayData.forVotes}
          </span>
          <span className="text-gray-500">赞成</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-red-600 font-semibold">
            👎 {displayData.againstVotes}
          </span>
          <span className="text-gray-500">反对</span>
        </div>
      </div>

      {/* 链上数据加载状态 */}
      {chainProposal.isLoading && (
        <div className="mt-2 text-xs text-gray-400">🔄 正在同步链上数据...</div>
      )}

      {/* 数据来源提示 */}
      {chainProposal.data && (
        <div className="mt-2 text-xs text-green-600">✅ 链上数据已同步</div>
      )}
    </div>
  );
}
