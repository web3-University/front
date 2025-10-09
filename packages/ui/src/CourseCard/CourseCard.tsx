import { Star, Wallet } from "lucide-react";
import type React from "react";

export interface CourseCardProps {
  course: {
    id: string;
    title: string;
    category: string;
    instructor: string;
    rating: number;
    students: number;
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
        <span className="absolute left-4 top-4 inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#2B2558]">
          {course.category || "未分类"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 pt-6 text-left">
        <div>
          <h3 className="text-xl font-semibold text-[#2B2558]">
            {course.title || "未命名课程"}
          </h3>
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
            <span className="text-xs text-[#8F92B5]">
              ({course.students || 0}人)
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
