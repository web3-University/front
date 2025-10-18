"use client";

import { Award, TrendingUp, Users, Vote } from "lucide-react";

// 模拟数据
const stats = {
  totalVotes: "1,234,567",
  holders: "15,234",
  treasury: "500,000",
  proposalsCount: 45,
};

export default function Stats() {
  return (
    <section className="relative">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Vote className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-gray-300">总投票权重</span>
          </div>
          <p className="text-4xl font-bold text-white">{stats.totalVotes}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-gray-300">活跃提案</span>
          </div>
          <p className="text-4xl font-bold text-white">{stats.holders}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-gray-300">国库资金</span>
          </div>
          <p className="text-4xl font-bold text-white">${stats.treasury}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-gray-300">提案总数</span>
          </div>
          <p className="text-4xl font-bold text-white">
            {stats.proposalsCount}
          </p>
        </div>
      </div>
    </section>
  );
}
