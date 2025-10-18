"use client";

import { Clock, Play, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useWalletInfo } from "@web3-university/uni-wallet-lib";
import { Button } from "@/components/ui/button";
import { getPurchasedCourses } from "@/lib/api/user";

type Course = {
  id: number;
  courseId: number;
  title: string;
  instructorName?: string;
  difficulty: string;
  progress?: number;
  completedLessons?: number;
  lessonCount?: number;
  duration?: number;
  price?: number;
  cover?: string;
  categories?: string[];
};

const levelConfig: Record<
  string,
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

// 课程图标映射
const getCourseIcon = (index: number) => {
  const icons = ["💻", "🖥️", "📈", "🎓", "🚀", "⚡"];
  return icons[index % icons.length];
};

export default function MyCoursesTab() {
  const { address, isConnected } = useWalletInfo();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      if (!address || !isConnected) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getPurchasedCourses(address);
        setCourses(response.data || []);
      } catch (err) {
        console.error("获取已购买课程失败:", err);
        setError(err instanceof Error ? err.message : "获取课程失败");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedCourses();
  }, [address, isConnected]);

  // 未连接钱包状态
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-6xl mb-4">🔌</div>
        <h3 className="text-xl font-bold text-[#2B2558] mb-2">请先连接钱包</h3>
        <p className="text-[#6A6D94]">连接钱包后查看您购买的课程</p>
      </div>
    );
  }

  // 加载状态
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-12 w-12 animate-spin text-[#8A71FF] mb-4" />
        <p className="text-[#6A6D94]">加载课程中...</p>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold text-[#2B2558] mb-2">加载失败</h3>
        <p className="text-[#6A6D94] mb-4">{error}</p>
        <Button variant="primary" onClick={() => window.location.reload()}>
          重新加载
        </Button>
      </div>
    );
  }

  // 空状态
  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-bold text-[#2B2558] mb-2">
          还没有购买课程
        </h3>
        <p className="text-[#6A6D94] mb-6">去课程市场探索更多精彩课程</p>
        <Link href="/market">
          <Button variant="primary">浏览课程市场</Button>
        </Link>
      </div>
    );
  }

  // 课程列表
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
        {courses.map((course, index) => {
          const levelInfo =
            levelConfig[course.difficulty?.toLowerCase()] ||
            levelConfig.beginner;
          const progress = course.progress || 0;
          const completedLessons = course.completedLessons || 0;
          const totalLessons = course.lessonCount || 0;
          const duration = course.duration || 0;
          const instructor = course.instructorName || "匿名讲师";

          return (
            <div
              key={course.id}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm shadow-md ring-1 ring-white/60 transition-all hover:shadow-xl"
            >
              {/* 课程封面 */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
                {/* 课程图标 */}
                <div className="absolute inset-0 flex items-center justify-center text-6xl">
                  {getCourseIcon(index)}
                </div>

                {/* 难度标签 */}
                <div className="absolute left-4 top-4">
                  <span
                    className={`rounded-full ${levelInfo.bgColor} ${levelInfo.color} px-3 py-1 text-xs font-medium backdrop-blur-sm`}
                  >
                    {levelInfo.label}
                  </span>
                </div>

                {/* 价格标签 */}
                {course.price && (
                  <div className="absolute right-4 top-4">
                    <span className="rounded-full bg-[#4CAF50] px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                      {course.price} YD
                    </span>
                  </div>
                )}
              </div>

              {/* 课程信息 */}
              <div className="p-5">
                {/* 课程标题 */}
                <h3 className="mb-2 text-lg font-bold text-[#2B2558] group-hover:text-[#8A71FF] transition-colors">
                  {course.title}
                </h3>

                {/* 讲师 */}
                <p className="mb-4 text-sm text-[#6A6D94]">
                  讲师：{instructor}
                </p>

                {/* 学习进度 */}
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-[#6A6D94]">学习进度</span>
                  <span className="font-bold text-[#2B2558]">{progress}%</span>
                </div>

                <div className="mb-3 h-2 overflow-hidden rounded-full bg-[#E8E6F5]">
                  <div
                    className="h-full bg-gradient-to-r from-[#8A71FF] to-[#9D82FF] transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="mb-4 text-xs text-[#6A6D94]">
                  {completedLessons}/{totalLessons} 课时完成
                </p>

                {/* 时间信息 */}
                <div className="mb-4 flex items-center gap-4 text-xs text-[#6A6D94]">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{duration}小时</span>
                  </div>
                </div>

                {/* 课程分类 */}
                {course.categories && course.categories.length > 0 && (
                  <div className="mb-4 rounded-lg bg-[#F8F8FF] p-3">
                    <p className="text-xs text-[#6A6D94]">
                      分类：{course.categories.join(", ")}
                    </p>
                  </div>
                )}

                {/* 继续学习按钮 */}
                <Link href={`/course/${course.courseId}`}>
                  <Button
                    variant="primary"
                    fullWidth
                    leftIcon={<Play className="h-4 w-4" />}
                  >
                    继续学习
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
