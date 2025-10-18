"use client";

import { Clock, Play } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type CourseLevel = "beginner" | "intermediate" | "advanced";

type Course = {
  id: number;
  title: string;
  instructor: string;
  level: CourseLevel;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  timeRemaining: string;
  lastStudied: string;
  nextLesson: string;
  reward: number;
  image: string;
};

const levelConfig: Record<
  CourseLevel,
  { label: string; color: string; bgColor: string }
> = {
  beginner: {
    label: "初级",
    color: "text-[#4CAF50]",
    bgColor: "bg-[#4CAF50]/10",
  },
  intermediate: {
    label: "中级",
    color: "text-[#2196F3]",
    bgColor: "bg-[#2196F3]/10",
  },
  advanced: {
    label: "高级",
    color: "text-[#9C27B0]",
    bgColor: "bg-[#9C27B0]/10",
  },
};

const courses: Course[] = [
  {
    id: 1,
    title: "DeFi 协议开发实战",
    instructor: "匿名讲师A",
    level: "intermediate",
    progress: 75,
    completedLessons: 18,
    totalLessons: 24,
    timeRemaining: "3小时",
    lastStudied: "2小时前",
    nextLesson: "流动性挖矿机制",
    reward: 45,
    image: "/course-1.jpg",
  },
  {
    id: 2,
    title: "Web3 前端开发",
    instructor: "BlockDev",
    level: "beginner",
    progress: 40,
    completedLessons: 13,
    totalLessons: 32,
    timeRemaining: "8小时",
    lastStudied: "1天前",
    nextLesson: "连接MetaMask钱包",
    reward: 25,
    image: "/course-2.jpg",
  },
  {
    id: 3,
    title: "NFT 市场构建指南",
    instructor: "CryptoBuilder",
    level: "advanced",
    progress: 90,
    completedLessons: 14,
    totalLessons: 16,
    timeRemaining: "1小时",
    lastStudied: "昨天",
    nextLesson: "部署到主网",
    reward: 80,
    image: "/course-3.jpg",
  },
];

export default function MyCoursesTab() {
  return (
    <div className="space-y-6">
      {/* 页面标题和浏览更多按钮 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#2B2558]">我的课程</h2>
        <Link href="/market">
          <Button variant="primary" size="sm">
            浏览更多课程
          </Button>
        </Link>
      </div>

      {/* 课程卡片列表 */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm shadow-md ring-1 ring-white/60 transition-all hover:shadow-xl"
          >
            {/* 课程封面 */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
              {/* 模拟课程图片 */}
              <div className="absolute inset-0 flex items-center justify-center text-6xl">
                {course.id === 1 && "💻"}
                {course.id === 2 && "🖥️"}
                {course.id === 3 && "📈"}
              </div>

              {/* 难度标签 */}
              <div className="absolute left-4 top-4">
                <span
                  className={`rounded-full ${levelConfig[course.level].bgColor} ${levelConfig[course.level].color} px-3 py-1 text-xs font-medium backdrop-blur-sm`}
                >
                  {levelConfig[course.level].label}
                </span>
              </div>

              {/* 奖励标签 */}
              <div className="absolute right-4 top-4">
                <span className="rounded-full bg-[#4CAF50] px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                  +{course.reward} YD
                </span>
              </div>
            </div>

            {/* 课程信息 */}
            <div className="p-5">
              {/* 课程标题 */}
              <h3 className="mb-2 text-lg font-bold text-[#2B2558] group-hover:text-[#8A71FF] transition-colors">
                {course.title}
              </h3>

              {/* 讲师 */}
              <p className="mb-4 text-sm text-[#6A6D94]">
                讲师：{course.instructor}
              </p>

              {/* 学习进度 */}
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-[#6A6D94]">学习进度</span>
                <span className="font-bold text-[#2B2558]">
                  {course.progress}%
                </span>
              </div>

              <div className="mb-3 h-2 overflow-hidden rounded-full bg-[#E8E6F5]">
                <div
                  className="h-full bg-gradient-to-r from-[#8A71FF] to-[#9D82FF] transition-all"
                  style={{ width: `${course.progress}%` }}
                />
              </div>

              <p className="mb-4 text-xs text-[#6A6D94]">
                {course.completedLessons}/{course.totalLessons} 课时完成
              </p>

              {/* 时间信息 */}
              <div className="mb-4 flex items-center gap-4 text-xs text-[#6A6D94]">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>剩余 {course.timeRemaining}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>最后学习：{course.lastStudied}</span>
                </div>
              </div>

              {/* 下一课 */}
              <div className="mb-4 rounded-lg bg-[#F8F8FF] p-3">
                <p className="mb-1 text-xs text-[#6A6D94]">下一课：</p>
                <p className="font-medium text-[#2B2558]">
                  {course.nextLesson}
                </p>
              </div>

              {/* 继续学习按钮 */}
              <Button
                variant="primary"
                fullWidth
                leftIcon={<Play className="h-4 w-4" />}
              >
                继续学习
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
