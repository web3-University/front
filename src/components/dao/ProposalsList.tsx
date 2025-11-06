"use client";

import React, { useState, useEffect } from "react";
import { DaoTabKey } from "@/types/dao";
import { Proposal } from "@/lib/api/dao";
import ProposalCard from "./ProposalCard";
import ProposalModal from "./ProposalModal";
import SubmitProposalModal from "./SubmitProposalModal";
import SubmitDisputeModal from "./SubmitDisputeModal";
import { TransactionStatus } from "./TransactionStatus";
import { DAOConfigInfo } from "./DAOConfigInfo";
import { ProposalTabs } from "./ProposalTabs";
import { CreateProposalButtons } from "./CreateProposalButtons";
import { EmptyState } from "./EmptyState";
import {
  useSimpleYDToken,
  useWalletInfo,
  useDAO,
} from "@web3-university/uni-wallet-lib";
import { formatUnits } from "viem";
import { CONTRACTS } from "@/config/contracts";
import { VoteOption } from "@/lib/api/dao";
import { useProposalData } from "@/hooks/useProposalData";
import { useProposalOperations } from "@/hooks/useProposalOperations";

/**
 * 📋 提案列表主组件
 * - UI 渲染和用户交互
 * - 协调各个子组件和 Hooks
 * - 状态管理（UI 状态）
 * - 链上数据同步
 */
