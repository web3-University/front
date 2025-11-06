"use client";

import { useEffect } from "react";
import { Proposal } from "@/lib/api/dao";
import { useDAO } from "@web3-university/uni-wallet-lib";

/**
 * 📋 提案卡片组件
 *
 * 功能：
 * 1. 展示提案基本信息
 * 2. 从链上获取实时投票数据
 * 3. 支持点击查看详情
 *
 * 关键点：
 * - 使用 useDAO().getProposal() 获取链上数据
 * - 通过 onChainDataUpdate 回调更新全局状态
 * - 优先显示链上数据，降级显示 API 数据
 */

interface ProposalCardProps {
  proposal: Proposal;
  onClick?: () => void;
  daoAddress?: string;
  isDetailed?: boolean;
  onChainDataUpdate?: (proposalId: number, chainData: any) => void;
}

export default function ProposalCard({
  proposal,
  onClick,
  daoAddress = "0x5E3Ab3256cfa5C89bEb63DbB8e12ba42d63F216f",
  isDetailed = false,
  onChainDataUpdate,
}: ProposalCardProps) {
  // 获取 DAO 合约实例
  const dao = useDAO({ address: daoAddress as `0x${string}` });

  // ✅ 从链上获取提案数据
  const chainProposal = dao.getProposal(proposal.proposalId.toString());

  // 监听链上数据变化并更新
  useEffect(() => {
    if (chainProposal.data && onChainDataUpdate) {
      onChainDataUpdate(proposal.proposalId, {
        votesFor: Number(chainProposal.data.votesFor),
        votesAgainst: Number(chainProposal.data.votesAgainst),
        status: chainProposal.data.executed,
        startTime: chainProposal.data.timestamp,
        // endTime: chainProposal.data.endTime,
        // proposer: chainProposal.data.proposer,
      });
    }
  }, [chainProposal.data, proposal.proposalId, onChainDataUpdate]);

  // 决定显示的数据（优先使用链上数据）
  const displayData = chainProposal.data
    ? {
        votesFor: Number(chainProposal.data.votesFor),
        votesAgainst: Number(chainProposal.data.votesAgainst),
        status: chainProposal.data.executed ? "Executed" : "Active",
      }
    : {
        votesFor: Number(proposal.forVotes),
        votesAgainst: Number(proposal.againstVotes),
        status: (proposal as any).status,
      };

  // 计算投票进度
  const totalVotes = displayData.votesFor + displayData.votesAgainst;
  const forPercentage =
    totalVotes > 0 ? (displayData.votesFor / totalVotes) * 100 : 0;
  const againstPercentage =
    totalVotes > 0 ? (displayData.votesAgainst / totalVotes) * 100 : 0;

  // 状态显示映射
  const getStatusInfo = (status: string) => {
    const statusMap: Record<
      string,
      { label: string; color: string; bgColor: string }
    > = {
      Active: {
        label: "进行中",
        color: "text-green-600",
        bgColor: "bg-green-100",
      },
      active: {
        label: "进行中",
        color: "text-green-600",
        bgColor: "bg-green-100",
      },
      Succeeded: {
        label: "通过",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      },
      passed: {
        label: "通过",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      },
      Executed: {
        label: "已执行",
        color: "text-purple-600",
        bgColor: "bg-purple-100",
      },
      executed: {
        label: "已执行",
        color: "text-purple-600",
        bgColor: "bg-purple-100",
      },
      Failed: {
        label: "未通过",
        color: "text-red-600",
        bgColor: "bg-red-100",
      },
      rejected: {
        label: "未通过",
        color: "text-red-600",
        bgColor: "bg-red-100",
      },
      Canceled: {
        label: "已取消",
        color: "text-gray-600",
        bgColor: "bg-gray-100",
      },
      cancelled: {
        label: "已取消",
        color: "text-gray-600",
        bgColor: "bg-gray-100",
      },
    };

    return (
      statusMap[status] || {
        label: status,
        color: "text-gray-600",
        bgColor: "bg-gray-100",
      }
    );
  };

  const statusInfo = getStatusInfo(displayData.status);

  // 简化版卡片（列表视图）
  if (!isDetailed) {
    return (
      <div
        onClick={onClick}
        className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-pink-200 overflow-hidden"
      >
        {/* 背景装饰 */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

        <div className="relative z-10">
          {/* 头部信息 */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-medium text-gray-500">
                  #{proposal.proposalId}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}
                >
                  {statusInfo.label}
                </span>
                {chainProposal.isLoading && (
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400" />
                    同步中
                  </span>
                )}
                {chainProposal.data && !chainProposal.isLoading && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    ✓ 链上数据
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                {proposal.courseId
                  ? `课程[${proposal.courseId}]争议`
                  : proposal.title || "治理提案"}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {proposal.reason}
              </p>
            </div>
          </div>

          {/* 投票数据 */}
          <div className="space-y-3">
            {/* 投票进度条 */}
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
                style={{ width: `${forPercentage}%` }}
              />
              <div
                className="absolute right-0 top-0 h-full bg-gradient-to-l from-red-400 to-red-500 transition-all duration-500"
                style={{ width: `${againstPercentage}%` }}
              />
            </div>

            {/* 投票统计 */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-semibold">
                  ✓ 支持: {displayData.votesFor.toLocaleString()}
                </span>
                <span className="text-gray-400">
                  ({forPercentage.toFixed(1)}%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-600 font-semibold">
                  ✗ 反对: {displayData.votesAgainst.toLocaleString()}
                </span>
                <span className="text-gray-400">
                  ({againstPercentage.toFixed(1)}%)
                </span>
              </div>
            </div>

            {/* 总票数 */}
            <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
              总投票数: {totalVotes.toLocaleString()} 票
            </div>
          </div>
        </div>

        {/* 查看详情提示 */}
        <div className="absolute bottom-4 right-4 text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    );
  }

  // 详细版卡片（模态框视图）
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      {/* 提案信息 */}
      <div className="space-y-4">
        {/* 标题和状态 */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-medium text-gray-500">
              {proposal.courseId ? "争议" : "提案"} #{proposal.proposalId}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}
            >
              {statusInfo.label}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {proposal.courseId
              ? `课程[${proposal.courseId}]争议`
              : proposal.title || "治理提案"}
          </h3>
        </div>

        {/* 描述 */}
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">{proposal.reason}</p>
        </div>

        {/* 投票统计 */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
          <h4 className="font-bold text-gray-900 mb-4">投票统计</h4>

          {/* 进度条 */}
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
              style={{ width: `${forPercentage}%` }}
            />
            <div
              className="absolute right-0 top-0 h-full bg-gradient-to-l from-red-400 to-red-500 transition-all duration-500"
              style={{ width: `${againstPercentage}%` }}
            />
          </div>

          {/* 详细数据 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {displayData.votesFor.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                支持票 ({forPercentage.toFixed(1)}%)
              </div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600 mb-1">
                {displayData.votesAgainst.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                反对票 ({againstPercentage.toFixed(1)}%)
              </div>
            </div>
          </div>

          {/* 总计 */}
          <div className="mt-4 pt-4 border-t border-gray-200 text-center">
            <span className="text-gray-600">总投票数: </span>
            <span className="font-bold text-gray-900">
              {totalVotes.toLocaleString()} 票
            </span>
          </div>

          {/* 数据来源 */}
          <div className="mt-4 text-xs text-center">
            {chainProposal.isLoading && (
              <span className="text-gray-400 flex items-center justify-center gap-1">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400" />
                正在同步链上数据...
              </span>
            )}
            {chainProposal.data && !chainProposal.isLoading && (
              <span className="text-green-600">✓ 链上数据已同步</span>
            )}
            {!chainProposal.data && !chainProposal.isLoading && (
              <span className="text-gray-400">显示 API 缓存数据</span>
            )}
          </div>
        </div>

        {/* 提案元数据 */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-gray-500 mb-1">提案类型</div>
            <div className="font-medium text-gray-900">{proposal.type}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-gray-500 mb-1">提案人</div>
            <div className="font-mono text-xs text-gray-900">
              {proposal.proposer
                ? `${proposal.proposer.slice(0, 6)}...${proposal.proposer.slice(-4)}`
                : "未知"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
