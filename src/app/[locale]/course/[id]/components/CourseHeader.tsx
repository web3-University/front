"use client";

import {
  Award,
  Calendar,
  Clock,
  GraduationCap,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import type { Course } from "@/lib/api/course";
import {
  formatCourseDuration,
  formatDate,
  formatNumber,
} from "@/lib/utils/formatters";

interface CourseHeaderProps {
  course: Course;
}

const difficultyMap: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  "1": {
    label: "初级",
    color: "text-green-600",
    bgColor: "bg-green-50 border-green-200",
  },
  "2": {
    label: "中级",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 border-yellow-200",
  },
  "3": {
    label: "高级",
    color: "text-red-600",
    bgColor: "bg-red-50 border-red-200",
  },
};

const statusMap: Record<
  string,
  { label: string; chipClass: string; dotClass: string }
> = {
  "0": {
    label: "草稿",
    chipClass: "bg-white/10 border-white/20 text-white/70",
    dotClass: "bg-yellow-300",
  },
  "1": {
    label: "已发布",
    chipClass: "bg-emerald-400/20 border-emerald-200/40 text-white",
    dotClass: "bg-emerald-300",
  },
  "2": {
    label: "已下架",
    chipClass: "bg-white/10 border-white/20 text-white/60",
    dotClass: "bg-red-300",
  },
};

export default function CourseHeader({ course }: CourseHeaderProps) {
  const difficulty = difficultyMap[course.difficulty] || {
    label: "未知",
    color: "text-gray-600",
    bgColor: "bg-gray-50 border-gray-200",
  };

  const courseStatus = statusMap[course.status ?? ""] ?? {
    label: "状态未知",
    chipClass: "bg-white/10 border-white/20 text-white/70",
    dotClass: "bg-white/70",
  };

  const isCourseFree = course.isFree === true || course.isFree === "1";

  const instructorDisplay =
    course.instructorName ||
    (course.instructorId ? `讲师 #${course.instructorId}` : "未知讲师");

  const userProgresses = (course as { userProgresses?: unknown[] })
    .userProgresses;
  const enrolledCount =
    course.studentCount ??
    course.purchaseCount ??
    (Array.isArray(userProgresses) ? userProgresses.length : undefined) ??
    0;

  const displayCategories = course.categories?.length
    ? course.categories
    : ["未分类"];

  const courseIdentifier = course.courseId;

  const formattedCourseDuration = formatCourseDuration(course.duration);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-8 md:p-12 mb-8 shadow-2xl">
      {/* 装饰性背景 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Sparkles className="h-32 w-32 text-white/5" />
        </div>
      </div>

      <div className="relative z-10">
        {/* 分类和难度标签 */}
        <div className="flex flex-wrap gap-3 mb-6">
          {displayCategories.map((category, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold text-white border border-white/30"
            >
              <GraduationCap className="h-4 w-4" />
              {category}
            </span>
          ))}
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold text-white border border-white/30">
            <TrendingUp className="h-4 w-4" />
            {difficulty.label}
          </span>
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 backdrop-blur-md rounded-full text-sm font-semibold border ${courseStatus.chipClass}`}
          >
            <span className={`h-2 w-2 rounded-full ${courseStatus.dotClass}`} />
            {courseStatus.label}
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold text-white border border-white/30">
            <Wallet className="h-4 w-4" />
            {isCourseFree ? "免费课程" : "付费课程"}
          </span>
        </div>

        {/* 课程标题 */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
          {course.title}
        </h1>

        {/* 课程描述 */}
        {course.description && course.description.trim() && (
          <p className="text-white/90 text-lg mb-8 max-w-3xl leading-relaxed">
            {course.description}
          </p>
        )}

        {/* 课程统计信息 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-5 w-5 text-yellow-300" />
              <span className="text-white/70 text-sm">评分</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {(course.rating || 0).toFixed(1)}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-5 w-5 text-blue-300" />
              <span className="text-white/70 text-sm">学习人数</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatNumber(enrolledCount)}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-5 w-5 text-green-300" />
              <span className="text-white/70 text-sm">课程时长</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {formattedCourseDuration}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-5 w-5 text-pink-200" />
              <span className="text-white/70 text-sm">课程编号</span>
            </div>
            <p className="text-lg font-semibold text-white truncate">
              {courseIdentifier ? `#${courseIdentifier}` : "待分配"}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/80">
          <span className="inline-flex items-center gap-2">
            <Award className="h-4 w-4 text-white/80" />
            授课讲师 {instructorDisplay}
          </span>
          <span className="inline-flex items-center gap-2">
            <Calendar className="h-4 w-4 text-white/70" />
            最近更新 {formatDate(course.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
