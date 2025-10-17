"use client";
import { useState, useEffect, useCallback } from "react";
import CourseItem from "./CourseItem";
import FilterNav from "./FilterNav";
import { useCourse } from "@/hooks/useCourse";
import type { CourseFilters } from "@/lib/api/course";

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

// const _fallbackCourses: FeaturedCourse[] = [
//   {
//     id: 'intro-chain',
//     title: '区块链开发入门',
//     category: '编程',
//     instructor: '李教授',
//     rating: 4.9,
//     students: 1250,
//     price: 299,
//     coverColor: 'from-[#4B6CFF] to-[#7EE7FF]'
//   },
//   {
//     id: 'web3-frontend',
//     title: 'Web3 前端开发实战',
//     category: '前端',
//     instructor: '张老师',
//     rating: 4.8,
//     students: 890,
//     price: 399,
//     coverColor: 'from-[#FF9F7B] to-[#FFD56F]'
//   },
//   {
//     id: 'smart-contract-security',
//     title: '智能合约安全审计',
//     category: '安全',
//     instructor: '王专家',
//     rating: 4.9,
//     students: 567,
//     price: 599,
//     coverColor: 'from-[#7E64FF] to-[#B79BFF]'
//   }
// ]

const CourseList = () => {
  // 使用 useCourse hook 管理课程数据
  const { courses: apiCourses, loading, error, fetchCourses } = useCourse();

  // 筛选条件状态
  const [filters, setFilters] = useState<CourseFilters>({
    page: 1,
    limit: 10,
    categories: [],
    free: undefined,
    priceRange: [],
    keyword: "",
  });

  // 映射后的课程数据
  const [courses, setCourses] = useState<FeaturedCourse[]>([]);

  // 组件挂载时获取数据
  useEffect(() => {
    fetchCourses(filters);
  }, []);

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

  // 处理筛选条件变化
  const handleFilterChange = useCallback(
    (newFilters: CourseFilters) => {
      setFilters(newFilters);
      fetchCourses(newFilters);
    },
    [fetchCourses],
  );

  return (
    <div>
      {/* 筛选导航 */}
      <FilterNav
        onFilterChange={handleFilterChange}
        totalCount={courses.length}
      />
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">加载中...</p>
        </div>
      )}

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
          <p className="text-sm">⚠️ {error}</p>
          <p className="text-xs mt-1">正在显示示例数据</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseItem key={course.id} course={course} />
        ))}
      </div>

      {!loading && courses.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>暂无课程数据</p>
        </div>
      )}
    </div>
  );
};

export default CourseList;
