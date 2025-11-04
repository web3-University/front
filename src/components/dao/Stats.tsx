"use client";

import { Award, TrendingUp, Users, Vote } from "lucide-react";

// 模拟数据
const stats = {
  totalVotes: "1,234,567",
  holders: "15,234",
  treasury: "500,000",
  proposalsCount: 45,
};

const STAT_ITEMS = [
  {
    icon: Vote,
    label: "总投票权重",
    value: stats.totalVotes,
    gradient: "from-blue-400 to-blue-600",
  },
  {
    icon: Users,
    label: "活跃提案",
    value: stats.holders,
    gradient: "from-green-400 to-green-600",
  },
  {
    icon: TrendingUp,
    label: "国库资金",
    value: `$${stats.treasury}`,
    gradient: "from-purple-400 to-purple-600",
  },
  {
    icon: Award,
    label: "提案总数",
    value: stats.proposalsCount,
    gradient: "from-orange-400 to-pink-600",
  },
];

export default function Stats() {
  return (
    <section className="relative">
      {/* ⭐ 响应式网格：移动端1列，平板2列，桌面4列 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
        {STAT_ITEMS.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              {/* 图标和标签 */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-xs sm:text-sm text-gray-300">
                  {item.label}
                </span>
              </div>

              {/* 数值 */}
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
