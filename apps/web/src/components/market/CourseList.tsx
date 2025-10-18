"use client";
import { useCallback, useEffect, useState } from "react";
import { parseUnits } from "viem";
import { useCourse } from "@/hooks/useCourse";
import { PurchaseStatus, usePurchaseCourse } from "@/hooks/usePurchaseCourse";
import type { CourseFilters } from "@/lib/api/course";
import CourseItem from "./CourseItem";
import FilterNav from "./FilterNav";

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

  // 使用购买课程 hook
  const {
    purchaseCourse,
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

  // 当 API 课程数据变化时，映射到前端格式
  useEffect(() => {
    const mappedCourses: FeaturedCourse[] = apiCourses.map((course) => ({
      id: course.id?.toString() || course.courseId?.toString() || "",
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

  // 处理购买课程
  const handlePurchase = useCallback(
    async (course: FeaturedCourse) => {
      // 如果已经有其他课程正在购买中，则不允许购买
      if (purchasingCourseId && purchasingCourseId !== course.id) {
        alert("⚠️ 请等待当前课程购买完成");
        return;
      }

      // 设置当前正在购买的课程 ID
      setPurchasingCourseId(course.id);
      setPurchasingCourseTitle(course.title);
      console.log("准备购买课程:", course.id, course);

      try {
        // 将课程 ID 转换为 bigint
        const courseId = BigInt(course.id || 1);
        // 将价格转换为 bigint（18位精度）
        const coursePrice = parseUnits(course.price.toString(), 18);

        await purchaseCourse({
          courseId,
          coursePrice,
        });
      } catch (error) {
        // 购买完成（成功或失败）后清除当前购买课程 ID
        // 这里可以跳转到课程详情页或学习页面
        // router.push(`/learn/${course.id}`);
      }
    },
    [purchaseCourse, purchasingCourseId],
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
              {purchaseStatus === PurchaseStatus.CHECKING_WALLET &&
                "检查钱包连接..."}
              {purchaseStatus === PurchaseStatus.AUTHENTICATING &&
                "签名认证中..."}
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
            onPurchase={handlePurchase}
            isPurchasing={isPurchasing && course.id === purchasingCourseId}
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
