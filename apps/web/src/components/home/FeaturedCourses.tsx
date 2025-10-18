"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CourseItem from "@/components/market/CourseItem";
import { useCourse } from "@/hooks/useCourse";
import type { Course } from "@/lib/api/course";

export type FeaturedCourse = {
  id: string;
  title: string;
  category: string;
  instructor: string;
  rating: number;
  students: number;
  duration: number;
  difficulty: string;
  price: number;
  coverColor: string;
};

// const fallbackCourses: FeaturedCourse[] = [
//   {
//     id: "intro-chain",
//     title: "区块链开发入门",
//     category: "编程",
//     instructor: "李教授",
//     rating: 4.9,
//     students: 1250,
//     price: 299,
//     coverColor: "from-[#4B6CFF] to-[#7EE7FF]",
//   },
//   {
//     id: "web3-frontend",
//     title: "Web3 前端开发实战",
//     category: "前端",
//     instructor: "张老师",
//     rating: 4.8,
//     students: 890,
//     price: 399,
//     coverColor: "from-[#FF9F7B] to-[#FFD56F]",
//   },
//   {
//     id: "smart-contract-security",
//     title: "智能合约安全审计",
//     category: "安全",
//     instructor: "王专家",
//     rating: 4.9,
//     students: 567,
//     price: 599,
//     coverColor: "from-[#7E64FF] to-[#B79BFF]",
//   },
// ];

type FeaturedCoursesProps = {
  onBuy?: (course: FeaturedCourse) => void;
};

export default function FeaturedCourses({ onBuy }: FeaturedCoursesProps) {
  const { courses: apiCourses, loading, error, fetchCourses } = useCourse();
  // 映射后的课程数据
  const [courses, setCourses] = useState<FeaturedCourse[]>([]);

  useEffect(() => {
    // 获取前3个课程作为精选课程
    fetchCourses({ page: 1, limit: 3 });
  }, [fetchCourses]);

  // 当 API 课程数据变化时，映射到前端格式
  useEffect(() => {
    const mappedCourses: FeaturedCourse[] = apiCourses.map((course) => ({
      id: course.id?.toString(),
      title: course.title,
      description: course.description,
      category: course.categories?.[0] || "未分类",
      instructor: course.instructorName || "未知讲师",
      rating: course.rating || 0,
      students: course.studentCount || 0,
      duration: course.duration || 0,
      difficulty: course.difficulty || "1",
      price: course.price || 0,
      coverColor: course.cover || "from-[#4B6CFF] to-[#7EE7FF]",
    }));
    setCourses(mappedCourses);
  }, [apiCourses]);

  // 转换 API 课程数据为 FeaturedCourse 格式
  // 过滤掉无效数据（null）
  // const courses =
  //   apiCourses.length > 0
  //     ? apiCourses.map(convertToFeaturedCourse).filter((course): course is FeaturedCourse => course !== null)
  //     : fallbackCourses;
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-6 py-24">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#2B2558] md:text-4xl">
              精选课程
            </h2>
            <p className="mt-3 text-base text-[#6A6D94]">
              顶级讲师倾力打造的高质量课程，帮助你快速进入 Web3 世界
            </p>
          </div>
          <Link
            href="/market"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FFB347] to-[#FF9F50] px-5 py-2 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(255,160,109,0.35)] transition hover:translate-y-[-1px]"
          >
            查看全部
            <span className="transition group-hover:translate-x-1">→</span>
          </Link>
        </header>

        {/* 加载状态 */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4B6CFF] border-t-transparent" />
            <span className="ml-3 text-[#6A6D94]">加载中...</span>
          </div>
        )}

        {/* 错误状态 */}
        {error && !loading && (
          <div className="rounded-xl bg-red-50 p-6 text-center">
            <p className="text-red-600">加载失败: {error}</p>
            <button
              type="button"
              onClick={() => fetchCourses({ page: 1, limit: 3 })}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            >
              重试
            </button>
          </div>
        )}

        {/* 课程列表 */}
        {!loading && !error && (
          <div className="grid gap-6 md:grid-cols-3">
            {courses.map((course) => (
              <CourseItem key={course.id} course={course} />
            ))}
          </div>
        )}

        {/* 无数据状态 */}
        {!loading && !error && courses.length === 0 && (
          <div className="rounded-xl bg-gray-50 p-12 text-center">
            <p className="text-lg text-[#6A6D94]">暂无精选课程</p>
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-20%] top-[50%] h-[32rem] w-[32rem] rounded-full bg-[#DCE2FF] opacity-60 blur-[200px]" />
        <div className="absolute right-[-18%] top-[20%] h-[28rem] w-[28rem] rounded-full bg-[#FFE7CF] opacity-70 blur-[200px]" />
      </div>
    </section>
  );
}
