"use client";
import { useCallback, useEffect, useState } from "react";
import { useWalletInfo } from "uni-wallet-lib";
import { useCourse } from "@/hooks/useCourse";
import { PurchaseStatus, usePurchaseCourse } from "@/hooks/usePurchaseCourse";
import type { CourseFilters } from "@/lib/api/course";
import { getPurchasedCourses } from "@/lib/api/user";
import CourseItem from "./CourseItem";
import FilterNav from "./FilterNav";

export type FeaturedCourse = {
  id: string;
  title: string;
  description: string;
  category: string;
  instructor: string;
  rating: number;
  students: number;
  duration: number;
  difficulty: string;
  price: number;
  coverColor: string;
  isPurchased?: boolean; // 新增：是否已购买
};

const CourseList = () => {
  // 获取钱包信息
  const { address, isConnected } = useWalletInfo();

  // 使用 useCourse hook 管理课程数据
  const { courses: apiCourses, loading, error, fetchCourses } = useCourse();

  // 使用购买课程 hook
  const {
    status: purchaseStatus,
    loading: isPurchasing,
    error: purchaseError,
    transactionHash,
    reset: resetPurchase,
  } = usePurchaseCourse();

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

  // 已购买课程列表
  const [purchasedCourseIds, setPurchasedCourseIds] = useState<Set<string>>(
    new Set(),
  );

  // 记录当前正在购买的课程 ID
  const [purchasingCourseId, setPurchasingCourseId] = useState<string | null>(
    null,
  );
  const [purchasingCourseTitle, setPurchasingCourseTitle] = useState<
    string | null
  >(null);
  // 组件挂载时获取数据
  useEffect(() => {
    fetchCourses(filters);
  }, []);

  // 获取已购买课程列表
  const fetchPurchasedCourses = useCallback(async () => {
    if (!address || !isConnected) {
      setPurchasedCourseIds(new Set());
      return;
    }

    try {
      const response = await getPurchasedCourses(address);
      if (response.data) {
        const purchasedIds = new Set(
          response.data.map(
            (course) => course.courseId?.toString() || course.id?.toString(),
          ),
        );
        setPurchasedCourseIds(purchasedIds);
      }
    } catch (error) {
      console.error("获取已购买课程失败:", error);
      setPurchasedCourseIds(new Set());
    }
  }, [address, isConnected]);

  // 当钱包连接状态或地址变化时，获取已购买课程
  useEffect(() => {
    fetchPurchasedCourses();
  }, [fetchPurchasedCourses]);

  // 当 API 课程数据变化时，映射到前端格式
  useEffect(() => {
    const mappedCourses: FeaturedCourse[] = apiCourses.map((course) => {
      // 确保price字段有有效值
      const courseId = course.courseId?.toString() || "";
      return {
        id: courseId,
        title: course.title || "未知课程",
        description: course.description || "暂无描述",
        category: course.categories?.[0] || "未分类",
        instructor: course.instructorName || "未知讲师",
        rating: course.rating || 0,
        students: course.studentCount || 0,
        duration: course.duration || 0,
        difficulty: course.difficulty || "1",
        price: Number(course.price),
        coverColor: course.cover || "from-[#4B6CFF] to-[#7EE7FF]",
        isPurchased: purchasedCourseIds.has(courseId), // 检查是否已购买
      };
    });
    setCourses(mappedCourses);
  }, [apiCourses, purchasedCourseIds]);

  // 处理筛选条件变化
  const handleFilterChange = useCallback(
    (newFilters: CourseFilters) => {
      setFilters(newFilters);
      fetchCourses(newFilters);
    },
    [fetchCourses],
  );

  // 监听购买错误
  useEffect(() => {
    if (purchaseStatus === PurchaseStatus.ERROR && purchaseError) {
      alert(`❌ 购买失败：${purchaseError}`);
      // 清除购买中的课程 ID
      setPurchasingCourseId(null);
      setPurchasingCourseTitle(null);
      setTimeout(() => {
        resetPurchase();
      }, 3000);
    } else if (purchaseStatus === PurchaseStatus.SUCCESS) {
      console.log("购买成功！交易哈希:", transactionHash);
      alert(
        `🎉 购买成功！\n\n课程: ${purchasingCourseTitle}\n交易哈希: ${transactionHash}\n\n即将跳转到学习页面...`,
      );
      setPurchasingCourseId(null);
      setPurchasingCourseTitle(null);
      // 购买成功后刷新已购买课程列表
      fetchPurchasedCourses();
      setTimeout(() => {
        resetPurchase();
      }, 3000);
    }
  }, [
    purchaseStatus,
    purchaseError,
    setPurchasingCourseTitle,
    resetPurchase,
    transactionHash,
    fetchPurchasedCourses,
  ]);

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

      {/* 购买进度提示 */}
      {isPurchasing && (
        <div className="fixed top-20 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-blue-500 px-6 py-3 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>
              {purchaseStatus === PurchaseStatus.CHECKING_ALLOWANCE &&
                "检查授权额度..."}
              {purchaseStatus === PurchaseStatus.APPROVING_TOKEN &&
                "请在钱包中确认授权..."}
              {purchaseStatus === PurchaseStatus.WAITING_APPROVE &&
                "等待授权确认..."}
              {purchaseStatus === PurchaseStatus.PURCHASING_COURSE &&
                "请在钱包中确认购买..."}
              {purchaseStatus === PurchaseStatus.WAITING_TRANSACTION &&
                "等待交易确认..."}
              {purchaseStatus === PurchaseStatus.SAVING_TO_DB &&
                "保存购买记录..."}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseItem
            key={course.id}
            course={course}
            onPurchaseSuccess={(transactionHash) => {
              console.log("购买成功:", transactionHash);
              // 购买成功后刷新已购买课程列表，更新按钮状态
              fetchPurchasedCourses();
            }}
            onPurchaseError={(error) => {
              console.error("购买失败:", error);
              // 可以在这里添加错误处理逻辑，比如显示错误提示
            }}
          />
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
