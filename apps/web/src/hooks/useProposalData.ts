"use client";

import { useState, useCallback, useEffect } from "react";
import { getProposals as apiGetProposals, Proposal } from "@/lib/api/dao";
import { useDao } from "@web3-university/uni-wallet-lib";

/**
 * 🎯 提案数据管理 Hook
 *
 * 负责提案数据的获取、同步、分类
 *
 * 数据策略：
 * 1. 先从 API 获取基础数据（快速展示）
 * 2. 组件层面通过 useDao hooks 获取链上数据
 * 3. 提供更新方法供组件层使用
 */
export function useProposalData(daoAddress: string) {
  const dao = useDao(daoAddress as `0x${string}`);

  const [isLoading, setIsLoading] = useState(false);
  const [proposalsList, setProposalsList] = useState<Proposal[]>([]);
  const [disputesList, setDisputesList] = useState<Proposal[]>([]);
  const [historyList, setHistoryList] = useState<Proposal[]>([]);

  /**
   * 🎯 映射提案状态
   */
  const mapProposalStatus = useCallback((status: number): string => {
    const statusMap: { [key: number]: string } = {
      0: "Pending",
      1: "Active",
      2: "Failed",
      3: "Succeeded",
      4: "Executed",
      5: "Cancelled",
    };
    return statusMap[status] || "Unknown";
  }, []);

  /**
   * 📋 获取提案列表（API 数据）
   *
   * 策略：先快速展示 API 数据，链上数据由组件层更新
   */
  const fetchProposals = useCallback(async () => {
    setIsLoading(true);
    try {
      // 从后端 API 获取提案数据
      const res: any = await apiGetProposals({
        page: 1,
        limit: 100,
      });

      if (res?.data?.proposals) {
        const apiProposals = res.data.proposals;

        // 分类提案
        const activeProposals = apiProposals.filter(
          (p: any) =>
            p.status === "Active" ||
            p.status === "active" ||
            p.status === "Pending",
        );

        const completedProposals = apiProposals.filter(
          (p: any) =>
            p.status === "Executed" ||
            p.status === "Succeeded" ||
            p.status === "Failed" ||
            p.status === "Cancelled",
        );

        // 根据类型分类
        const disputes = activeProposals.filter(
          (p: any) => p.category === "课程争议",
        );
        const proposals = activeProposals.filter(
          (p: any) => p.category !== "课程争议",
        );

        setDisputesList(disputes);
        setProposalsList(proposals);
        setHistoryList(completedProposals);
      } else {
        // 如果没有数据，设置为空数组
        setDisputesList([]);
        setProposalsList([]);
        setHistoryList([]);
      }
    } catch (error) {
      console.error("获取提案列表失败:", error);
      // 出错时也设置为空数组，避免一直 loading
      setDisputesList([]);
      setProposalsList([]);
      setHistoryList([]);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 空依赖，避免无限循环

  /**
   * 🔄 更新单个提案的链上数据
   *
   * 供组件层调用，用于更新从 useDao().getProposal() 获取的链上数据
   */
  const updateProposalWithChainData = useCallback(
    (
      proposalId: number,
      chainData: {
        forVotes?: number | bigint;
        againstVotes?: number | bigint;
        status?: number;
        startTime?: bigint;
        endTime?: bigint;
        proposer?: string;
      },
    ) => {
      const updateFn = (prev: Proposal[]) =>
        prev.map((p) => {
          // 注意：Proposal 使用 proposalId 字段
          if (p.proposalId === proposalId) {
            const updates: Partial<Proposal> = {};

            // forVotes 和 againstVotes 在 Proposal 中是 string 类型
            if (chainData.forVotes !== undefined) {
              updates.forVotes = String(chainData.forVotes);
            }
            if (chainData.againstVotes !== undefined) {
              updates.againstVotes = String(chainData.againstVotes);
            }
            if (chainData.status !== undefined) {
              updates.status = mapProposalStatus(chainData.status) as any;
            }
            if (chainData.startTime !== undefined) {
              updates.votingStartTime = new Date(
                Number(chainData.startTime) * 1000,
              ).toISOString();
            }
            if (chainData.endTime !== undefined) {
              updates.votingEndTime = new Date(
                Number(chainData.endTime) * 1000,
              ).toISOString();
            }
            if (chainData.proposer !== undefined) {
              updates.proposerWallet = chainData.proposer;
            }

            return { ...p, ...updates };
          }
          return p;
        });

      // 更新所有列表
      setProposalsList(updateFn);
      setDisputesList(updateFn);
      setHistoryList(updateFn);
    },
    [mapProposalStatus],
  );

  /**
   * 🔄 刷新提案数据（重新获取 API）
   */
  const refreshProposal = useCallback(
    async (proposalId: string) => {
      try {
        // 重新获取所有提案
        await fetchProposals();
        return { id: Number(proposalId) };
      } catch (error) {
        console.error(`刷新提案 ${proposalId} 失败:`, error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [], // fetchProposals 通过闭包访问
  );

  return {
    // 状态
    isLoading,
    proposalsList,
    disputesList,
    historyList,

    // 方法
    fetchProposals,
    refreshProposal,
    updateProposalWithChainData, // 新增：供组件层更新链上数据

    // 工具
    mapProposalStatus,
  };
}
