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
    cover?: string; // 新增：课程封面
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

  // 根据课程类别获取对应的美观颜色方案
  const getCategoryColors = (category: string) => {
    const categoryLower = category.toLowerCase();

    if (
      categoryLower.includes("区块链") ||
      categoryLower.includes("blockchain") ||
      categoryLower.includes("web3")
    ) {
      return "from-emerald-400 via-teal-500 to-cyan-600";
    }
    if (
      categoryLower.includes("编程") ||
      categoryLower.includes("开发") ||
      categoryLower.includes("programming") ||
      categoryLower.includes("development")
    ) {
      return "from-blue-500 via-indigo-600 to-purple-700";
    }
    if (
      categoryLower.includes("数据") ||
      categoryLower.includes("分析") ||
      categoryLower.includes("data") ||
      categoryLower.includes("analytics")
    ) {
      return "from-orange-400 via-red-500 to-pink-600";
    }
    if (
      categoryLower.includes("用户") ||
      categoryLower.includes("ui") ||
      categoryLower.includes("ux") ||
      categoryLower.includes("设计")
    ) {
      return "from-violet-500 via-purple-600 to-fuchsia-700";
    }
    if (
      categoryLower.includes("人工智能") ||
      categoryLower.includes("ai") ||
      categoryLower.includes("机器学习") ||
      categoryLower.includes("ml")
    ) {
      return "from-green-400 via-emerald-500 to-teal-600";
    }
    if (
      categoryLower.includes("安全") ||
      categoryLower.includes("security") ||
      categoryLower.includes("网络")
    ) {
      return "from-red-500 via-rose-600 to-pink-700";
    }

    // 默认渐变色 - 优雅的蓝紫色渐变
    return "from-indigo-500 via-purple-600 to-blue-700";
  };
  const getCategoryIcon = (category: string) => {
    const categoryLower = category.toLowerCase();

    if (
      categoryLower.includes("区块链") ||
      categoryLower.includes("blockchain") ||
      categoryLower.includes("web3")
    ) {
      return <Wallet className="h-8 w-8 text-white" />;
    }
    if (
      categoryLower.includes("编程") ||
      categoryLower.includes("开发") ||
      categoryLower.includes("programming") ||
      categoryLower.includes("development")
    ) {
      return <BookOpen className="h-8 w-8 text-white" />;
    }
    if (
      categoryLower.includes("数据") ||
      categoryLower.includes("分析") ||
      categoryLower.includes("data") ||
      categoryLower.includes("analytics")
    ) {
      return <BarChart3 className="h-8 w-8 text-white" />;
    }
    if (
      categoryLower.includes("用户") ||
      categoryLower.includes("ui") ||
      categoryLower.includes("ux") ||
      categoryLower.includes("设计")
    ) {
      return <Users className="h-8 w-8 text-white" />;
    }

    // 默认图标
    return <BookOpen className="h-8 w-8 text-white" />;
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
      className={`group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-[#8A71FF] hover:shadow-xl ${
        clickable ? "cursor-pointer" : ""
      }`}
    >
      {/* 课程封面图片区域 */}
      <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl">
        {course.cover ? (
          /* 有封面图片时显示图片 */
          <img
            src={course.cover}
            alt={course.title || "课程封面"}
            className="h-full w-full object-cover"
          />
        ) : (
          /* 没有封面图片时显示简洁的默认背景 */
          <div
            className={`h-full w-full bg-gradient-to-br ${
              course.coverColor || getCategoryColors(course.category)
            }`}
          />
        )}

        {/* 难度标签 - 右上角 */}
        {course.difficulty && (
          <div className="absolute right-4 top-4">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${difficultyInfo.bgColor} ${difficultyInfo.color}`}
            >
              <BarChart3 className="h-3 w-3" />
              {difficultyInfo.label}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div>
          <h3 className="mb-3 text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-[#8A71FF]">
            {course.title || "未命名课程"}
          </h3>
          {course.description && (
            <p className="mb-4 text-sm text-gray-600 line-clamp-3">
              {course.description}
            </p>
          )}
        </div>

        {/* 课程信息 */}
        <div className="mb-4 space-y-2 border-t border-gray-100 pt-4">
          {course.duration && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">时长</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span className="font-medium text-gray-900">
                  {formatDuration(course.duration)}
                </span>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">评分</span>
            <div className="flex items-center gap-1 text-[#F5B742]">
              <Star className="h-3 w-3 fill-[#F5B742] text-[#F5B742]" />
              <span className="font-semibold">
                {(course.rating || 0).toFixed(1)}
              </span>
              <span className="text-gray-500">({course.students || 0}人)</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">价格</span>
            <div className="flex items-center gap-1 text-[#FF9F50]">
              <Wallet className="h-4 w-4" />
              <span className="font-semibold text-gray-900">
                YD {course.price || 0}
              </span>
            </div>
          </div>
        </div>

        {/* 插槽区域 */}
        {children && (
          <div data-slot="actions" className="mt-4">
            {children}
          </div>
        )}
      </div>
    </article>
  );
};
