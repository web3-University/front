// src/lib/api/course.ts
import { http } from "@/lib/http";
import { getAuthToken } from "@/lib/utils/storage";

// ========== 类型定义 ==========

export interface Course {
  courseId: any;
  id: number;
  walletAddress?: string;
  title: string;
  description?: string;
  categories: string[];
  instructorId?: number; // 讲师ID
  instructorName?: string; // 讲师名称
  rating?: number;
  studentCount?: number;
  duration: number;
  difficulty: string;
  price: number | string; // 支持字符串格式的价格
  cover?: string;
  isFree?: boolean | string; // 支持字符串格式："0" | "1"
  status?: string; // 课程状态
  tags?: string[];
  learningObjectives?: string[];
  prerequisites?: string[];
  lessons?: Lesson[];
  createdAt?: string;
  updatedAt?: string;
  // 列表接口额外字段
  lessonCount?: number;
  reviewCount?: number;
  purchaseCount?: number;
  completionCount?: number;
  averageRating?: number;
}

export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  content: string;
  order: number;
  duration?: number;
  videoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseFilters {
  page?: number;
  limit?: number;
  categories?: string[];
  free?: string;
  priceRange?: string[];
  keyword?: string;
}

export interface CreateCourseDto {
  walletAddress: string;
  title: string;
  description: string;
  cover: string;
  categories: string[];
  difficulty: string;
  price: string;
  duration: number;
  isFree: string;
  tags: string[];
  learningObjectives: string[];
  prerequisites: string[];
}

export interface CreateLessonDto {
  courseId: number;
  title: string;
  content: string;
  order: number;
  duration?: number;
  videoUrl?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode?: number;
}

// ========== 课程管理 API ==========

/**
 * 创建课程
 * POST /courses/create
 */
export const createCourse = (data: CreateCourseDto) =>
  http<ApiResponse<Course>>("/courses/create", {
    method: "POST",
    body: data,
  });

/**
 * 获取我的课程列表
 * GET /courses/my
 */
export const getMyCourses = (params: {
  walletAddress: string;
  page?: number;
  limit?: number;
}) => {
  const { walletAddress, page = 1, limit = 10 } = params;
  return http<ApiResponse<Course[]>>(
    `/courses/my?walletAddress=${walletAddress}&page=${page}&limit=${limit}`,
  );
};

/**
 * 获取课程列表（带筛选）
 * POST /courses/list
 */
export const getCourseList = (filters?: CourseFilters) =>
  http<ApiResponse<Course[]>>("/courses/list", {
    method: "POST",
    body: filters || {},
    token: getAuthToken(),
  });

/**
 * 获取课程详情
 * GET /courses/detail
 */
export const getCourseDetail = (courseId: number) =>
  http<ApiResponse<Course>>(`/courses/detail?courseId=${courseId}`);

/**
 * 评价课程
 * POST /courses/rate
 */
export const rateCourse = (data: {
  courseId: number;
  walletAddress: string;
  rating: number;
}) =>
  http<ApiResponse<Course>>("/courses/rate", {
    method: "POST",
    body: data,
  });

// ========== 章节管理 API ==========

/**
 * 创建课程章节
 * POST /courses/lessonsCreate
 */
export const createLesson = (data: CreateLessonDto) =>
  http<ApiResponse<Lesson>>("/courses/lessonsCreate", {
    method: "POST",
    body: data,
  });

/**
 * 获取课程章节列表
 * GET /courses/lessonsList
 */
export const getCourseLessons = (courseId: number) =>
  http<ApiResponse<Lesson[]>>(`/courses/lessonsList?courseId=${courseId}`);

/**
 * 获取章节详情
 * GET /courses/lessonsDetail
 */
export const getLessonDetail = (lessonId: number) =>
  http<ApiResponse<Lesson>>(`/courses/lessonsDetail?lessonId=${lessonId}`);

// ========== 其他课程相关 API（保留兼容） ==========

/**
 * 购买课程
 * POST /users/purchaseCourse
 */
export const purchaseCourse = (data: {
  walletAddress: string;
  courseId: number;
  transactionHash: string;
  amount: string;
}) =>
  http("/users/purchaseCourse", {
    method: "POST",
    body: data,
  });

/**
 * 获取热门课程
 * GET /courses/popular
 */
export const getPopularCourses = () =>
  http<ApiResponse<Course[]>>("/courses/popular");

/**
 * 获取用户已购买的课程
 * GET /api/users/purchasedCourses
 */
export const getPurchasedCourses = (walletAddress: string) =>
  http<ApiResponse<Course[]>>(
    `/users/purchasedCourses?walletAddress=${walletAddress}`,
  );
