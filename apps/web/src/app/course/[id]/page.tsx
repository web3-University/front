"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCourse } from "@/hooks/useCourse";
import { usePurchaseCourse } from "@/hooks/usePurchaseCourse";
import { parseUnits } from "viem";
import CourseSidebar from "./components/CourseSidebar";
import CourseHeader from "./components/CourseHeader";
import CourseBody from "./components/CourseBody";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = parseInt(params.id as string);

  const {
    currentCourse,
    lessons,
    loading,
    error,
    fetchCourseDetail,
    fetchCourseLessons,
  } = useCourse();

  const { purchaseCourse, status: purchaseStatus } = usePurchaseCourse();

  useEffect(() => {
    if (courseId && !isNaN(courseId)) {
      fetchCourseDetail(courseId);
      fetchCourseLessons(courseId);
    }
  }, [courseId, fetchCourseDetail, fetchCourseLessons]);

  const handlePurchase = async () => {
    if (!currentCourse) {
      return;
    }

    const baseCourseId =
      currentCourse.courseId ?? (Number.isFinite(courseId) ? courseId : null);

    if (baseCourseId === null || baseCourseId === undefined) {
      console.error("无法确定课程 ID，无法发起购买。");
      return;
    }

    const isFreeCourse =
      currentCourse.isFree === true || currentCourse.isFree === "1";
    let priceSource = "0";
    if (typeof currentCourse.price === "string") {
      priceSource = currentCourse.price;
    } else if (typeof currentCourse.price === "number") {
      priceSource = currentCourse.price.toString();
    }

    const normalizedPrice =
      (isFreeCourse ? "0" : priceSource || "0").trim() || "0";

    try {
      const purchasePrice = parseUnits(normalizedPrice, 18);
      await purchaseCourse({
        courseId: BigInt(baseCourseId),
        coursePrice: purchasePrice,
      });
    } catch (err) {
      console.error("购买课程参数转换失败:", err);
    }
  };

  const isPurchasing = [
    "signing",
    "approving",
    "purchasing",
    "confirming",
    "saving",
  ].includes(purchaseStatus || "");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-600" />
          </div>
          <p className="mt-6 text-lg font-medium text-[#2B2558]">
            加载课程信息中...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center max-w-md">
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100">
            <span className="text-4xl">😕</span>
          </div>
          <h2 className="text-2xl font-bold text-[#2B2558] mb-3">加载失败</h2>
          <p className="text-red-500 mb-6">{error}</p>
          <button
            onClick={() => router.push("/market")}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            前往课程市场
          </button>
        </div>
      </div>
    );
  }

  if (!currentCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center max-w-md">
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100">
            <span className="text-4xl">🔍</span>
          </div>
          <h2 className="text-2xl font-bold text-[#2B2558] mb-3">课程不存在</h2>
          <p className="text-gray-500 mb-6">抱歉，找不到您要查看的课程</p>
          <button
            onClick={() => router.push("/market")}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            前往课程市场
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto max-w-[1200px] px-4 pt-28 pb-16">
        {/* 返回按钮 */}
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-[#6A6D94] hover:text-[#2B2558] mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">返回</span>
        </button>

        <CourseHeader course={currentCourse} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CourseBody course={currentCourse} lessons={lessons} />

          <CourseSidebar
            course={currentCourse}
            lessonCount={lessons.length}
            isPurchasing={isPurchasing}
            onPurchase={handlePurchase}
          />
        </div>
      </main>
    </div>
  );
}
