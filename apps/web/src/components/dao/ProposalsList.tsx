"use client";

import React, { useState } from "react";
import {
  Proposal,
  ProposalsByStatus,
  DaoByStatus,
  ProposalTabKey,
  DaoTabKey,
} from "@/types/dao";
import { PROPOSAL_TABS, PROPOSAL_TABS_DAO } from "@/lib/dao";
import ProposalCard from "./ProposalCard";
import ProposalModal from "./ProposalModal";
import SubmitProposalModal from "./SubmitProposalModal";
import SubmitDisputeModal from "./SubmitDisputeModal";
import NewProposal from "@/components/dao/NewProposal";

// 模拟数据
const mockProposals: DaoByStatus = {
  proposal: [
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
  dispute: [
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
  history: [
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
  const [activeTab, setActiveTab] = useState<DaoTabKey>("proposal");
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null,
  );
  const [showNewProposal, setShowNewProposal] = useState(false);
  const [showNewDispute, setShowNewDispute] = useState(false);

  return (
    <section className="relative">
      {/* Tabs - 优化后的样式 */}
      <div className="flex gap-3 mb-8 bg-white/5 backdrop-blur-sm rounded-2xl p-1.5 border border-white/10">
        {PROPOSAL_TABS_DAO.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-8 py-3.5 font-semibold rounded-xl transition-all duration-300 ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30 scale-[1.02]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Create Proposal Button - 优化后的样式 */}
      {activeTab === "proposal" ? (
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setShowNewProposal(true)}
            className="group px-6 py-2.5 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white rounded-lg font-medium shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-300 hover:scale-[1.02] flex items-center gap-1.5 text-sm"
          >
            <span className="text-base font-light">+</span>
            <span>提交新提案</span>
          </button>
        </div>
      ) : activeTab === "dispute" ? (
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setShowNewDispute(true)}
            className="group px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300 hover:scale-[1.02] flex items-center gap-2 text-sm"
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
            <span>提交争议</span>
          </button>
        </div>
      ) : null}

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

      <SubmitProposalModal
        isOpen={showNewProposal}
        onClose={() => setShowNewProposal(false)}
        onSubmit={(newProposal) => {
          console.log("Submitted Proposal:", newProposal);
        }}
      />

      <SubmitDisputeModal
        isOpen={showNewDispute}
        onClose={() => setShowNewDispute(false)}
        onSubmit={(newProposal) => {
          console.log("Submitted Dispute:", newProposal);
        }}
      />
    </section>
  );
}
