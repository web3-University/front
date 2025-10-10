"use client";

import { Target } from "lucide-react";

export default function WeeklyGoal() {
  const currentHours = 7;
  const targetHours = 10;
  const percentage = Math.round((currentHours / targetHours) * 100);
  const reward = 10;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-white/80 to-white/60 p-6 backdrop-blur-sm shadow-md ring-1 ring-white/60">
      <div className="mb-4 flex items-center gap-2">
        <Target className="h-5 w-5 text-[#8A71FF]" />
        <h2 className="text-xl font-bold text-[#2B2558]">本周目标</h2>
      </div>

      {/* 目标进度 */}
      <div className="mb-6 text-center">
        <div className="mb-2">
          <span className="text-5xl font-bold text-[#2B2558]">
            {currentHours}
          </span>
          <span className="text-2xl text-[#6A6D94]">/{targetHours}</span>
        </div>
        <div className="text-sm text-[#6A6D94]">小时</div>
      </div>

      {/* 圆形进度条 */}
      <div className="mb-6 flex justify-center">
        <div className="relative h-32 w-32">
          <svg className="h-full w-full -rotate-90 transform">
            {/* 背景圆 */}
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#E8E6F5"
              strokeWidth="12"
              fill="none"
            />
            {/* 进度圆 */}
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8A71FF" />
                <stop offset="100%" stopColor="#9D82FF" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-[#8A71FF]">
              {percentage}%
            </span>
          </div>
        </div>
      </div>

      {/* 本周进度文字 */}
      <div className="mb-4 text-center text-sm text-[#6A6D94]">本周已学习</div>

      {/* 奖励提示 */}
      <div className="rounded-xl bg-gradient-to-r from-[#F0E8FF] to-[#F4EFFF] p-3 text-center">
        <div className="mb-1 flex items-center justify-center gap-1 text-sm text-[#6A6D94]">
          <span>🎁</span>
          <span>完成本周目标可获得额外</span>
        </div>
        <div className="font-bold text-[#8A71FF]">{reward} YD代币奖励！</div>
      </div>
    </div>
  );
}
