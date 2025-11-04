"use client";

import { useState } from "react";

interface Project {
  id: number;
  title: string;
  description: string;
  budget: string;
  difficulty: "初级" | "中级" | "高级";
  category: string;
  deadline: string;
  applicants: number;
  verified: boolean;
  publisher: string;
  rating: number;
  source: "manual" | "crawler";
  tags: string[];
}

// 模拟项目数据
const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    title: "开发DeFi借贷协议智能合约",
    description:
      "需要开发一个去中心化借贷协议，支持多种代币抵押、利率算法优化、清算机制等核心功能。要求有Solidity开发经验，熟悉Aave、Compound等借贷协议。",
    budget: "50,000 - 80,000 YD",
    difficulty: "高级",
    category: "智能合约开发",
    deadline: "2024-12-31",
    applicants: 12,
    verified: true,
    publisher: "DeFi Labs",
    rating: 4.9,
    source: "manual",
    tags: ["Solidity", "DeFi", "智能合约"],
  },
  {
    id: 2,
    title: "NFT交易市场前端开发",
    description:
      "构建一个现代化的NFT交易平台前端，包括NFT展示、交易、钱包连接等功能。需要熟悉React、Web3.js，有NFT市场开发经验优先。",
    budget: "30,000 - 50,000 YD",
    difficulty: "中级",
    category: "前端开发",
    deadline: "2024-11-15",
    applicants: 23,
    verified: false,
    publisher: "NFT Studio",
    rating: 4.6,
    source: "crawler",
    tags: ["React", "Web3.js", "NFT"],
  },
  {
    id: 3,
    title: "区块链数据分析Dashboard",
    description:
      "开发一个实时区块链数据分析仪表板，展示链上交易、Gas费用、DeFi协议数据等。需要掌握数据可视化和区块链数据查询。",
    budget: "20,000 - 35,000 YD",
    difficulty: "中级",
    category: "数据分析",
    deadline: "2024-10-30",
    applicants: 8,
    verified: false,
    publisher: "Chain Analytics",
    rating: 4.3,
    source: "crawler",
    tags: ["数据分析", "区块链", "可视化"],
  },
  {
    id: 4,
    title: "DAO治理平台后端API开发",
    description:
      "为DAO治理平台开发后端API，包括提案管理、投票系统、通知服务等。需要熟悉Node.js、PostgreSQL，了解DAO治理机制。",
    budget: "40,000 - 60,000 YD",
    difficulty: "高级",
    category: "后端开发",
    deadline: "2024-12-15",
    applicants: 15,
    verified: true,
    publisher: "Governance DAO",
    rating: 4.8,
    source: "manual",
    tags: ["Node.js", "PostgreSQL", "DAO"],
  },
  {
    id: 5,
    title: "Web3钱包UI/UX设计",
    description:
      "设计一款现代化的Web3钱包界面，包括资产管理、交易历史、DApp连接等页面。需要有移动端设计经验，了解Web3用户习惯。",
    budget: "15,000 - 25,000 YD",
    difficulty: "初级",
    category: "UI/UX设计",
    deadline: "2024-11-01",
    applicants: 19,
    verified: true,
    publisher: "Wallet Team",
    rating: 4.7,
    source: "manual",
    tags: ["UI设计", "UX设计", "移动端"],
  },
];

interface ProjectListProps {
  filters: {
    category: string;
    difficulty: string;
    budget: string;
    sort: string;
  };
  searchQuery: string;
  canApply: boolean;
}

