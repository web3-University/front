"use client";

import { Book, Flame, Star, Trophy } from "lucide-react";
import ContinueLearning from "./ContinueLearning";
import RecentAchievements from "./RecentAchievements";
import RecommendedCourses from "./RecommendedCourses";
import StatsGrid from "./StatsGrid";
import WeeklyGoal from "./WeeklyGoal";

export default function OverviewTab() {
  const stats = [
    {
      icon: <Book className="h-6 w-6" />,
      value: "12",
      label: "在学课程",
      color: "from-[#5B9EFF] to-[#4A8EFF]",
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      value: "3",
      label: "已完成",
      color: "from-[#4CAF50] to-[#45A049]",
    },
    {
      icon: <Flame className="h-6 w-6" />,
      value: "23",
      label: "连续天数",
      color: "from-[#FF8A6B] to-[#FF7A5C]",
    },
    {
      icon: <Star className="h-6 w-6" />,
      value: "黄金学者",
      label: "学者等级",
      color: "from-[#FFD700] to-[#FFC700]",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 统计卡片网格 */}
      <StatsGrid stats={stats} />

      {/* 继续学习和本周目标 */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <ContinueLearning />
        <WeeklyGoal />
      </div>

      {/* 最新成就 */}
      <RecentAchievements />

      {/* 推荐课程 */}
      <RecommendedCourses />
    </div>
  );
}
