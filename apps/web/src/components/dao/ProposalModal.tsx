"use client";

import React from "react";
import { Proposal } from "@/types/dao";
import ProposalCard from "./ProposalCard";

interface ProposalModalProps {
  proposal: Proposal | null;
  onClose: () => void;
}

export default function ProposalModal({
  proposal,
  onClose,
}: ProposalModalProps) {
  if (!proposal) return null;

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

          <ProposalCard proposal={proposal} isDetailed={true} />

          <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">投票信息</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">您的投票权重:</span>
                <span className="font-bold text-gray-900 text-lg">
                  1,250 票
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">投票状态:</span>
                <span className="font-bold text-orange-600">未投票</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