export default function ProjectList({
  filters,
  searchQuery,
  canApply,
}: ProjectListProps) {
  const [projects] = useState<Project[]>(MOCK_PROJECTS);

  // 筛选和排序逻辑
  const filteredProjects = projects
    .filter((project) => {
      // 类别筛选
      if (filters.category !== "all" && project.category !== filters.category) {
        return false;
      }

      // 难度筛选
      if (
        filters.difficulty !== "all" &&
        project.difficulty !== filters.difficulty
      ) {
        return false;
      }

      // 预算筛选
      if (filters.budget !== "all") {
        const budgetNum = parseInt(
          project.budget.split("-")[0].replace(/,/g, ""),
        );
        if (filters.budget === "0-20k" && budgetNum >= 20000) return false;
        if (
          filters.budget === "20k-50k" &&
          (budgetNum < 20000 || budgetNum >= 50000)
        )
          return false;
        if (filters.budget === "50k+" && budgetNum < 50000) return false;
      }

      // 搜索筛选
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      }

      return true;
    })
    .sort((a, b) => {
      switch (filters.sort) {
        case "budget-high":
          return (
            parseInt(b.budget.split("-")[0].replace(/,/g, "")) -
            parseInt(a.budget.split("-")[0].replace(/,/g, ""))
          );
        case "budget-low":
          return (
            parseInt(a.budget.split("-")[0].replace(/,/g, "")) -
            parseInt(b.budget.split("-")[0].replace(/,/g, ""))
          );
        case "deadline":
          return (
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          );
        case "applicants":
          return b.applicants - a.applicants;
        default: // latest
          return b.id - a.id;
      }
    });

  // 难度标签颜色
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "初级":
        return "bg-green-100 text-green-700";
      case "中级":
        return "bg-yellow-100 text-yellow-700";
      case "高级":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (filteredProjects.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto max-w-md">
          <svg
            className="mx-auto h-24 w-24 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="mt-6 text-xl font-bold text-gray-900">暂无匹配项目</h3>
          <p className="mt-2 text-gray-600">调整筛选条件或稍后再试</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredProjects.map((project) => (
        <div
          key={project.id}
          className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-[#8A71FF] hover:shadow-xl"
        >
          {/* 来源标签 */}
          <div className="absolute left-4 top-4 flex items-center gap-2">
            {project.source === "crawler" && (
              <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                <svg
                  className="h-3 w-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                爬虫
              </span>
            )}
          </div>

          {/* 认证标识 */}
          {project.verified && (
            <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              认证
            </div>
          )}

          {/* 项目标题 */}
          <h3 className="mb-3 mt-8 text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-[#8A71FF]">
            {project.title}
          </h3>

          {/* 项目描述 */}
          <p className="mb-4 text-sm text-gray-600 line-clamp-3">
            {project.description}
          </p>

          {/* 技能标签 */}
          <div className="mb-4 flex flex-wrap gap-2">
            {project.tags.map((tag, index) => (
              <span
                key={index}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 项目信息 */}
          <div className="mb-4 space-y-2 border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">预算</span>
              <span className="font-semibold text-gray-900">
                {project.budget}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">难度</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getDifficultyColor(project.difficulty)}`}
              >
                {project.difficulty}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">截止时间</span>
              <span className="font-medium text-gray-900">
                {project.deadline}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">申请人数</span>
              <span className="font-medium text-gray-900">
                {project.applicants} 人
              </span>
            </div>
          </div>

          {/* 发布者信息 */}
          <div className="mb-4 flex items-center gap-2 border-t border-gray-100 pt-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#8A71FF] to-[#FF9D6B] text-xs font-bold text-white">
              {project.publisher.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {project.publisher}
              </p>
              <div className="flex items-center gap-1">
                <svg
                  className="h-3 w-3 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs text-gray-600">
                  {project.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <button
            disabled={!canApply}
            className={`w-full rounded-xl px-6 py-3 font-semibold text-white transition-all ${
              canApply
                ? "bg-gradient-to-r from-[#8A71FF] to-[#FF9D6B] hover:scale-105 hover:shadow-lg"
                : "cursor-not-allowed bg-gray-300"
            }`}
          >
            {canApply ? "立即申请" : "需要YD币验证"}
          </button>
        </div>
      ))}
    </div>
  );
}
