"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { formatUnits } from "viem";
import { useDAO } from "@web3-university/uni-wallet-lib";
import {
  createProposal as apiCreateProposal,
  vote as apiVote,
  VoteOption,
} from "@/lib/api/dao";

/**
 * 🎯 提案操作业务逻辑 Hook
 *
 * 将创建提案、投票、执行等核心业务逻辑抽离
 */
export function useProposalOperations({
  daoAddress,
  walletAddress,
  walletClient, // 已废弃，不再使用
  tokenBalance,
  createFee,
  allowance,
  approve,
  approveReceipt,
  refetchAllowance,
  onSuccess,
}: {
  daoAddress: string;
  walletAddress?: string;
  walletClient?: any; // 保留以兼容旧代码，但不再使用
  tokenBalance?: bigint;
  createFee?: bigint;
  allowance?: bigint;
  approve: (amount: bigint) => Promise<any>;
  approveReceipt: any;
  refetchAllowance: () => Promise<any>;
  onSuccess?: () => void;
}) {
  const dao = useDAO({ address: daoAddress as `0x${string}` });
  const t = useTranslations("dao.operations");
  const [isCreating, setIsCreating] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [txStatus, setTxStatus] = useState<string>("");

  const showPendingStatus = (key: string, values?: Record<string, any>) => {
    setTxStatus(`pending|${t(key, values)}`);
  };

  const showSuccessStatus = (
    key: string,
    values?: Record<string, any>,
    duration = 3000,
  ) => {
    setTxStatus(`success|${t(key, values)}`);
    setTimeout(() => setTxStatus(""), duration);
  };

  const showErrorStatus = (
    key: string,
    values?: Record<string, any>,
    duration = 5000,
  ) => {
    setTxStatus(`error|${t(key, values)}`);
    setTimeout(() => setTxStatus(""), duration);
  };

  /**
   * ✍️ 创建普通提案
   */
  const createNormalProposal = async (data: {
    title: string;
    type: string;
    description: string;
  }) => {
    if (!walletAddress) {
      throw new Error(t("errors.connectWallet"));
    }

    setIsCreating(true);
    showPendingStatus("status.prepareProposal");

    try {
      // 步骤 1️⃣: 检查余额
      if (!tokenBalance || !createFee) {
        throw new Error(t("errors.unavailableBalance"));
      }

      if (tokenBalance < createFee) {
        throw new Error(
          t("errors.insufficientBalance", {
            required: formatUnits(createFee, 18),
            balance: formatUnits(tokenBalance, 18),
          }),
        );
      }

      // 步骤 2️⃣: 检查并授权
      showPendingStatus("status.checkAllowance");
      if (!allowance || allowance < createFee) {
        showPendingStatus("status.waitingApprove");
        await approve(createFee);

        showPendingStatus("status.confirmingApprove");
        if (!approveReceipt?.isSuccess) {
          throw new Error(t("errors.approveFailed"));
        }

        await refetchAllowance();
      }

      // 步骤 3: 调用后端 API 保存元数据
      await apiCreateProposal({
        title: data.title,
        type: data.type,
        proposer: walletAddress,
        courseId: 0, // 普通提案没有 courseId，使用 0 或根据实际情况调整
        reason: data.description,
        proposerWallet: walletAddress,
        proposalDeposit: formatUnits(createFee, 18),
      }).then((res) => {
        if (res.data?.proposalId) {
          const proposalId = res.data?.proposalId;
          // 步骤 4: 调用合约创建提案
          showPendingStatus("status.waitingProposalConfirm");
          dao.createProposal(String(proposalId)).then(async () => {
            showSuccessStatus("status.proposalSuccess");
            onSuccess?.();
            return true;
          });
        } else {
          showErrorStatus("status.proposalFailure");
        }
      });
    } catch (error: any) {
      console.error("创建提案失败:", error);
      showErrorStatus("status.failureWithReason", { reason: error.message });
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * 🚨 创建争议提案
   */
  const createDisputeProposal = async (data: {
    type: string;
    target: string;
    description: string;
  }) => {
    if (!walletAddress) {
      throw new Error(t("errors.connectWallet"));
    }

    setIsCreating(true);
    showPendingStatus("status.prepareDispute");

    try {
      // 验证课程 ID
      const courseId = parseInt(data.target);
      if (isNaN(courseId) || courseId <= 0) {
        throw new Error(t("errors.invalidCourseId"));
      }

      // 步骤 1️⃣: 检查余额和授权
      if (!tokenBalance || !createFee) {
        throw new Error(t("errors.unavailableBalance"));
      }

      if (tokenBalance < createFee) {
        throw new Error(
          t("errors.insufficientBalance", {
            required: formatUnits(createFee, 18),
            balance: formatUnits(tokenBalance, 18),
          }),
        );
      }

      showPendingStatus("status.checkAllowance");
      if (!allowance || allowance < createFee) {
        showPendingStatus("status.waitingApprove");
        await approve(createFee);

        showPendingStatus("status.confirmingApprove");
        if (!approveReceipt?.isSuccess) {
          throw new Error(t("errors.approveFailed"));
        }

        await refetchAllowance();
      }

      // 步骤 2️⃣:  调用后端 API 保存元数据
      await apiCreateProposal({
        type: data.type,
        title: `课程[${courseId}]争议提案`,
        proposer: walletAddress,
        courseId: courseId,
        reason: data.description,
        proposerWallet: walletAddress,
        proposalDeposit: formatUnits(createFee, 18),
      }).then((res) => {
        if (res.data?.proposalId) {
          const proposalId = res.data?.proposalId;
          // 步骤 3: 调用合约创建提案
          showPendingStatus("status.waitingProposalConfirm");
          dao.createProposal(String(proposalId)).then(async () => {
            showSuccessStatus("status.proposalSuccess");
            onSuccess?.();
            return true;
          });
        } else {
          showErrorStatus("status.proposalFailure");
        }
      });
    } catch (error: any) {
      console.error("创建争议提案失败:", error);
      showErrorStatus("status.failureWithReason", { reason: error.message });
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * 🗳️ 投票
   */
  const vote = async (proposalId: number, option: VoteOption) => {
    if (!walletAddress) {
      throw new Error(t("errors.connectWallet"));
    }

    setIsVoting(true);
    showPendingStatus("status.prepareVote");

    try {
      // 步骤 1️⃣: 检查投票资格
      const hasVotedResult = dao.hasVoted(
        proposalId.toString(),
        walletAddress as `0x${string}`,
      );

      if (hasVotedResult.data) {
        throw new Error(t("errors.alreadyVoted"));
      }

      if (!tokenBalance || tokenBalance === BigInt(0)) {
        throw new Error(t("errors.noVotingPower"));
      }

      // 步骤 2️⃣: 调用合约投票
      showPendingStatus("status.waitingVoteConfirm");
      const support = option === VoteOption.For;
      dao.vote(proposalId.toString(), support).then(async (res) => {
        showPendingStatus("status.voteRecording");
        if (res) {
          // 步骤 3️⃣: 调用后端 API 记录投票
          await apiVote(proposalId, {
            option,
            voterWallet: walletAddress,
            votingPower: formatUnits(tokenBalance, 18),
          });

          showSuccessStatus("status.voteSuccess");
          onSuccess?.();
          return true;
        } else {
          throw new Error(t("errors.voteTransactionFailed"));
        }
      });
    } catch (error: any) {
      console.error("投票失败:", error);
      showErrorStatus("status.failureWithReason", { reason: error.message });
      return false;
    } finally {
      setIsVoting(false);
    }
  };

  /**
   * ⚡ 执行提案
   */
  const executeProposal = async (proposalId: number, rewardAmount: bigint) => {
    if (!walletAddress) {
      throw new Error(t("errors.connectWallet"));
    }

    showPendingStatus("status.checkProposal");

    try {
      // 步骤 1️⃣: 检查是否可以执行
      // const canExecuteResult = dao.canExecute(proposalId.toString());

      // if (!canExecuteResult.data) {
      //   throw new Error("提案暂时无法执行");
      // }

      // 步骤 2️⃣: 调用合约执行提案
      showPendingStatus("status.waitingExecute");
      dao
        .executeProposalAndDistributeRewards(
          proposalId.toString(),
          rewardAmount,
        )
        .then(async (res) => {
          if (!res) {
            throw new Error(t("errors.executeTransactionFailed"));
          } else {
            showSuccessStatus("status.executeSuccess");
            onSuccess?.();
            return true;
          }
        });
    } catch (error: any) {
      console.error("执行提案失败:", error);
      showErrorStatus("status.failureWithReason", { reason: error.message });
      return false;
    }
  };

  /**
   * 🎁 领取奖励
   */
  const claimReward = async (proposalId: number) => {
    if (!walletAddress) {
      throw new Error(t("errors.connectWallet"));
    }

    showPendingStatus("status.calculatingReward");

    try {
      // TODO: 实现领取奖励逻辑
      showSuccessStatus("status.claimSuccess");
      return true;
    } catch (error: any) {
      console.error("领取奖励失败:", error);
      showErrorStatus("status.failureWithReason", { reason: error.message });
      return false;
    }
  };

  return {
    // 状态
    isCreating,
    isVoting,
    txStatus,

    // 方法
    createNormalProposal,
    createDisputeProposal,
    vote,
    executeProposal,
    claimReward,
  };
}
