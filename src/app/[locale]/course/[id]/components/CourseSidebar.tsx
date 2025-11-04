"use client";

import {
  CheckCircle2,
  Loader2,
  ShoppingCart,
  Sparkles,
  Wallet,
} from "lucide-react";
import type { Course } from "@/lib/api/course";
import { formatCourseDuration } from "@/lib/utils/formatters";

interface CourseSidebarProps {
  course: Course;
  lessonCount: number;
  isPurchasing: boolean;
  onPurchase: () => void;
}

export default function CourseSidebar({
  course,
  lessonCount,
  isPurchasing,
  onPurchase,
}: CourseSidebarProps) {
  const rawPrice =
    typeof course.price === "string"
      ? parseFloat(course.price)
      : (course.price ?? 0);
  const coursePrice = Number.isFinite(rawPrice) ? rawPrice : 0;
  const isCourseFree = course.isFree === true || course.isFree === "1";

  const formattedCourseDuration = formatCourseDuration(course.duration);

  return (
    <div className="sticky top-32">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* 封面图片 */}
        {course.cover && (
          <div className="relative h-56 overflow-hidden">
            <img
              src={course.cover}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        )}

        <div className="p-6">
          {/* 价格信息 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600 font-medium">课程价格</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  isCourseFree
                    ? "bg-green-100 text-green-600"
                    : "bg-purple-100 text-purple-600"
                }`}
              >
                {isCourseFree ? "免费课程" : "付费课程"}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <Wallet className="h-8 w-8 text-orange-500" />
              <span className="text-4xl font-bold text-[#2B2558]">
                {isCourseFree
                  ? "免费"
                  : coursePrice.toLocaleString("zh-CN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
              </span>
              {!isCourseFree && (
                <span className="text-xl font-semibold text-orange-500">
                  YD
                </span>
              )}
            </div>
          </div>

          {/* 购买按钮 */}
          <button
            onClick={onPurchase}
            disabled={isPurchasing}
            className="w-full py-4 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
            {isPurchasing ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin relative z-10" />
                <span className="relative z-10">购买中...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-6 w-6 relative z-10" />
                <span className="relative z-10">立即购买</span>
              </>
            )}
          </button>

          {/* 课程包含内容 */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-bold text-[#2B2558] mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              课程包含
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>
                  {formattedCourseDuration === "未设置"
                    ? "课程时长待定"
                    : `约 ${formattedCourseDuration} 的视频课程`}
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>{lessonCount} 个章节内容</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>永久访问权限</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>完成证书</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
