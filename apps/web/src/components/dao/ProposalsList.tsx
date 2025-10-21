"use client";

import React, { useState, useEffect } from "react";
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
import { createProposal, getProposals, vote } from "@/lib/api/dao";

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

  // 提案列表数据
  const [proposalsList, setProposalsList] = useState<Proposal[]>([]);
  const [disputesList, setDisputesList] = useState<Proposal[]>([]);
  const [historyList, setHistoryList] = useState<Proposal[]>([]);

  const { signMessage } = useWalletSign();
  const { address: walletAddress, isConnected } = useWalletInfo();

  // DAO 治理合约地址（创建提案的合约）
  const DAO_GOVERNANCE_CONTRACT = "0x5E3Ab3256cfa5C89bEb63DbB8e12ba42d63F216f";

  // 提案押金配置
  const PROPOSAL_DEPOSIT = parseUnits("1000", 18); // 普通提案押金: 1000 YD
  const DISPUTE_DEPOSIT = parseUnits("1000", 18); // 争议提案押金: 1000 YD

  // YD Token 合约交互
  const {
    allowance,
    approve,
    approveReceipt,
    refetchAllowance,
    balance: tokenBalance,
  } = useSimpleYDToken({
    address: CONTRACTS.YD_TOKEN,
    spenderAddress: DAO_GOVERNANCE_CONTRACT,
    enabled: isConnected,
  });

  // 初始化时获取数据
  useEffect(() => {
    getProposalsFn();
  }, []);

  // 当 activeTab 切换时重新获取数据
  useEffect(() => {
    getProposalsFn();
  }, [activeTab]);

  /**
   * 获取提案列表
   */
  const getProposalsFn = async () => {
    setIsLoading(true);
    try {
      const res: any = await getProposals({
        page: 1,
        limit: 100,
      });

      if (res?.success && res.data?.proposals) {
        // const proposals = res.data.proposals;
        // 先转换所有提案为统一格式
        const convertedProposals = convertApiToMockFormat(res.data);
        // 根据状态和类型分类提案
        // 活跃提案
        const activeProposals = convertedProposals.filter(
          (p) => p.status === "active" || p.status === "pending",
        );

        // 历史提案
        const historyProposals = convertedProposals.filter(
          (p) =>
            p.status === "executed" ||
            p.status === "rejected" ||
            p.status === "passed",
        );

        // 普通提案：没有关联课程
        setProposalsList(activeProposals.filter((p) => !(p as any).courseId));

        // 争议提案：有关联课程
        setDisputesList(activeProposals.filter((p) => !!(p as any).courseId));

        // 历史记录
        setHistoryList(historyProposals);
      }
    } catch (error) {
      console.error("获取提案列表失败:", error);
      alert("获取提案列表失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 检查并授权 Token
   */
  const checkAndApproveToken = async (requiredAmount: bigint) => {
    console.log("检查授权额度...");
    await refetchAllowance();

    if (!allowance || allowance < requiredAmount) {
      console.log("授权不足，开始授权...");
      // 授权 2 倍金额，避免频繁授权
      const approveAmount = requiredAmount * BigInt(2);
      const approveAmountStr = formatUnits(approveAmount, 18);

      const approveResult = await approve(
        DAO_GOVERNANCE_CONTRACT,
        approveAmountStr,
      );

      if (!approveResult) {
        throw new Error("授权失败，未返回交易哈希");
      }

      // 等待授权交易确认
      console.log("等待授权确认...");
      // approveReceipt 可能是一个可调用的函数，也可能是 hook 的返回对象（包含 refetch）
      let receipt: any = null;
      if (typeof approveReceipt === "function") {
        receipt = await approveReceipt(approveResult);
      } else if (
        approveReceipt &&
        typeof (approveReceipt as any).refetch === "function"
      ) {
        const r = await (approveReceipt as any).refetch(approveResult);
        // 有些实现会将回执放在 r.data 中
        receipt = r?.data ?? r;
      } else {
        console.warn("无法等待交易回执，跳过等待");
      }

      if (!receipt || receipt?.status !== "success") {
        throw new Error("授权交易失败");
      }
      console.log("授权成功");
    } else {
      console.log("授权额度充足");
    }
  };

  /**
   * 创建普通提案
   */
  const createNormalProposal = async (data: {
    title: string;
    type: string;
    description: string;
  }) => {
    if (isCreating) return;
    setIsCreating(true);

    try {
      // 1. 检查钱包连接
      if (!isConnected || !walletAddress) {
        throw new Error("请先连接钱包");
      }

      // 2. 检查 Token 余额
      if (!tokenBalance || tokenBalance < PROPOSAL_DEPOSIT) {
        throw new Error(
          `YD Token 余额不足。需要 ${formatUnits(PROPOSAL_DEPOSIT, 18)} YD，当前余额 ${formatUnits(tokenBalance || BigInt(0), 18)} YD`,
        );
      }

      // 3. 签名认证
      console.log("开始签名认证...");
      const timestamp = Date.now();
      const message = `提交提案
标题: ${data.title}
类型: ${data.type}
描述: ${data.description}
押金: ${formatUnits(PROPOSAL_DEPOSIT, 18)} YD
时间戳: ${timestamp}
钱包地址: ${walletAddress}`;

      let signature: string;
      try {
        const signResult = await signMessage(message);
        signature = signResult.signature;
        console.log("签名成功:", signature);
      } catch (signError) {
        console.log("用户拒绝签名");
        return;
      }

      // 4. 检查并授权 Token
      await checkAndApproveToken(PROPOSAL_DEPOSIT);

      // 5. 调用后端 API 创建提案（普通提案不关联课程）
      console.log("提交普通提案到后端...");
      const res = await createProposal({
        courseId: 0, // 普通提案不关联课程，传 0 或不传
        reason: `【${data.type}】${data.title}\n\n${data.description}`,
        proposerWallet: walletAddress,
        proposalDeposit: formatUnits(PROPOSAL_DEPOSIT, 18),
      });

      // createProposal 返回 Proposal 对象（或 null/undefined），通过 id 判断是否创建成功
      if (!res || !(res as any).id) {
        throw new Error("创建提案失败");
      }
      alert("提案创建成功！");

      // 6. 关闭弹窗并刷新列表
      setShowNewProposal(false);
      await getProposalsFn();
    } catch (error: any) {
      console.error("创建提案失败:", error);
      alert(error.message || "创建提案失败，请稍后重试");
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * 创建争议提案（课程质量投诉）
   */
  const createDisputeProposal = async (data: {
    type: string;
    target: string;
    description: string;
  }) => {
    if (isCreating) return;
    setIsCreating(true);

    try {
      // 1. 检查钱包连接
      if (!isConnected || !walletAddress) {
        throw new Error("请先连接钱包");
      }

      // 2. 检查 Token 余额
      if (!tokenBalance || tokenBalance < DISPUTE_DEPOSIT) {
        throw new Error(
          `YD Token 余额不足。需要 ${formatUnits(DISPUTE_DEPOSIT, 18)} YD，当前余额 ${formatUnits(tokenBalance || BigInt(0), 18)} YD`,
        );
      }

      // 3. 验证课程 ID
      const courseId = parseInt(data.target);
      if (!courseId || isNaN(courseId)) {
        throw new Error("请输入有效的课程 ID");
      }

      // 4. 签名认证
      console.log("开始签名认证...");
      const timestamp = Date.now();
      const message = `提交课程争议
争议类型: ${data.type}
课程ID: ${courseId}
描述: ${data.description}
押金: ${formatUnits(DISPUTE_DEPOSIT, 18)} YD
时间戳: ${timestamp}
钱包地址: ${walletAddress}`;

      let signature: string;
      try {
        const signResult = await signMessage(message);
        signature = signResult.signature;
        console.log("签名成功:", signature);
      } catch (signError) {
        console.log("用户拒绝签名");
        return;
      }

      // 5. 检查并授权 Token
      await checkAndApproveToken(DISPUTE_DEPOSIT);
      // 6. 调用后端 API 创建争议提案
      console.log("提交争议提案到后端...");
      const res = await createProposal({
        courseId: courseId,
        reason: `【${data.type}】${data.description}`,
        proposerWallet: walletAddress,
        proposalDeposit: formatUnits(DISPUTE_DEPOSIT, 18),
      });

      // createProposal 返回 Proposal 对象（或 null/undefined），通过 id 判断是否创建成功
      if (!res || !(res as any).id) {
        throw new Error("创建争议失败");
      }

      alert("争议提交成功！社区将对此进行投票。");

      // 7. 关闭弹窗并刷新列表
      setShowNewDispute(false);
      await getProposalsFn();
    } catch (error: any) {
      console.error("创建争议失败:", error);
      alert(error.message || "创建争议失败，请稍后重试");
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * 投票功能
   */
  const createVoteFn = async (proposalId: number, option: number) => {
    if (isVoting) return;
    setIsVoting(true);

    try {
      // 1. 检查钱包连接
      if (!isConnected || !walletAddress) {
        throw new Error("请先连接钱包");
      }

      // 2. 获取用户的投票权重（基于 YD Token 余额）
      if (!tokenBalance || tokenBalance === BigInt(0)) {
        throw new Error("您没有投票权重，请先获取 YD Token");
      }

      const votingPower = formatUnits(tokenBalance, 18);

      // 3. 签名认证
      const timestamp = Date.now();
      const optionText = option === 1 ? "支持" : "反对";
      const message = `投票
提案ID: ${proposalId}
选项: ${optionText}
投票权重: ${votingPower} YD
时间戳: ${timestamp}
钱包地址: ${walletAddress}`;

      let signature: string;
      try {
        const signResult = await signMessage(message);
        signature = signResult.signature;
        console.log("签名成功:", signature);
      } catch (signError) {
        console.log("用户拒绝签名");
        return;
      }

      // 4. 调用投票 API
      console.log("提交投票...");
      const res = await vote(proposalId, {
        option,
        voterWallet: walletAddress,
        votingPower,
      });

      if (!res?.success) {
        throw new Error(res?.message || "投票失败");
      }

      console.log("投票成功:", res.data);
      alert(`投票成功！您选择了【${optionText}】`);

      // 5. 关闭详情弹窗并刷新列表
      setSelectedProposal(null);
      await getProposalsFn();
    } catch (error: any) {
      console.error("投票失败:", error);
      alert(error.message || "投票失败，请稍后重试");
    } finally {
      setIsVoting(false);
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
          {...({
            proposal: selectedProposal,
            onClose: () => setSelectedProposal(null),
            onVote: createVoteFn,
            isVoting,
            userAddress: walletAddress,
          } as any)}
        />
      )}

      {/* Submit Proposal Modal */}
      <SubmitProposalModal
        isOpen={showNewProposal}
        onClose={() => setShowNewProposal(false)}
        onSubmit={createNormalProposal}
        isSubmitting={isCreating}
        requiredDeposit={formatUnits(PROPOSAL_DEPOSIT, 18)}
        userBalance={tokenBalance ? formatUnits(tokenBalance, 18) : "0"}
      />

      {/* Submit Dispute Modal */}
      <SubmitDisputeModal
        isOpen={showNewDispute}
        onClose={() => setShowNewDispute(false)}
        onSubmit={createDisputeProposal}
        isSubmitting={isCreating}
        requiredDeposit={formatUnits(DISPUTE_DEPOSIT, 18)}
        userBalance={tokenBalance ? formatUnits(tokenBalance, 18) : "0"}
      />
    </section>
  );
}
