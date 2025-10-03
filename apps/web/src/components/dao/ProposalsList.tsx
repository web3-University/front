"use client";

import React, { useState } from "react";
import { Proposal, ProposalsByStatus, ProposalTabKey } from "@/types/dao";
import { PROPOSAL_TABS } from "@/lib/dao";
import ProposalCard from "./ProposalCard";
import ProposalModal from "./ProposalModal";

// 模拟数据（后续可以移到 API 调用或 hooks 中）
const mockProposals: ProposalsByStatus = {
  active: [
    {
      id: 1,
      title: "调整课程上架质量标准",
      description: "提议将课程上架门槛从80分提升至85分，以确保平台内容质量",
      author: "0x1234...5678",
      startTime: "2025-09-25",
      endTime: "2025-10-05",
      status: "active",
      votesFor: 45000,
      votesAgainst: 12000,
      quorum: 100000,
      category: "课程规则",
    },
    {
      id: 2,
      title: "优秀教师奖励机制调整",
      description: "建议将教师月度奖励池从10,000 Token增加至15,000 Token",
      author: "0xabcd...efgh",
      startTime: "2025-09-28",
      endTime: "2025-10-08",
      status: "active",
      votesFor: 38000,
      votesAgainst: 8000,
      quorum: 100000,
      category: "奖励分配",
    },
    {
      id: 3,
      title: "NFT学习凭证设计优化",
      description: "提议更新NFT凭证视觉设计，增加稀有度分级机制",
      author: "0x9876...4321",
      startTime: "2025-09-30",
      endTime: "2025-10-10",
      status: "active",
      votesFor: 25000,
      votesAgainst: 15000,
      quorum: 100000,
      category: "NFT规则",
    },
  ],
  passed: [
    {
      id: 4,
      title: "引入课程退款机制",
      description: "允许学生在课程开始7天内无条件退款",
      author: "0x5555...6666",
      startTime: "2025-09-10",
      endTime: "2025-09-20",
      status: "passed",
      votesFor: 85000,
      votesAgainst: 15000,
      quorum: 100000,
      category: "平台规则",
    },
  ],
  rejected: [
    {
      id: 5,
      title: "降低课程最低定价",
      description: "建议将最低定价从0.01 ETH降至0.005 ETH",
      author: "0x7777...8888",
      startTime: "2025-09-08",
      endTime: "2025-09-18",
      status: "rejected",
      votesFor: 30000,
      votesAgainst: 70000,
      quorum: 100000,
      category: "定价规则",
    },
  ],
};

export default function ProposalsList() {
  const [activeTab, setActiveTab] = useState<ProposalTabKey>("active");
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null,
  );

  return (
    <section className="relative">
      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20">
        {PROPOSAL_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-6 py-4 font-semibold rounded-xl transition-all duration-300 ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
                : "text-gray-300 hover:text-white hover:bg-white/10"
            }`}
          >
            {tab.label} ({mockProposals[tab.key].length})
          </button>
        ))}
      </div>

      {/* Proposals List */}
      <div className="space-y-6">
        {mockProposals[activeTab].map((proposal) => (
          <ProposalCard
            key={proposal.id}
            proposal={proposal}
            onClick={() => setSelectedProposal(proposal)}
          />
        ))}
      </div>

      {/* Modal */}
      <ProposalModal
        proposal={selectedProposal}
        onClose={() => setSelectedProposal(null)}
      />
    </section>
  );
}
