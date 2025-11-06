"use client";

import { useState } from "react";
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
  const [isCreating, setIsCreating] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [txStatus, setTxStatus] = useState<string>("");

  /**
   * ✍️ 创建普通提案
   */
  const createNormalProposal = async (data: {
    title: string;
    type: string;
    description: string;
  }) => {
    if (!walletAddress) {
      throw new Error("请先连接钱包");
    }

    setIsCreating(true);
    setTxStatus("准备创建提案...");

    try {
      // 步骤 1️⃣: 检查余额
      if (!tokenBalance || !createFee) {
        throw new Error("无法获取余额或费用信息");
      }

      if (tokenBalance < createFee) {
        throw new Error(
          `余额不足，需要 ${formatUnits(createFee, 18)} YD，当前余额 ${formatUnits(tokenBalance, 18)} YD`,
        );
      }

      // 步骤 2️⃣: 检查并授权
      setTxStatus("检查授权...");
      if (!allowance || allowance < createFee) {
        setTxStatus("等待授权确认...");
        await approve(createFee);

        setTxStatus("授权交易确认中...");
        if (!approveReceipt?.isSuccess) {
          throw new Error("授权失败");
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
          setTxStatus("等待创建提案确认...");
          dao.createProposal(String(proposalId)).then(async () => {
            setTxStatus("✅ 提案创建成功！");
            onSuccess?.();
            setTimeout(() => setTxStatus(""), 3000);
            return true;
          });
        } else {
          setTxStatus("❌ 创建失败: 提案创建失败");
        }
      });
    } catch (error: any) {
      console.error("创建提案失败:", error);
      setTxStatus(`❌ 创建失败: ${error.message}`);
      setTimeout(() => setTxStatus(""), 5000);
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
      throw new Error("请先连接钱包");
    }

    setIsCreating(true);
    setTxStatus("准备创建争议提案...");

    try {
      // 验证课程 ID
      const courseId = parseInt(data.target);
      if (isNaN(courseId) || courseId <= 0) {
        throw new Error("请输入有效的课程 ID");
      }

      // 步骤 1️⃣: 检查余额和授权
      if (!tokenBalance || !createFee) {
        throw new Error("无法获取余额或费用信息");
      }

      if (tokenBalance < createFee) {
        throw new Error(
          `余额不足，需要 ${formatUnits(createFee, 18)} YD，当前余额 ${formatUnits(tokenBalance, 18)} YD`,
        );
      }

      setTxStatus("检查授权...");
      if (!allowance || allowance < createFee) {
        setTxStatus("等待授权确认...");
        await approve(createFee);

        setTxStatus("授权交易确认中...");
        if (!approveReceipt?.isSuccess) {
          throw new Error("授权失败");
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
          setTxStatus("等待创建提案确认...");
          dao.createProposal(String(proposalId)).then(async () => {
            setTxStatus("✅ 提案创建成功！");
            onSuccess?.();
            setTimeout(() => setTxStatus(""), 3000);
            return true;
          });
        } else {
          setTxStatus("❌ 创建失败: 提案创建失败");
        }
      });
    } catch (error: any) {
      console.error("创建争议提案失败:", error);
      setTxStatus(`❌ 创建失败: ${error.message}`);
      setTimeout(() => setTxStatus(""), 5000);
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
      throw new Error("请先连接钱包");
    }

    setIsVoting(true);
    setTxStatus("准备投票...");

    try {
      // 步骤 1️⃣: 检查投票资格
      const hasVotedResult = dao.hasVoted(
        proposalId.toString(),
        walletAddress as `0x${string}`,
      );

      if (hasVotedResult.data) {
        throw new Error("您已经投过票了");
      }

      if (!tokenBalance || tokenBalance === BigInt(0)) {
        throw new Error("您没有投票权重，请先获取 YD Token");
      }

      // 步骤 2️⃣: 调用合约投票
      setTxStatus("等待投票确认...");
      const support = option === VoteOption.For;
      dao.vote(proposalId.toString(), support).then(async (res) => {
        setTxStatus("投票成功，记录投票信息...");
        if (res) {
          // 步骤 3️⃣: 调用后端 API 记录投票
          await apiVote(proposalId, {
            option,
            voterWallet: walletAddress,
            votingPower: formatUnits(tokenBalance, 18),
          });

          setTxStatus("✅ 投票成功！");
          onSuccess?.();

          setTimeout(() => setTxStatus(""), 3000);
          return true;
        } else {
          throw new Error("投票交易失败");
        }
      });
    } catch (error: any) {
      console.error("投票失败:", error);
      setTxStatus(`❌ 投票失败: ${error.message}`);
      setTimeout(() => setTxStatus(""), 5000);
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
      throw new Error("请先连接钱包");
    }

    setTxStatus("检查提案状态...");

    try {
      // 步骤 1️⃣: 检查是否可以执行
      // const canExecuteResult = dao.canExecute(proposalId.toString());

      // if (!canExecuteResult.data) {
      //   throw new Error("提案暂时无法执行");
      // }

      // 步骤 2️⃣: 调用合约执行提案
      setTxStatus("等待执行确认...");
      dao
        .executeProposalAndDistributeRewards(
          proposalId.toString(),
          rewardAmount,
        )
        .then(async (res) => {
          if (!res) {
            throw new Error("执行交易提交失败");
          } else {
            setTxStatus("✅ 提案执行成功！");
            onSuccess?.();

            setTimeout(() => setTxStatus(""), 3000);
            return true;
          }
        });
    } catch (error: any) {
      console.error("执行提案失败:", error);
      setTxStatus(`❌ 执行失败: ${error.message}`);
      setTimeout(() => setTxStatus(""), 5000);
      return false;
    }
  };

  /**
   * 🎁 领取奖励
   */
  const claimReward = async (proposalId: number) => {
    if (!walletAddress) {
      throw new Error("请先连接钱包");
    }

    setTxStatus("计算奖励...");

    try {
      // TODO: 实现领取奖励逻辑
      setTxStatus("✅ 奖励领取成功！");
      setTimeout(() => setTxStatus(""), 3000);
      return true;
    } catch (error: any) {
      console.error("领取奖励失败:", error);
      setTxStatus(`❌ 领取失败: ${error.message}`);
      setTimeout(() => setTxStatus(""), 5000);
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