export default function ProposalsList() {
  // ==================== UI 状态 ====================
  const [activeTab, setActiveTab] = useState<DaoTabKey>("dispute");
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null,
  );
  const [showNewProposal, setShowNewProposal] = useState(false);
  const [showNewDispute, setShowNewDispute] = useState(false);

  // ==================== 钱包 & 合约配置 ====================
  const { address: walletAddress, isConnected } = useWalletInfo();

  const DAO_CONTRACT_ADDRESS =
    CONTRACTS.COURSE_DAO || "0x5E3Ab3256cfa5C89bEb63DbB8e12ba42d63F216f";

  // DAO 合约
  const dao = useDAO({ address: DAO_CONTRACT_ADDRESS as `0x${string}` });

  // YD Token 合约
  const {
    allowance,
    approve: tokenApprove,
    approveReceipt,
    refetchAllowance: tokenRefetchAllowance,
    balance: tokenBalance,
  } = useSimpleYDToken({
    address: CONTRACTS.YD_TOKEN,
    spenderAddress: DAO_CONTRACT_ADDRESS,
    enabled: isConnected,
  });

  // DAO 配置数据 合约暂未支持读取，这里先用静态值代替
  // const { data: createFee } = dao.createProposalFee();
  // const { data: votingPeriod } = dao.votingPeriod();

  const [createFee] = useState(1000);
  const [votingPeriod] = useState(7);
  // ==================== 业务逻辑 Hooks ====================

  // 提案数据管理
  const {
    isLoading,
    proposalsList,
    disputesList,
    historyList,
    fetchProposals,
    refreshProposal,
    updateProposalWithChainData,
  } = useProposalData(DAO_CONTRACT_ADDRESS);

  // 提案操作
  const {
    isCreating,
    isVoting,
    txStatus,
    createNormalProposal,
    createDisputeProposal,
    vote,
    executeProposal,
    claimReward,
  } = useProposalOperations({
    daoAddress: DAO_CONTRACT_ADDRESS,
    walletAddress,
    walletClient: undefined,
    tokenBalance,
    // createFee,
    allowance,
    approve: async (amount: bigint) => {
      await tokenApprove(
        DAO_CONTRACT_ADDRESS as `0x${string}`,
        amount.toString(),
      );
    },
    approveReceipt,
    refetchAllowance: async () => {
      await tokenRefetchAllowance();
    },
    onSuccess: async () => {
      // 操作成功后刷新数据
      await fetchProposals();
      // 如果有选中的提案，刷新它
      if (selectedProposal) {
        const updated = await refreshProposal(
          selectedProposal.proposalId.toString(),
        );
        if (updated) {
          setSelectedProposal({ ...selectedProposal, ...updated });
        }
      }
    },
  });

  // ==================== 生命周期 ====================

  // 初始化加载
  useEffect(() => {
    if (isConnected) {
      fetchProposals();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, activeTab]);

  // ==================== 事件处理 ====================

  /**
   * 创建普通提案
   */
  const handleCreateProposal = async (data: {
    title: string;
    type: string;
    description: string;
  }) => {
    const success = await createNormalProposal(data);
    if (success) {
      setShowNewProposal(false);
    }
  };

  /**
   * 创建争议提案
   */
  const handleCreateDispute = async (data: {
    type: string;
    target: string;
    description: string;
  }) => {
    const success = await createDisputeProposal(data);
    if (success) {
      setShowNewDispute(false);
    }
  };

  /**
   * 投票
   */
  const handleVote = async (proposalId: number, option: VoteOption) => {
    await vote(proposalId, option);
  };

  /**
   * 执行提案
   */
  const handleExecuteProposal = async (proposalId: number) => {
    const rewardAmount = selectedProposal?.rewardAmount || 1000; //TODO: 从提案数据获取奖励金额
    if (rewardAmount > 0) {
      const success = await executeProposal(proposalId, rewardAmount);
      if (success) {
        setSelectedProposal(null);
      }
    }
  };

  /**
   * 领取奖励
   */
  const handleClaimReward = async (proposalId: number) => {
    await claimReward(proposalId);
  };

  /**
   * 链上数据更新回调
   * 当 ProposalCard 从链上获取到新数据时调用
   */
  const handleChainDataUpdate = (proposalId: number, chainData: any) => {
    updateProposalWithChainData(proposalId, chainData);

    // 如果当前选中的提案被更新了，也更新模态框中的数据
    if (selectedProposal && selectedProposal.proposalId === proposalId) {
      setSelectedProposal({
        ...selectedProposal,
        votesFor: chainData.forVotes,
        votesAgainst: chainData.againstVotes,
        status: chainData.status,
      } as any);
    }
  };

  // ==================== 辅助方法 ====================

  /**
   * 获取当前标签的提案列表
   */
  const getCurrentProposals = () => {
    switch (activeTab) {
      case "proposal":
        return proposalsList;
      case "dispute":
        return disputesList;
      case "history":
        return historyList;
      default:
        return [];
    }
  };

  // ==================== 渲染 ====================

  return (
    <section className="relative min-h-screen">
      {/* 交易状态提示 */}
      <TransactionStatus status={txStatus} />

      {/* DAO 配置信息 */}
      <DAOConfigInfo
        createFee={createFee}
        tokenBalance={tokenBalance}
        votingPeriod={votingPeriod}
        allowance={allowance}
      />

      {/* 标签切换 */}
      <ProposalTabs
        activeTab={activeTab}
        isLoading={isLoading}
        onTabChange={setActiveTab}
      />

      {/* 创建提案按钮 */}
      <CreateProposalButtons
        activeTab={activeTab}
        isConnected={isConnected}
        isCreating={isCreating}
        onCreateProposal={() => setShowNewProposal(true)}
        onCreateDispute={() => setShowNewDispute(true)}
      />

      {/* 加载状态 */}
      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
          <p className="text-gray-400">加载提案中...</p>
        </div>
      ) : (
        <>
          {/* 提案列表 */}
          {getCurrentProposals().length > 0 ? (
            <div className="space-y-6 animate-fadeIn">
              {getCurrentProposals().map((proposal) => (
                <ProposalCard
                  key={proposal.proposalId}
                  proposal={proposal}
                  onClick={() => setSelectedProposal(proposal)}
                  daoAddress={DAO_CONTRACT_ADDRESS}
                  onChainDataUpdate={handleChainDataUpdate}
                />
              ))}
            </div>
          ) : (
            <EmptyState activeTab={activeTab} isConnected={isConnected} />
          )}
        </>
      )}

      {/* 提案详情模态框 */}
      {selectedProposal && (
        <ProposalModal
          proposal={selectedProposal}
          onClose={() => setSelectedProposal(null)}
          onVote={handleVote}
          isVoting={isVoting}
          userAddress={walletAddress}
          userVotingPower={tokenBalance}
          onClaimReward={() =>
            handleClaimReward(Number(selectedProposal.proposalId))
          }
          onFinalize={() =>
            handleExecuteProposal(Number(selectedProposal.proposalId))
          }
          daoAddress={DAO_CONTRACT_ADDRESS}
        />
      )}

      {/* 创建提案模态框 */}
      <SubmitProposalModal
        isOpen={showNewProposal}
        onClose={() => setShowNewProposal(false)}
        onSubmit={handleCreateProposal}
        isSubmitting={isCreating}
        requiredDeposit={createFee ? createFee.toString() : "1000"}
        userBalance={tokenBalance ? formatUnits(tokenBalance, 18) : "0"}
      />

      {/* 创建争议模态框 */}
      <SubmitDisputeModal
        isOpen={showNewDispute}
        onClose={() => setShowNewDispute(false)}
        onSubmit={handleCreateDispute}
        isSubmitting={isCreating}
        requiredDeposit={createFee ? createFee.toString() : "1000"}
        userBalance={tokenBalance ? formatUnits(tokenBalance, 18) : "0"}
      />
    </section>
  );
}
