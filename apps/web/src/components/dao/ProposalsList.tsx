"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Proposal, DaoTabKey, convertApiToMockFormat } from "@/types/dao";
import { PROPOSAL_TABS_DAO } from "@/lib/dao";
import ProposalCard from "./ProposalCard";
import ProposalModal from "./ProposalModal";
import SubmitProposalModal from "./SubmitProposalModal";
import SubmitDisputeModal from "./SubmitDisputeModal";
import {
  useWalletSign,
  useSimpleYDToken,
  useWalletInfo,
} from "@web3-university/uni-wallet-lib";
import { formatUnits, parseUnits } from "viem";
import { CONTRACTS } from "@/config/contracts";
import { createProposal, getProposals, vote, VoteOption } from "@/lib/api/dao";
import { usePublicClient, useWalletClient } from "wagmi";

// CourseDAO 合约 ABI (核心功能)
import { DAO_ABI } from "@web3-university/uni-wallet-lib/src/contract";

export default function ProposalsList() {
  const [activeTab, setActiveTab] = useState<DaoTabKey>("dispute");
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null,
  );
  const [showNewProposal, setShowNewProposal] = useState(false);
  const [showNewDispute, setShowNewDispute] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<string>("");

  // 提案列表数据
  const [proposalsList, setProposalsList] = useState<Proposal[]>([]);
  const [disputesList, setDisputesList] = useState<Proposal[]>([]);
  const [historyList, setHistoryList] = useState<Proposal[]>([]);

  // DAO配置
  const [daoConfig, setDaoConfig] = useState<{
    proposalDeposit: bigint;
    minVotingPower: bigint;
    votingPeriod: bigint;
    quorumPercentage: bigint;
    passThreshold: bigint;
    rewardPoolPercentage: bigint;
  } | null>(null);

  const { signMessage } = useWalletSign();
  const { address: walletAddress, isConnected } = useWalletInfo();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  // CourseDAO 合约地址
  const COURSE_DAO_CONTRACT =
    CONTRACTS.COURSE_DAO || "0x5E3Ab3256cfa5C89bEb63DbB8e12ba42d63F216f";

  // YD Token 合约交互
  const {
    allowance,
    approve,
    approveReceipt,
    refetchAllowance,
    balance: tokenBalance,
  } = useSimpleYDToken({
    address: CONTRACTS.YD_TOKEN,
    spenderAddress: COURSE_DAO_CONTRACT,
    enabled: isConnected,
  });

  /**
   * 从合约读取DAO配置
   */
  const fetchDAOConfig = useCallback(async () => {
    if (!publicClient) return;

    try {
      const config = await publicClient.readContract({
        address: COURSE_DAO_CONTRACT as `0x${string}`,
        abi: COURSE_DAO_ABI,
        functionName: "getDAOConfig",
      });

      setDaoConfig({
        proposalDeposit: config.proposalDeposit,
        minVotingPower: config.minVotingPower,
        votingPeriod: config.votingPeriod,
        quorumPercentage: config.quorumPercentage,
        passThreshold: config.passThreshold,
        rewardPoolPercentage: config.rewardPoolPercentage,
      });

      console.log("DAO配置:", {
        proposalDeposit: formatUnits(config.proposalDeposit, 18),
        minVotingPower: formatUnits(config.minVotingPower, 18),
        votingPeriod: config.votingPeriod.toString(),
        quorumPercentage: config.quorumPercentage.toString(),
        passThreshold: config.passThreshold.toString(),
        rewardPoolPercentage: config.rewardPoolPercentage.toString(),
      });
    } catch (error) {
      console.error("获取DAO配置失败:", error);
    }
  }, [publicClient, COURSE_DAO_CONTRACT]);

  /**
   * 从合约读取提案详情
   */
  const fetchProposalFromContract = useCallback(
    async (proposalId: number) => {
      if (!publicClient) return null;

      try {
        const proposal = await publicClient.readContract({
          address: COURSE_DAO_CONTRACT as `0x${string}`,
          abi: COURSE_DAO_ABI,
          functionName: "getProposal",
          args: [BigInt(proposalId)],
        });

        return proposal;
      } catch (error) {
        console.error(`获取提案 ${proposalId} 详情失败:`, error);
        return null;
      }
    },
    [publicClient, COURSE_DAO_CONTRACT],
  );

  /**
   * 从合约读取所有提案ID
   */
  const fetchAllProposalIds = useCallback(async () => {
    if (!publicClient) return [];

    try {
      const proposalIds = await publicClient.readContract({
        address: COURSE_DAO_CONTRACT as `0x${string}`,
        abi: COURSE_DAO_ABI,
        functionName: "getAllProposals",
      });

      return proposalIds.map((id) => Number(id));
    } catch (error) {
      console.error("获取提案ID列表失败:", error);
      return [];
    }
  }, [publicClient, COURSE_DAO_CONTRACT]);

  /**
   * 检查用户是否可以投票
   */
  const checkCanVote = useCallback(
    async (proposalId: number): Promise<boolean> => {
      if (!publicClient || !walletAddress) return false;

      try {
        const canVote = await publicClient.readContract({
          address: COURSE_DAO_CONTRACT as `0x${string}`,
          abi: COURSE_DAO_ABI,
          functionName: "canVote",
          args: [walletAddress as `0x${string}`, BigInt(proposalId)],
        });

        return canVote;
      } catch (error) {
        console.error("检查投票权限失败:", error);
        return false;
      }
    },
    [publicClient, walletAddress, COURSE_DAO_CONTRACT],
  );

  /**
   * 计算用户可领取的奖励
   */
  const calculateUserReward = useCallback(
    async (proposalId: number): Promise<bigint> => {
      if (!publicClient || !walletAddress) return BigInt(0);

      try {
        const reward = await publicClient.readContract({
          address: COURSE_DAO_CONTRACT as `0x${string}`,
          abi: COURSE_DAO_ABI,
          functionName: "calculateReward",
          args: [walletAddress as `0x${string}`, BigInt(proposalId)],
        });

        return reward;
      } catch (error) {
        console.error("计算奖励失败:", error);
        return BigInt(0);
      }
    },
    [publicClient, walletAddress, COURSE_DAO_CONTRACT],
  );

  // 初始化时获取DAO配置和提案数据
  useEffect(() => {
    if (isConnected && publicClient) {
      fetchDAOConfig();
      getProposalsFn();
    }
  }, [isConnected, publicClient]);

  // 当 activeTab 切换时重新获取数据
  useEffect(() => {
    getProposalsFn();
  }, [activeTab]);

  /**
   * 获取提案列表(结合API和链上数据)
   */
  const getProposalsFn = async () => {
    setIsLoading(true);
    try {
      // 方案1: 优先从API获取(如果后端已同步链上数据)
      const res: any = await getProposals({
        page: 1,
        limit: 100,
      });

      if (res?.data?.proposals) {
        const apiProposals = res.data.proposals;
        const convertedProposals = convertApiToMockFormat(apiProposals);

        // 分类提案
        const activeProposals = convertedProposals.filter(
          (p) =>
            (p as any).status === "active" || (p as any).status === "pending",
        );

        const historyProposals = convertedProposals.filter(
          (p) =>
            (p as any).status === "executed" ||
            (p as any).status === "rejected" ||
            (p as any).status === "passed" ||
            (p as any).status === "cancelled",
        );

        setProposalsList(
          activeProposals.filter((p) => {
            const courseId = (p as any).courseId;
            return !courseId || courseId === 0;
          }),
        );

        setDisputesList(
          activeProposals.filter((p) => {
            const courseId = (p as any).courseId;
            return courseId && courseId > 0;
          }),
        );

        setHistoryList(historyProposals);

        // 方案2: 可选地从链上获取最新状态并更新(双向同步)
        // await syncProposalsWithChain(convertedProposals);
      }
    } catch (error) {
      console.error("获取提案列表失败:", error);

      // 如果API失败,尝试直接从链上读取
      if (publicClient) {
        console.log("尝试从链上直接读取提案...");
        await fetchProposalsFromChain();
      } else {
        alert("获取提案列表失败,请稍后重试");
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 直接从链上获取提案(作为备用方案)
   */
  const fetchProposalsFromChain = async () => {
    if (!publicClient) return;

    try {
      const proposalIds = await fetchAllProposalIds();
      console.log("链上提案ID列表:", proposalIds);

      // 获取每个提案的详细信息
      const proposals = await Promise.all(
        proposalIds.map((id) => fetchProposalFromContract(id)),
      );

      // 转换为前端格式
      const formattedProposals = proposals
        .filter((p) => p !== null)
        .map((p: any) => ({
          id: Number(p.id),
          courseId: Number(p.courseId),
          proposer: p.proposer,
          reason: p.reason,
          proposalDeposit: formatUnits(p.proposalDeposit, 18),
          createdAt: new Date(Number(p.createdAt) * 1000).toISOString(),
          votingStartTime: new Date(
            Number(p.votingStartTime) * 1000,
          ).toISOString(),
          votingEndTime: new Date(Number(p.votingEndTime) * 1000).toISOString(),
          forVotes: formatUnits(p.forVotes, 18),
          againstVotes: formatUnits(p.againstVotes, 18),
          totalVotingPower: formatUnits(p.totalVotingPower, 18),
          status: [
            "Pending",
            "Active",
            "Succeeded",
            "Failed",
            "Executed",
            "Canceled",
          ][p.status].toLowerCase(),
          executed: p.executed,
        }));

      // 分类
      const activeProposals = formattedProposals.filter(
        (p) => p.status === "active" || p.status === "pending",
      );

      const historyProposals = formattedProposals.filter(
        (p) =>
          p.status === "executed" ||
          p.status === "failed" ||
          p.status === "succeeded" ||
          p.status === "canceled",
      );

      setProposalsList(
        activeProposals.filter((p) => !p.courseId || p.courseId === 0),
      );
      setDisputesList(
        activeProposals.filter((p) => p.courseId && p.courseId > 0),
      );
      setHistoryList(historyProposals);

      console.log("从链上获取到提案:", {
        proposals: formattedProposals.length,
        active: activeProposals.length,
        history: historyProposals.length,
      });
    } catch (error) {
      console.error("从链上获取提案失败:", error);
    }
  };

  /**
   * 检查并授权 Token
   */
  const checkAndApproveToken = async (requiredAmount: bigint) => {
    console.log("检查授权额度...", {
      required: formatUnits(requiredAmount, 18),
      current: allowance ? formatUnits(allowance, 18) : "0",
    });

    setTxStatus("检查授权额度...");
    await refetchAllowance();

    if (!allowance || allowance < requiredAmount) {
      console.log("授权不足,开始授权...");
      setTxStatus("等待授权确认...");

      // 授权充足金额
      const approveAmount = requiredAmount * BigInt(2);
      const approveAmountStr = formatUnits(approveAmount, 18);

      const approveResult = await approve(
        COURSE_DAO_CONTRACT,
        approveAmountStr,
      );

      if (!approveResult) {
        throw new Error("授权失败,未返回交易哈希");
      }

      // 等待授权交易确认
      console.log("等待授权交易确认...", approveResult);
      setTxStatus("授权交易已提交,等待确认...");

      let receipt: any = null;
      if (typeof approveReceipt === "function") {
        receipt = await approveReceipt(approveResult);
      } else if (
        approveReceipt &&
        typeof (approveReceipt as any).refetch === "function"
      ) {
        const r = await (approveReceipt as any).refetch(approveResult);
        receipt = r?.data ?? r;
      }

      if (!receipt || receipt?.status !== "success") {
        throw new Error("授权交易失败");
      }

      console.log("授权成功,交易哈希:", approveResult);
      setTxStatus("授权成功!");

      // 刷新授权额度
      await refetchAllowance();
    } else {
      console.log("授权额度充足");
      setTxStatus("授权额度充足");
    }
  };

  /**
   * 创建普通提案(通过合约)
   */
  const createNormalProposal = async (data: {
    title: string;
    type: string;
    description: string;
  }) => {
    if (isCreating) return;
    setIsCreating(true);
    setTxStatus("");

    try {
      // 1. 检查钱包连接
      if (!isConnected || !walletAddress || !walletClient) {
        throw new Error("请先连接钱包");
      }

      // 2. 获取押金配置
      const depositAmount =
        daoConfig?.proposalDeposit || parseUnits("1000", 18);

      // 3. 检查 Token 余额
      if (!tokenBalance || tokenBalance < depositAmount) {
        throw new Error(
          `YD Token 余额不足。需要 ${formatUnits(depositAmount, 18)} YD,当前余额 ${formatUnits(tokenBalance || BigInt(0), 18)} YD`,
        );
      }

      // 4. 签名认证
      console.log("开始签名认证...");
      setTxStatus("等待签名...");

      const timestamp = Date.now();
      const message = `提交提案
标题: ${data.title}
类型: ${data.type}
描述: ${data.description}
押金: ${formatUnits(depositAmount, 18)} YD
时间戳: ${timestamp}
钱包地址: ${walletAddress}`;

      let signature: string;
      try {
        const signResult = await signMessage(message);
        signature = signResult.signature;
        console.log("签名成功:", signature);
      } catch (signError) {
        console.log("用户拒绝签名");
        setTxStatus("");
        return;
      }

      // 5. 检查并授权 Token
      await checkAndApproveToken(depositAmount);

      // 6. 调用合约创建提案
      console.log("调用合约创建提案...");
      setTxStatus("提交提案交易中...");

      const reason = `【${data.type}】${data.title}\n\n${data.description}`;

      // 使用 walletClient 发送交易
      const hash = await walletClient.writeContract({
        address: COURSE_DAO_CONTRACT as `0x${string}`,
        abi: COURSE_DAO_ABI,
        functionName: "createProposal",
        args: [BigInt(0), reason], // courseId=0 表示普通提案
        account: walletAddress as `0x${string}`,
      });

      console.log("交易已提交,哈希:", hash);
      setTxStatus("交易已提交,等待确认...");

      // 等待交易确认
      if (publicClient) {
        const receipt = await publicClient.waitForTransactionReceipt({
          hash,
        });

        if (receipt.status === "success") {
          console.log("提案创建成功,交易回执:", receipt);
          setTxStatus("提案创建成功!");

          // 从事件日志中获取 proposalId
          const logs = receipt.logs;
          console.log("交易日志:", logs);

          alert("提案创建成功!");

          // 7. 同步到后端(可选)
          try {
            await createProposal({
              courseId: 0,
              reason,
              proposerWallet: walletAddress,
              proposalDeposit: formatUnits(depositAmount, 18),
            });
          } catch (apiError) {
            console.warn("同步到后端失败,但链上交易已成功:", apiError);
          }

          // 8. 关闭弹窗并刷新列表
          setShowNewProposal(false);
          await getProposalsFn();
        } else {
          throw new Error("交易失败");
        }
      }
    } catch (error: any) {
      console.error("创建提案失败:", error);
      setTxStatus("创建失败");

      // 解析错误信息
      let errorMessage = "创建提案失败,请稍后重试";
      if (error.message) {
        if (error.message.includes("insufficient")) {
          errorMessage = "余额不足";
        } else if (error.message.includes("ProposalAlreadyExists")) {
          errorMessage = "该课程已有活跃提案";
        } else if (error.message.includes("InsufficientDeposit")) {
          errorMessage = "押金不足";
        } else if (error.message.includes("user rejected")) {
          errorMessage = "用户拒绝交易";
        } else {
          errorMessage = error.message;
        }
      }

      alert(errorMessage);
    } finally {
      setIsCreating(false);
      setTimeout(() => setTxStatus(""), 3000);
    }
  };

  /**
   * 创建争议提案(课程质量投诉)
   */
  const createDisputeProposal = async (data: {
    type: string;
    target: string;
    description: string;
  }) => {
    if (isCreating) return;
    setIsCreating(true);
    setTxStatus("");

    try {
      // 1. 检查钱包连接
      if (!isConnected || !walletAddress || !walletClient) {
        throw new Error("请先连接钱包");
      }

      // 2. 解析课程ID
      const courseId = parseInt(data.target);
      if (!courseId || courseId <= 0) {
        throw new Error("请输入有效的课程ID");
      }

      // 3. 获取押金配置
      const depositAmount =
        daoConfig?.proposalDeposit || parseUnits("1000", 18);

      // 4. 检查 Token 余额
      if (!tokenBalance || tokenBalance < depositAmount) {
        throw new Error(
          `YD Token 余额不足。需要 ${formatUnits(depositAmount, 18)} YD,当前余额 ${formatUnits(tokenBalance || BigInt(0), 18)} YD`,
        );
      }

      // 5. 签名认证
      console.log("开始签名认证...");
      setTxStatus("等待签名...");

      const timestamp = Date.now();
      const message = `提交课程争议
争议类型: ${data.type}
课程ID: ${courseId}
问题描述: ${data.description}
押金: ${formatUnits(depositAmount, 18)} YD
时间戳: ${timestamp}
钱包地址: ${walletAddress}`;

      let signature: string;
      try {
        const signResult = await signMessage(message);
        signature = signResult.signature;
        console.log("签名成功:", signature);
      } catch (signError) {
        console.log("用户拒绝签名");
        setTxStatus("");
        return;
      }

      // 6. 检查并授权 Token
      await checkAndApproveToken(depositAmount);

      // 7. 调用合约创建争议提案
      console.log("调用合约创建争议提案...");
      setTxStatus("提交争议交易中...");

      const reason = `【${data.type}】课程质量问题\n\n${data.description}`;

      const hash = await walletClient.writeContract({
        address: COURSE_DAO_CONTRACT as `0x${string}`,
        abi: COURSE_DAO_ABI,
        functionName: "createProposal",
        args: [BigInt(courseId), reason],
        account: walletAddress as `0x${string}`,
      });

      console.log("交易已提交,哈希:", hash);
      setTxStatus("交易已提交,等待确认...");

      // 等待交易确认
      if (publicClient) {
        const receipt = await publicClient.waitForTransactionReceipt({
          hash,
        });

        if (receipt.status === "success") {
          console.log("争议提案创建成功,交易回执:", receipt);
          setTxStatus("争议提交成功!");

          alert("争议提交成功!");

          // 8. 同步到后端
          try {
            await createProposal({
              courseId,
              reason,
              proposerWallet: walletAddress,
              proposalDeposit: formatUnits(depositAmount, 18),
            });
          } catch (apiError) {
            console.warn("同步到后端失败,但链上交易已成功:", apiError);
          }

          // 9. 关闭弹窗并刷新列表
          setShowNewDispute(false);
          await getProposalsFn();
        } else {
          throw new Error("交易失败");
        }
      }
    } catch (error: any) {
      console.error("创建争议失败:", error);
      setTxStatus("创建失败");

      let errorMessage = "创建争议失败,请稍后重试";
      if (error.message) {
        if (error.message.includes("insufficient")) {
          errorMessage = "余额不足";
        } else if (error.message.includes("ProposalAlreadyExists")) {
          errorMessage = "该课程已有活跃争议提案";
        } else if (error.message.includes("InvalidCourse")) {
          errorMessage = "课程不存在";
        } else if (error.message.includes("InsufficientDeposit")) {
          errorMessage = "押金不足";
        } else if (error.message.includes("user rejected")) {
          errorMessage = "用户拒绝交易";
        } else {
          errorMessage = error.message;
        }
      }

      alert(errorMessage);
    } finally {
      setIsCreating(false);
      setTimeout(() => setTxStatus(""), 3000);
    }
  };

  /**
   * 投票功能(通过合约)
   * @param proposalId 提案ID
   * @param option 投票选项: VoteOption.For(0)=支持课程, VoteOption.Against(1)=反对课程
   */
  const createVoteFn = async (proposalId: number, option: VoteOption) => {
    if (isVoting) return;
    setIsVoting(true);
    setTxStatus("");

    try {
      // 1. 检查钱包连接
      if (!isConnected || !walletAddress || !walletClient) {
        throw new Error("请先连接钱包");
      }

      // 2. 检查是否可以投票
      const canVote = await checkCanVote(proposalId);
      if (!canVote) {
        throw new Error("无法投票:可能已投过票、投票已结束或代币余额不足");
      }

      // 3. 获取投票权重(用户的全部余额)
      if (!tokenBalance || tokenBalance === BigInt(0)) {
        throw new Error("您没有投票权重,请先获取 YD Token");
      }

      // 使用最小投票权重和用户余额中的较小值
      const minVotingPower = daoConfig?.minVotingPower || parseUnits("100", 18);
      const votingPowerAmount =
        tokenBalance > minVotingPower ? tokenBalance : minVotingPower;

      // 用户可能想投票的金额可以让用户自己输入,这里简化为使用余额
      // 实际应用中可以添加输入框让用户选择投票金额

      // 4. 签名认证
      const optionText = option === VoteOption.For ? "支持课程" : "反对课程";
      setTxStatus("等待签名...");

      const timestamp = Date.now();
      const message = `投票
提案ID: ${proposalId}
选项: ${optionText}
投票权重: ${formatUnits(votingPowerAmount, 18)} YD
时间戳: ${timestamp}
钱包地址: ${walletAddress}`;

      let signature: string;
      try {
        const signResult = await signMessage(message);
        signature = signResult.signature;
        console.log("签名成功:", signature);
      } catch (signError) {
        console.log("用户拒绝签名");
        setTxStatus("");
        return;
      }

      // 5. 检查并授权 Token
      await checkAndApproveToken(votingPowerAmount);

      // 6. 调用合约投票
      console.log("调用合约投票...");
      setTxStatus("提交投票交易中...");

      const hash = await walletClient.writeContract({
        address: COURSE_DAO_CONTRACT as `0x${string}`,
        abi: COURSE_DAO_ABI,
        functionName: "vote",
        args: [BigInt(proposalId), option, votingPowerAmount],
        account: walletAddress as `0x${string}`,
      });

      console.log("投票交易已提交,哈希:", hash);
      setTxStatus("交易已提交,等待确认...");

      // 等待交易确认
      if (publicClient) {
        const receipt = await publicClient.waitForTransactionReceipt({
          hash,
        });

        if (receipt.status === "success") {
          console.log("投票成功,交易回执:", receipt);
          setTxStatus("投票成功!");

          alert(`投票成功!您选择了【${optionText}】`);

          // 7. 同步到后端
          try {
            await vote(proposalId, {
              option,
              voterWallet: walletAddress,
              votingPower: formatUnits(votingPowerAmount, 18),
            });
          } catch (apiError) {
            console.warn("同步到后端失败,但链上交易已成功:", apiError);
          }

          // 8. 关闭详情弹窗并刷新列表
          setSelectedProposal(null);
          await getProposalsFn();
        } else {
          throw new Error("交易失败");
        }
      }
    } catch (error: any) {
      console.error("投票失败:", error);
      setTxStatus("投票失败");

      let errorMessage = "投票失败,请稍后重试";
      if (error.message) {
        if (error.message.includes("AlreadyVoted")) {
          errorMessage = "您已经投过票了";
        } else if (error.message.includes("VotingNotActive")) {
          errorMessage = "投票未激活或已结束";
        } else if (error.message.includes("VotingAlreadyEnded")) {
          errorMessage = "投票已结束";
        } else if (error.message.includes("InsufficientVotingPower")) {
          errorMessage = "投票权重不足";
        } else if (error.message.includes("user rejected")) {
          errorMessage = "用户拒绝交易";
        } else {
          errorMessage = error.message;
        }
      }

      alert(errorMessage);
    } finally {
      setIsVoting(false);
      setTimeout(() => setTxStatus(""), 3000);
    }
  };

  /**
   * 领取奖励
   */
  const claimReward = async (proposalId: number) => {
    if (!walletClient || !walletAddress) {
      alert("请先连接钱包");
      return;
    }

    try {
      // 1. 计算可领取奖励
      setTxStatus("计算奖励中...");
      const reward = await calculateUserReward(proposalId);

      if (reward === BigInt(0)) {
        alert("您没有可领取的奖励");
        return;
      }

      console.log(
        `可领取奖励: ${formatUnits(reward, 18)} YD (提案 ${proposalId})`,
      );

      // 2. 调用合约领取奖励
      setTxStatus("提交领取奖励交易...");

      const hash = await walletClient.writeContract({
        address: COURSE_DAO_CONTRACT as `0x${string}`,
        abi: COURSE_DAO_ABI,
        functionName: "claimReward",
        args: [BigInt(proposalId)],
        account: walletAddress as `0x${string}`,
      });

      console.log("领取奖励交易已提交,哈希:", hash);
      setTxStatus("交易已提交,等待确认...");

      // 3. 等待交易确认
      if (publicClient) {
        const receipt = await publicClient.waitForTransactionReceipt({
          hash,
        });

        if (receipt.status === "success") {
          console.log("奖励领取成功,交易回执:", receipt);
          setTxStatus("奖励领取成功!");

          alert(`奖励领取成功!您获得了 ${formatUnits(reward, 18)} YD`);

          // 刷新列表
          await getProposalsFn();
        } else {
          throw new Error("交易失败");
        }
      }
    } catch (error: any) {
      console.error("领取奖励失败:", error);
      setTxStatus("领取失败");

      let errorMessage = "领取奖励失败";
      if (error.message) {
        if (error.message.includes("NoRewardToClaim")) {
          errorMessage = "没有可领取的奖励";
        } else if (error.message.includes("user rejected")) {
          errorMessage = "用户拒绝交易";
        } else {
          errorMessage = error.message;
        }
      }

      alert(errorMessage);
    } finally {
      setTimeout(() => setTxStatus(""), 3000);
    }
  };

  /**
   * 结束投票
   */
  const finalizeProposal = async (proposalId: number) => {
    if (!walletClient || !walletAddress) {
      alert("请先连接钱包");
      return;
    }

    try {
      setTxStatus("提交结束投票交易...");

      const hash = await walletClient.writeContract({
        address: COURSE_DAO_CONTRACT as `0x${string}`,
        abi: COURSE_DAO_ABI,
        functionName: "finalizeProposal",
        args: [BigInt(proposalId)],
        account: walletAddress as `0x${string}`,
      });

      console.log("结束投票交易已提交,哈希:", hash);
      setTxStatus("交易已提交,等待确认...");

      if (publicClient) {
        const receipt = await publicClient.waitForTransactionReceipt({
          hash,
        });

        if (receipt.status === "success") {
          console.log("投票结束成功,交易回执:", receipt);
          setTxStatus("投票结束成功!");

          alert("投票已结束,请查看结果");

          // 刷新列表
          await getProposalsFn();
        } else {
          throw new Error("交易失败");
        }
      }
    } catch (error: any) {
      console.error("结束投票失败:", error);
      setTxStatus("操作失败");

      let errorMessage = "结束投票失败";
      if (error.message) {
        if (error.message.includes("VotingNotEnded")) {
          errorMessage = "投票期未结束";
        } else if (error.message.includes("user rejected")) {
          errorMessage = "用户拒绝交易";
        } else {
          errorMessage = error.message;
        }
      }

      alert(errorMessage);
    } finally {
      setTimeout(() => setTxStatus(""), 3000);
    }
  };

  /**
   * 根据当前标签获取对应的提案列表
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

  /**
   * 获取标签名称
   */
  const getTabName = () => {
    switch (activeTab) {
      case "proposal":
        return "提案";
      case "dispute":
        return "争议";
      case "history":
        return "历史记录";
      default:
        return "";
    }
  };

  return (
    <section className="relative">
      {/* Transaction Status Toast */}
      {txStatus && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            {txStatus.includes("等待") || txStatus.includes("中") ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : txStatus.includes("成功") ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span className="font-medium">{txStatus}</span>
          </div>
        </div>
      )}

      {/* DAO Config Info */}
      {daoConfig && (
        <div className="mb-6 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
            <div>
              <div className="text-gray-400 mb-1">提案押金</div>
              <div className="text-white font-semibold">
                {formatUnits(daoConfig.proposalDeposit, 18)} YD
              </div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">最小投票</div>
              <div className="text-white font-semibold">
                {formatUnits(daoConfig.minVotingPower, 18)} YD
              </div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">投票期限</div>
              <div className="text-white font-semibold">
                {Number(daoConfig.votingPeriod) / 86400} 天
              </div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">法定人数</div>
              <div className="text-white font-semibold">
                {Number(daoConfig.quorumPercentage) / 100}%
              </div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">通过阈值</div>
              <div className="text-white font-semibold">
                {Number(daoConfig.passThreshold) / 100}%
              </div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">奖励比例</div>
              <div className="text-white font-semibold">
                {Number(daoConfig.rewardPoolPercentage) / 100}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-3 mb-8 bg-white/5 backdrop-blur-sm rounded-2xl p-1.5 border border-white/10">
        {PROPOSAL_TABS_DAO.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            disabled={isLoading}
            className={`flex-1 px-8 py-3.5 font-semibold rounded-xl transition-all duration-300 ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30 scale-[1.02]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Create Proposal Button */}
      {activeTab === "proposal" ? (
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setShowNewProposal(true)}
            disabled={!isConnected || isCreating}
            className="group px-6 py-2.5 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white rounded-lg font-medium shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-300 hover:scale-[1.02] flex items-center gap-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span className="text-base font-light">+</span>
            <span>
              {!isConnected
                ? "请先连接钱包"
                : isCreating
                  ? "提交中..."
                  : "提交新提案"}
            </span>
          </button>
        </div>
      ) : activeTab === "dispute" ? (
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setShowNewDispute(true)}
            disabled={!isConnected || isCreating}
            className="group px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300 hover:scale-[1.02] flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
            <span>
              {!isConnected
                ? "请先连接钱包"
                : isCreating
                  ? "提交中..."
                  : "提交争议"}
            </span>
          </button>
        </div>
      ) : null}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
          <p className="text-gray-400">加载中...</p>
        </div>
      ) : (
        <>
          {/* Proposals List */}
          {getCurrentProposals().length > 0 ? (
            <div className="space-y-6">
              {getCurrentProposals().map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  onClick={() => setSelectedProposal(proposal)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <svg
                className="w-16 h-16 mx-auto mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg mb-2">暂无{getTabName()}</p>
              {activeTab !== "history" && isConnected && (
                <p className="text-sm text-gray-500">
                  {activeTab === "proposal"
                    ? "点击上方按钮创建第一个提案"
                    : "点击上方按钮提交课程争议"}
                </p>
              )}
            </div>
          )}
        </>
      )}

      {/* Proposal Detail Modal */}
      {selectedProposal && (
        <ProposalModal
          proposal={selectedProposal}
          onClose={() => setSelectedProposal(null)}
          onVote={createVoteFn}
          isVoting={isVoting}
          userAddress={walletAddress}
          userVotingPower={tokenBalance}
          // 添加额外操作
          onClaimReward={() => claimReward(selectedProposal.id)}
          onFinalize={() => finalizeProposal(selectedProposal.id)}
        />
      )}

      {/* Submit Proposal Modal */}
      <SubmitProposalModal
        isOpen={showNewProposal}
        onClose={() => setShowNewProposal(false)}
        onSubmit={createNormalProposal}
        isSubmitting={isCreating}
        requiredDeposit={
          daoConfig ? formatUnits(daoConfig.proposalDeposit, 18) : "1000"
        }
        userBalance={tokenBalance ? formatUnits(tokenBalance, 18) : "0"}
      />

      {/* Submit Dispute Modal */}
      <SubmitDisputeModal
        isOpen={showNewDispute}
        onClose={() => setShowNewDispute(false)}
        onSubmit={createDisputeProposal}
        isSubmitting={isCreating}
        requiredDeposit={
          daoConfig ? formatUnits(daoConfig.proposalDeposit, 18) : "1000"
        }
        userBalance={tokenBalance ? formatUnits(tokenBalance, 18) : "0"}
      />
    </section>
  );
}
