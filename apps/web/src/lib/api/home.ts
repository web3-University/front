// src/services/course.ts
import { http } from "@/lib/http";

// 获取课程列表
export const getCourseList = () => http<any[]>("/courses/list");

// 购买课程
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

// 获取课程详情
// /api/courses/detailCourse
export const getCourseDetail = (courseId: number) =>
  http<any>(`/courses/detailCourse?courseId=${courseId}`);

// 获取热门课程
export const getPopularCourses = () => http<any[]>("/courses/popular");
