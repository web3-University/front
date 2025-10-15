import { Star, Wallet, Users, Clock } from "lucide-react";
import type React from "react";

export interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    category: string;
    instructor: string;
    rating: number;
    students: number;
    price: number;
    coverColor: string;
    duration?: number; // 课程时长（秒）
    difficulty?: string; // 课程难度：1-初级，2-中级，3-高级
  };
  onDetail?: (course: CourseCardProps["course"]) => void;
  clickable?: boolean;
  children?: React.ReactNode;
}

// 难度等级映射
const getDifficultyConfig = (difficulty?: string) => {
  switch (difficulty) {
    case "1":
      return {
        label: "初级",
        bgColor: "bg-green-500/90",
        textColor: "text-white",
      };
    case "2":
      return {
        label: "中级",
        bgColor: "bg-yellow-500/90",
        textColor: "text-white",
      };
    case "3":
      return {
        label: "高级",
        bgColor: "bg-red-500/90",
        textColor: "text-white",
      };
    default:
      return {
        label: "未知",
        bgColor: "bg-gray-400/90",
        textColor: "text-white",
      };
  }
};

export const CourseCard: React.FC<CourseCardProps> = (props) => {
  const { course, onDetail, clickable = true, children } = props;

  // 添加安全检查
  if (!course) {
    console.error("CourseCard: course prop is required");
    return null;
  }

  const difficultyConfig = getDifficultyConfig(course.difficulty);

  const handleCardClick = (e: React.MouseEvent) => {
    // 如果点击的是按钮区域，不触发卡片点击
    if ((e.target as HTMLElement).closest('[data-slot="actions"]')) {
      return;
    }

    if (clickable && onDetail) {
      onDetail(course);
    }
  };

  return (
    <article
      key={course.id}
      onClick={handleCardClick}
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl bg-gradient-to-b from-white to-[#F7F5FF] px-6 pb-6 pt-6 shadow-[0_22px_60px_rgba(168,174,255,0.22)] ring-1 ring-[#ECEBFF] transition-transform duration-200 hover:-translate-y-2 ${
        clickable ? "cursor-pointer" : ""
      }`}
    >
      <div className="relative h-48 w-full overflow-hidden rounded-2xl">
        <img
          src={course.coverColor}
          alt={course.title || "课程封面"}
          className="h-full w-full object-cover"
        />
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="rounded-full bg-blue-500/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {course.category || "未分类"}
          </span>
          <span
            className={`rounded-full ${difficultyConfig.bgColor} px-3 py-1 text-xs font-semibold ${difficultyConfig.textColor} backdrop-blur-sm`}
          >
            {difficultyConfig.label}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 pt-6 text-left">
        <div>
          <h3 className="text-xl font-semibold text-[#2B2558]">
            {course.title || "未命名课程"}
          </h3>
          <p className="mt-2 text-sm text-[#7B7EA9] truncate">
            {course.description || "暂无描述"}
          </p>
          <p className="mt-2 text-sm text-[#7B7EA9]">
            讲师：{course.instructor || "未知"}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-[#F5B742]">
            <Star className="h-4 w-4 fill-[#F5B742] text-[#F5B742]" />
            <span className="font-semibold">
              {(course.rating || 0).toFixed(1)}
            </span>
            <Users className="h-3.5 w-3.5 text-[#8F92B5]" />
            <span className="text-xs text-[#8F92B5]">
              {course.students || 0}
            </span>
            <Clock className="ml-2 h-3.5 w-3.5 text-[#8F92B5]" />
            <span className="text-xs text-[#8F92B5]">
              {((course.duration || 0) / 3600).toFixed(1)}h
            </span>
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
