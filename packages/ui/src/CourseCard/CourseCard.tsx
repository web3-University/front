import {
  BarChart3,
  BookOpen,
  Clock,
  Play,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import type React from "react";

export interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description?: string;
    category: string;
    instructor: string;
    rating: number;
    students: number;
    duration?: number;
    difficulty?: string;
    price: number;
    coverColor: string;
  };
  onDetail?: (course: CourseCardProps["course"]) => void;
  clickable?: boolean;
  children?: React.ReactNode;
}

export const CourseCard: React.FC<CourseCardProps> = (props) => {
  const { course, onDetail, clickable = true, children } = props;

  // 添加安全检查
  if (!course) {
    console.error("CourseCard: course prop is required");
    return null;
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // 如果点击的是按钮区域，不触发卡片点击
    if ((e.target as HTMLElement).closest('[data-slot="actions"]')) {
      return;
    }

    if (clickable && onDetail) {
      onDetail(course);
    }
  };

  // 难度级别映射
  const getDifficultyLabel = (difficulty?: string) => {
    switch (difficulty) {
      case "1":
        return {
          label: "初级",
          color: "text-green-600",
          bgColor: "bg-green-100",
        };
      case "2":
        return {
          label: "中级",
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        };
      case "3":
        return {
          label: "高级",
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        };
      default:
        return {
          label: "初级",
          color: "text-green-600",
          bgColor: "bg-green-100",
        };
    }
  };

  // 格式化时长
  const formatDuration = (duration?: number) => {
    if (!duration) return "未知时长";
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours > 0) {
      return minutes > 0 ? `${hours}小时${minutes}分钟` : `${hours}小时`;
    }
    return `${minutes}分钟`;
  };

  const difficultyInfo = getDifficultyLabel(course.difficulty);

  return (
    <article
      key={course.id}
      onClick={handleCardClick}
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl bg-gradient-to-b from-white to-[#F7F5FF] px-6 pb-6 pt-6 shadow-[0_22px_60px_rgba(168,174,255,0.22)] ring-1 ring-[#ECEBFF] transition-transform duration-200 hover:-translate-y-2 ${
        clickable ? "cursor-pointer" : ""
      }`}
    >
      <div
        className={`relative h-48 w-full overflow-hidden rounded-2xl bg-gradient-to-br ${course.coverColor || "from-gray-400 to-gray-600"}`}
      >
        {/* 课程封面图片区域 */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* 主要图标 */}
          <div className="relative">
            <BookOpen className="h-16 w-16 text-white/80" strokeWidth={1.5} />
            <Play
              className="absolute -bottom-2 -right-2 h-8 w-8 text-white/60"
              strokeWidth={1.5}
            />
          </div>

          {/* 装饰性元素 */}
          <div className="absolute top-8 left-8">
            <div className="h-3 w-3 rounded-full bg-white/30"></div>
          </div>
          <div className="absolute bottom-8 right-8">
            <div className="h-2 w-2 rounded-full bg-white/40"></div>
          </div>
          <div className="absolute top-16 right-12">
            <div className="h-1.5 w-1.5 rounded-full bg-white/50"></div>
          </div>

          {/* 课程相关文字 */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between text-white/70 text-xs">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                在线课程
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                随时学习
              </span>
            </div>
          </div>
        </div>

        <span className="absolute left-4 top-4 inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#2B2558]">
          {course.category || "未分类"}
        </span>
        {course.difficulty && (
          <span
            className={`absolute right-4 top-4 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${difficultyInfo.bgColor} ${difficultyInfo.color}`}
          >
            <BarChart3 className="h-3 w-3" />
            {difficultyInfo.label}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 pt-6 text-left">
        <div>
          <h3 className="text-xl font-semibold text-[#2B2558] line-clamp-2">
            {course.title || "未命名课程"}
          </h3>
          {course.description && (
            <p className="mt-2 text-sm text-[#7B7EA9] line-clamp-2">
              {course.description}
            </p>
          )}
          <p className="mt-2 text-sm text-[#7B7EA9]">
            讲师：{course.instructor || "未知"}
          </p>
        </div>

        {/* 课程信息行 */}
        <div className="flex items-center justify-between text-xs text-[#8F92B5]">
          <div className="flex items-center gap-4">
            {course.duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatDuration(course.duration)}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-[#F5B742]">
              <Star className="h-3 w-3 fill-[#F5B742] text-[#F5B742]" />
              <span className="font-semibold">
                {(course.rating || 0).toFixed(1)}
              </span>
              <span className="text-[#8F92B5]">({course.students || 0}人)</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[#FF9F50]">
            <Wallet className="h-4 w-4" />
            <span className="text-base font-semibold">
              YD {course.price || 0}
            </span>
          </div>
        </div>

        {/* 插槽区域 */}
        {children && <div data-slot="actions">{children}</div>}
      </div>
    </article>
  );
};
