"use client";

import { useState } from "react";
import type { ProposalsByStatus } from "@/types/dao";

// import { fetchProposals } from '@/lib/api'; // 假设有一个API调用函数

// 自定义 Hook 来管理提案数据
export function useProposals() {
  const [proposals, setProposals] = useState<ProposalsByStatus>();
  // 从API获取数据
  return { proposals };
}
