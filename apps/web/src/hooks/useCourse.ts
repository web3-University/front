"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getCourseList,
  getMyCourses,
  getCourseDetail,
  getCourseLessons,
  getLessonDetail,
  rateCourse,
  createCourse,
  createLesson,
  type Course,
  type Lesson,
  type CourseFilters,
  type CreateCourseDto,
  type CreateLessonDto,
} from "@/lib/api/course";

// Hook 返回类型
interface UseCourseReturn {
  // 状态
  courses: Course[];
  currentCourse: Course | null;
  lessons: Lesson[];
  currentLesson: Lesson | null;
  loading: boolean;
  error: string | null;

  // 课程操作方法
  fetchCourses: (filters?: CourseFilters) => Promise<void>;
  fetchMyCourses: (
    walletAddress: string,
    page?: number,
    limit?: number,
  ) => Promise<void>;
  fetchCourseDetail: (courseId: number) => Promise<void>;
  rateCourseById: (
    courseId: number,
    walletAddress: string,
    rating: number,
  ) => Promise<void>;
  createNewCourse: (data: CreateCourseDto) => Promise<Course | null>;

  // 章节操作方法
  fetchCourseLessons: (courseId: number) => Promise<void>;
  fetchLessonDetail: (lessonId: number) => Promise<void>;
  createNewLesson: (data: CreateLessonDto) => Promise<Lesson | null>;

  // 清除方法
  clearError: () => void;
  clearCurrentCourse: () => void;
  clearCurrentLesson: () => void;
}

/**
 * useCourse - 课程管理自定义 Hook
 *
 * @param autoFetch - 是否在组件挂载时自动获取课程列表
 * @param initialFilters - 初始筛选条件
 *
 * @example
 * ```tsx
 * const { courses, loading, fetchCourses } = useCourse();
 *
 * useEffect(() => {
 *   fetchCourses({ page: 1, limit: 10 });
 * }, []);
 * ```
 */
export function useCourse(
  autoFetch: boolean = false,
  initialFilters?: CourseFilters,
): UseCourseReturn {
  // 状态管理
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ========== 课程操作方法 ==========

  /**
   * 获取课程列表
   */
  const fetchCourses = useCallback(async (filters?: CourseFilters) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getCourseList(filters);
      setCourses(response.data || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "获取课程列表失败";
      setError(errorMessage);
      console.error("获取课程列表错误:", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 获取我的课程列表
   */
  const fetchMyCourses = useCallback(
    async (walletAddress: string, page: number = 1, limit: number = 10) => {
      setLoading(true);
      setError(null);

      try {
        const response = await getMyCourses({ walletAddress, page, limit });
        setCourses(response.data || []);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "获取我的课程失败";
        setError(errorMessage);
        console.error("获取我的课程错误:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * 获取课程详情
   */
  const fetchCourseDetail = useCallback(async (courseId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getCourseDetail(courseId);
      setCurrentCourse(response.data || null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "获取课程详情失败";
      setError(errorMessage);
      console.error("获取课程详情错误:", err);
      setCurrentCourse(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 评价课程
   */
  const rateCourseById = useCallback(
    async (courseId: number, walletAddress: string, rating: number) => {
      setLoading(true);
      setError(null);

      try {
        const response = await rateCourse({ courseId, walletAddress, rating });
        // 更新当前课程信息
        if (currentCourse && currentCourse.id === courseId) {
          setCurrentCourse(response.data);
        }
        // 更新课程列表中的对应课程
        setCourses((prev) =>
          prev.map((course) =>
            course.id === courseId ? response.data : course,
          ),
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "评价课程失败";
        setError(errorMessage);
        console.error("评价课程错误:", err);
      } finally {
        setLoading(false);
      }
    },
    [currentCourse],
  );

  /**
   * 创建新课程
   */
  const createNewCourse = useCallback(async (data: CreateCourseDto) => {
    setLoading(true);
    setError(null);

    try {
      const response = await createCourse(data);
      const newCourse = response.data;
      // 将新课程添加到列表
      setCourses((prev) => [newCourse, ...prev]);
      return newCourse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "创建课程失败";
      setError(errorMessage);
      console.error("创建课程错误:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== 章节操作方法 ==========

  /**
   * 获取课程章节列表
   */
  const fetchCourseLessons = useCallback(async (courseId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getCourseLessons(courseId);
      setLessons(response.data || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "获取章节列表失败";
      setError(errorMessage);
      console.error("获取章节列表错误:", err);
      setLessons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 获取章节详情
   */
  const fetchLessonDetail = useCallback(async (lessonId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getLessonDetail(lessonId);
      setCurrentLesson(response.data || null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "获取章节详情失败";
      setError(errorMessage);
      console.error("获取章节详情错误:", err);
      setCurrentLesson(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 创建新章节
   */
  const createNewLesson = useCallback(async (data: CreateLessonDto) => {
    setLoading(true);
    setError(null);

    try {
      const response = await createLesson(data);
      const newLesson = response.data;
      // 将新章节添加到列表
      setLessons((prev) =>
        [...prev, newLesson].sort((a, b) => a.order - b.order),
      );
      return newLesson;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "创建章节失败";
      setError(errorMessage);
      console.error("创建章节错误:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== 清除方法 ==========

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearCurrentCourse = useCallback(() => {
    setCurrentCourse(null);
  }, []);

  const clearCurrentLesson = useCallback(() => {
    setCurrentLesson(null);
  }, []);

  // ========== 自动获取 ==========

  useEffect(() => {
    if (autoFetch) {
      fetchCourses(initialFilters);
    }
  }, [autoFetch, initialFilters, fetchCourses]);

  return {
    // 状态
    courses,
    currentCourse,
    lessons,
    currentLesson,
    loading,
    error,

    // 课程操作方法
    fetchCourses,
    fetchMyCourses,
    fetchCourseDetail,
    rateCourseById,
    createNewCourse,

    // 章节操作方法
    fetchCourseLessons,
    fetchLessonDetail,
    createNewLesson,

    // 清除方法
    clearError,
    clearCurrentCourse,
    clearCurrentLesson,
  };
}
