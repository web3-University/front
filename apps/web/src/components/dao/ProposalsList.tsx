"use client";

import React, { useState } from "react";
import { ChevronRight, Clock, CheckCircle, XCircle } from "lucide-react";
import { Proposal, ProposalStatus } from "@/types";
import { CATEGORY_COLORS } from "@/lib/dao/constants";
import {
  calculateVotingResult,
  formatVoteCount,
  getTimeRemaining,
} from "@/lib/dao/utils";

// 模拟数据
const mockProposals: Proposal[] = [
  {
    id: 1,
    title: "新增区块链开发高级课程",
    description:
      "提议新增一门深度讲解以太坊智能合约开发的高级课程，包含 Solidity、Hardhat、测试等内容。",
    category: "课程购买",
    status: "active",
    votesFor: 750,
    votesAgainst: 740,
    quorum: 2000,
    endTime: "2026-02-15T23:59:59Z",
    proposer: "0x1234567890abcdef1234567890abcdef12345678",
    createdAt: "2024-02-01T10:00:00Z",
  },
  {
    id: 2,
    title: "社区贡献者季度奖励分配方案",
    description:
      "根据本季度社区贡献者的活跃度和贡献值，提议按比例分配 10000 USDT 奖励。",
    category: "奖励分配",
    status: "passed",
    votesFor: 1800,
    votesAgainst: 150,
    quorum: 2000,
    endTime: "2025-01-30T23:59:59Z",
    proposer: "0xabcdef1234567890abcdef1234567890abcdef12",
    createdAt: "2024-01-15T14:30:00Z",
    executedAt: "2024-01-31T10:00:00Z",
  },
  {
    id: 3,
    title: "限量版学习成就 NFT 铸造",
    description: "为完成所有高级课程的学员铸造限量版成就 NFT，总量 500 个。",
    category: "NFT铸造",
    status: "active",
    votesFor: 980,
    votesAgainst: 120,
    quorum: 1500,
    endTime: "2026-02-20T23:59:59Z",
    proposer: "0x9876543210fedcba9876543210fedcba98765432",
    createdAt: "2024-02-05T09:15:00Z",
  },
  {
    id: 4,
    title: "修改提案投票时长为 14 天",
    description:
      "当前提案投票时长为 7 天，建议延长至 14 天以便更多成员参与投票。",
    category: "平台规则",
    status: "rejected",
    votesFor: 890,
    votesAgainst: 1560,
    quorum: 2000,
    endTime: "2024-01-25T23:59:59Z",
    proposer: "0xfedcba9876543210fedcba9876543210fedcba98",
    createdAt: "2024-01-10T16:45:00Z",
  },
];

export default function ProposalsList() {
  const [activeTab, setActiveTab] = useState<ProposalStatus>("active");
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null,
  );

  // 根据状态筛选提案
  const filteredProposals = mockProposals.filter((p) => p.status === activeTab);

  // ProposalCard 组件
  const ProposalCard = ({
    proposal,
    isDetailed = false,
  }: {
    proposal: Proposal;
    isDetailed?: boolean;
  }) => {
    const result = calculateVotingResult(proposal);

    return (
      <div
        className={`bg-white/90 backdrop-blur-md rounded-2xl ${
          isDetailed ? "border-2 border-purple-300" : "border border-gray-200"
        } p-6 hover:border-purple-200 transition-all cursor-pointer`}
        onClick={() => !isDetailed && setSelectedProposal(proposal)}
      >
        {/* 头部：类别和状态 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${CATEGORY_COLORS[proposal.category]}`}
            >
              {proposal.category}
            </span>
          </div>

          {proposal.status === "active" && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
              进行中
            </span>
          )}
          {proposal.status === "passed" && (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
          {proposal.status === "rejected" && (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
        </div>

        {/* 标题 */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {proposal.title}
        </h3>

        {/* 描述 */}
        <p className="text-gray-600 mb-4 line-clamp-2">
          {proposal.description}
        </p>

        {/* 投票进度 */}
        <div className="space-y-2 mb-4">
          {/* 赞成 */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">赞成</span>
            <span className="font-semibold text-green-600">
              {formatVoteCount(proposal.votesFor)} ({result.forPercentage}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${result.forPercentage}%` }}
            />
          </div>

          {/* 法定人数进度 */}
          <div className="flex items-center justify-between text-sm mt-3">
            <span className="text-gray-600">法定人数进度</span>
            <span className="font-semibold text-purple-600">
              {formatVoteCount(result.totalVotes)} /{" "}
              {formatVoteCount(proposal.quorum)} ({result.quorumProgress}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(result.quorumProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* 底部信息 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{getTimeRemaining(proposal.endTime)}</span>
          </div>

          {!isDetailed && <ChevronRight className="w-5 h-5 text-gray-400" />}
        </div>
      </div>
    );
  };

  return (
    <section className="relative">
      {/* 标签页切换 */}
      <div className="flex gap-2 mb-8 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20">
        {(["active", "passed", "rejected"] as ProposalStatus[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              activeTab === tab
                ? "bg-white text-purple-600 shadow-lg"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            {tab === "active" && `进行中 (${filteredProposals.length})`}
            {tab === "passed" && `已通过 (${filteredProposals.length})`}
            {tab === "rejected" && `未通过 (${filteredProposals.length})`}
          </button>
        ))}
      </div>

      {/* 提案列表 */}
      <div className="space-y-6">
        {filteredProposals.length > 0 ? (
          filteredProposals.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))
        ) : (
          <div className="text-center py-12 bg-white/90 backdrop-blur-md rounded-2xl">
            <p className="text-gray-500 text-lg">暂无提案</p>
          </div>
        )}
      </div>

      {/* 提案详情弹窗 */}
      {selectedProposal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedProposal(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={() => setSelectedProposal(null)}
              className="float-right text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>

            {/* 详细内容 */}
            <ProposalCard proposal={selectedProposal} isDetailed={true} />

            {/* 投票按钮（仅进行中的提案显示） */}
            {selectedProposal.status === "active" && (
              <div className="flex gap-4 mt-6">
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-xl transition-all">
                  投赞成票
                </button>
                <button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-xl transition-all">
                  投反对票
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
