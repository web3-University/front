import { parseUnits } from "viem";
import type { Address } from "viem";
import { useContractRead } from "./useContractRead";
import type { UseContractReadReturn } from "./useContractRead";
import { useContractWrite } from "./useContractWrite";
import { COURSE_CONTRACT_ABI } from "../../contract";
import type { UseWaitForTransactionReceiptReturnType as ReceiptReturnType } from "wagmi";

const COURSE_CONTRACT_ADDRESS: Address =
  "0x0a42F4f8Cb23460BDeD2e18475920Bdb6df5641d";

/**
 * 课程信息结构体
 */
export interface Course {
  id: bigint;
  title: string;
  instructor: Address;
  price: bigint;
  isPublished: boolean;
}

/**
 * 学习进度信息结构体
 */
export interface LearningProgress {
  courseId: bigint; // 课程ID
  completedLessons: bigint; // 已完成课时
  totalLessons: bigint; // 总课时数
  progressPercent: bigint; // 完成百分比
  lastUpdateTime: bigint; // 最后更新时间
}

/**
 * @dev 退款申请信息
 */
export interface RefundRequest {
  courseId: bigint; // 课程ID
  student: Address; // 学生地址
  refundAmount: bigint; // 退款金额
  requestTime: bigint; // 申请时间
  processed: boolean; // 是否已处理
  approved: boolean; // 是否批准
}

interface UseCourseContractProps {
  // 合约地址
  address: Address;
  // 代币精度，用于课程金额换算，默认18
  tokenDecimals: number;
}

export function useCourseContract({
  address = COURSE_CONTRACT_ADDRESS,
  tokenDecimals = 18,
}: UseCourseContractProps): {
  createCourseReceipt: ReceiptReturnType;
  purchaseCourseReceipt: ReceiptReturnType;

  /* 合约查询方法 */
  hasAccess: (
    student?: Address,
    courseId?: bigint,
  ) => UseContractReadReturn<boolean>;
  getCourse: (courseId?: bigint) => UseContractReadReturn<Course>;
  getStudentCourses: (student: Address) => UseContractReadReturn<bigint[]>;
  getCourseStudents: (courseId: bigint) => UseContractReadReturn<Address[]>;
  getInstructorCourses: (
    instructor: Address,
  ) => UseContractReadReturn<bigint[]>;
  getTotalCourses: () => UseContractReadReturn<bigint>;
  getCourseStudentCount: (courseId: bigint) => UseContractReadReturn<bigint>;
  batchCheckAccess: (
    student: Address,
    courseIds: bigint[],
  ) => UseContractReadReturn<boolean[]>;
  getCourseProgress: (
    student: Address,
    courseId: bigint,
  ) => UseContractReadReturn<LearningProgress>;
  getRefundRequest: (requestId: bigint) => UseContractReadReturn<RefundRequest>;
  getRefundEligibilityDetails: (
    student: Address,
    courseId: bigint,
  ) => UseContractReadReturn<[boolean, string, bigint, bigint, bigint, bigint]>;
  isCertifiedInstructor(instructor: Address): UseContractReadReturn<boolean>;

  /* 合约写入方法 */
  createCourse: (
    title: string,
    instructor: Address,
    price: string,
    totalLessons: bigint,
  ) => Promise<any>;
  purchaseCourse: (courseId: bigint) => Promise<any>;
  updateCoursePrice: (courseId: bigint, newPrice: string) => Promise<any>;
  updateCourseProgress: (
    courseId: bigint,
    completedLessons: bigint,
  ) => Promise<any>;
  requestRefund: (courseId: bigint) => Promise<any>;
  certifyInstructor: (instructor: Address) => Promise<any>;
  revokeInstructor: (instructor: Address) => Promise<any>;
  batchCertifyInstructors: (instructors: Address[]) => Promise<any>;
  updateCourse: (
    courseId: bigint,
    title: string,
    totalLessons: bigint,
  ) => Promise<any>;
  updatePlatformAddress: (newPlatformAddress: Address) => Promise<any>;
  publishCourse: (courseId: bigint) => Promise<any>;
  unpublishCourse: (courseId: bigint) => Promise<any>;
  deleteCourse: (courseId: bigint) => Promise<any>;
} {
  // ========== 工具函数 ==========

  /**
   * 解析价格
   * 将字符串形式的价格转换为 bigint（考虑代币精度）
   */
  const parsePrice = (price: string): bigint => {
    return parseUnits(price, tokenDecimals);
  };

  /* ========== 读取合约数据 ========== */

  /**
   * 检查用户是否有课程访问权限
   * @param studentAddress 学生地址
   * @param courseId 课程ID
   */
  const hasAccess = (student?: Address, courseId?: bigint) => {
    const hasArgs = Boolean(student && courseId);
    return useContractRead<boolean>({
      address,
      abi: COURSE_CONTRACT_ABI,
      functionName: "hasAccess",
      args: hasArgs ? [student as Address, courseId as bigint] : undefined,
      enabled: hasArgs,
    });
  };

  /**
   * 获取课程信息
   * @param courseId 课程ID
   */
  const getCourse = (courseId?: bigint) => {
    return useContractRead<Course>({
      address,
      abi: COURSE_CONTRACT_ABI,
      functionName: "getCourse",
      args: courseId ? [courseId] : undefined,
      enabled: true,
    });
  };

  /**
   * 获取学生购买的所有课程
   * @param studentAddress 学生地址
   */
  const getStudentCourses = (student: Address) => {
    return useContractRead<bigint[]>({
      address,
      abi: COURSE_CONTRACT_ABI,
      functionName: "getStudentCourses",
      args: student ? [student] : undefined,
      enabled: true,
    });
  };

  /**
   * 获取课程的所有学生
   * @param courseId 课程ID
   * @returns
   */
  const getCourseStudents = (courseId: bigint) => {
    return useContractRead<Address[]>({
      address,
      abi: COURSE_CONTRACT_ABI,
      functionName: "getCourseStudents",
      args: courseId ? [courseId] : undefined,
      enabled: true,
    });
  };

  /**
   * 获取讲师的所有课程
   * @param instructorAddress 讲师地址
   * @returns
   */
  const getInstructorCourses = (instructor: Address) => {
    return useContractRead<bigint[]>({
      address,
      abi: COURSE_CONTRACT_ABI,
      functionName: "getInstructorCourses",
      args: instructor ? [instructor] : undefined,
      enabled: true,
    });
  };

  /**
   * 获取课程总数
   * @returns
   */
  const getTotalCourses = () => {
    return useContractRead<bigint>({
      address,
      abi: COURSE_CONTRACT_ABI,
      functionName: "getTotalCourses",
      enabled: true,
    });
  };

  /**
   * 获取课程学生数量
   * @param courseId 课程ID
   * @returns
   */
  const getCourseStudentCount = (courseId: bigint) => {
    return useContractRead<bigint>({
      address,
      abi: COURSE_CONTRACT_ABI,
      functionName: "getCourseStudentCount",
      args: [courseId],
      enabled: true,
    });
  };

  /**
   * 批量检查访问权限
   * @param student 学生地址
   * @param courseIds 课程ID数组
   * @returns
   */
  const batchCheckAccess = (student: Address, courseIds: bigint[]) => {
    return useContractRead<boolean[]>({
      address,
      abi: COURSE_CONTRACT_ABI,
      functionName: "batchCheckAccess",
      args: [student, courseIds],
      enabled: true,
    });
  };

  /**
   * 获取课程学习进度
   * @param student 学生地址
   * @param courseId 课程ID
   * @returns
   */
  const getCourseProgress = (student: Address, courseId: bigint) => {
    return useContractRead<LearningProgress>({
      address,
      abi: COURSE_CONTRACT_ABI,
      functionName: "getProgress",
      args: [student, courseId],
      enabled: true,
    });
  };

  /**
   * 获取退款请求信息
   * @param requestId 课程ID
   * @returns
   */
  const getRefundRequest = (requestId: bigint) => {
    return useContractRead<RefundRequest>({
      address,
      abi: COURSE_CONTRACT_ABI,
      functionName: "getRefundRequest",
      args: [requestId],
      enabled: true,
    });
  };

  /**
   * 获取学生的退款资格详细信息
   * @param student 学生ID
   * @param courseId 课程ID
   * @return eligible: boolean 是否可以退款
   * @return reason: string 不能退款的原因（空表示可以）
   * @return refundAmount: bigint 可退款金额
   * @return daysRemaining: bigint 剩余退款天数
   * @return progressPercent: bigint 学习进度百分比
   * @return timeUntilEligible: bigint 距离满足最小持有时间的秒数
   */
  const getRefundEligibilityDetails = (student: Address, courseId: bigint) => {
    return useContractRead<[boolean, string, bigint, bigint, bigint, bigint]>({
      address,
      abi: COURSE_CONTRACT_ABI,
      functionName: "getRefundEligibilityDetails",
      args: [student, courseId],
      enabled: true,
    });
  };

  const isCertifiedInstructor = (instructor: Address) => {
    return useContractRead<boolean>({
      address,
      abi: COURSE_CONTRACT_ABI,
      functionName: "isCertifiedInstructor",
      args: [instructor],
      enabled: true,
    });
  };

  /* ========== 写入合约数据 ========== */
  // 创建课程
  const createCourseWriter = useContractWrite({
    address,
    abi: COURSE_CONTRACT_ABI,
    functionName: "createCourse",
  });
  /**
   * 创建课程
   * @param title 课程标题
   * @param instructor 课程价格
   * @param price
   * @returns
   */
  const createCourse = async (
    title: string,
    instructor: Address,
    price: string,
    totalLessons: bigint,
  ) => {
    if (!createCourseWriter.writeAsync) {
      throw new Error("创建课程方法未创建");
    }
    const parsedPrice = parsePrice(price);
    return createCourseWriter.writeAsync({
      args: [title, instructor, parsedPrice, totalLessons],
    });
  };

  // 购买课程
  const purchaseCourseWriter = useContractWrite({
    address,
    abi: COURSE_CONTRACT_ABI,
    functionName: "purchaseCourse",
  });
  /**
   * 购买课程
   * @param courseId 课程ID
   * @returns
   */
  const purchaseCourse = async (courseId: bigint) => {
    if (!purchaseCourseWriter.writeAsync) {
      throw new Error("创建课程方法未创建");
    }
    return purchaseCourseWriter.writeAsync({ args: [courseId] });
  };

  // 更新课程价格
  const updateCoursePriceWriter = useContractWrite({
    address,
    abi: COURSE_CONTRACT_ABI,
    functionName: "updateCoursePrice",
  });
  /**
   * 更新课程价格
   * @param courseId 课程ID
   * @param newPrice 新的课程价格
   * @returns
   */
  const updateCoursePrice = async (courseId: bigint, newPrice: string) => {
    if (!updateCoursePriceWriter.writeAsync) {
      throw new Error("更新课程价格方法未创建");
    }
    const parsedPrice = parsePrice(newPrice);
    return updateCoursePriceWriter.writeAsync({
      args: [courseId, parsedPrice],
    });
  };

  // 更新学习进度
  const updateCourseProgressWriter = useContractWrite({
    address,
    abi: COURSE_CONTRACT_ABI,
    functionName: "updateProgress",
  });
  /**
   * 更新学习进度
   * @param courseId 课程ID
   * @param completedLessons 课程进度 （应该是百分比的整数表示，比如50表示50%）
   * @returns
   */
  const updateCourseProgress = (courseId: bigint, completedLessons: bigint) => {
    if (!updateCourseProgressWriter.writeAsync) {
      throw new Error("更新课程进度方法未创建");
    }
    return updateCourseProgressWriter.writeAsync({
      args: [courseId, completedLessons],
    });
  };

  // 请求退款
  const requestRefundWriter = useContractWrite({
    address,
    abi: COURSE_CONTRACT_ABI,
    functionName: "requestRefund",
  });
  /**
   * 请求退款
   * @param courseId 课程ID
   * @returns
   */
  const requestRefund = (courseId: bigint) => {
    if (!requestRefundWriter.writeAsync) {
      throw new Error("请求退款方法未创建");
    }
    return requestRefundWriter.writeAsync({ args: [courseId] });
  };

  // 认证讲师
  const certifyInstructorWriter = useContractWrite({
    address,
    abi: COURSE_CONTRACT_ABI,
    functionName: "certifyInstructor",
  });
  /**
   * 认证讲师（仅平台管理员）
   * @param instructor 讲师地址
   * @returns
   */
  const certifyInstructor = (instructor: Address) => {
    if (!certifyInstructorWriter.writeAsync) {
      throw new Error("认证讲师方法未创建");
    }
    return certifyInstructorWriter.writeAsync({ args: [instructor] });
  };

  // 撤销讲师认证
  const revokeInstructorWriter = useContractWrite({
    address,
    abi: COURSE_CONTRACT_ABI,
    functionName: "revokeInstructor",
  });
  /**
   * 撤销讲师认证（仅平台管理员）
   * @param instructor 讲师地址
   * @returns
   */
  const revokeInstructor = (instructor: Address) => {
    if (!revokeInstructorWriter.writeAsync) {
      throw new Error("撤销讲师认证方法未创建");
    }
    return revokeInstructorWriter.writeAsync({ args: [instructor] });
  };

  // 批量认证讲师
  const batchCertifyInstructorsWriter = useContractWrite({
    address,
    abi: COURSE_CONTRACT_ABI,
    functionName: "batchCertifyInstructors",
  });
  /**
   * 批量认证讲师（仅平台管理员）
   * @param instructors 讲师地址数组
   * @returns
   */
  const batchCertifyInstructors = (instructors: Address[]) => {
    if (!batchCertifyInstructorsWriter.writeAsync) {
      throw new Error("批量认证讲师方法未创建");
    }
    return batchCertifyInstructorsWriter.writeAsync({ args: [instructors] });
  };

  // 更新平台地址
  const updatePlatformAddressWriter = useContractWrite({
    address,
    abi: COURSE_CONTRACT_ABI,
    functionName: "updatePlatformAddress",
  });
  /**
   * 更新平台地址（仅平台管理员）
   * @param newPlatformAddress 新平台地址
   */
  const updatePlatformAddress = async (newPlatformAddress: Address) => {
    if (!updatePlatformAddressWriter.writeAsync) {
      throw new Error("更新平台地址方法未创建");
    }
    return updatePlatformAddressWriter.writeAsync({
      args: [newPlatformAddress],
    });
  };

  // 更新课程
  const updateCourseWriter = useContractWrite({
    address,
    abi: COURSE_CONTRACT_ABI,
    functionName: "updateCourse",
  });
  /**
   * 更新课程信息（仅讲师）
   * @param courseId 课程ID
   * @param title 新标题
   * @param totalLessons 新课时数
   */
  const updateCourse = async (
    courseId: bigint,
    title: string,
    totalLessons: bigint,
  ) => {
    if (!updateCourseWriter.writeAsync) {
      throw new Error("更新课程方法未创建");
    }
    return updateCourseWriter.writeAsync({
      args: [courseId, title, totalLessons],
    });
  };

  // 发布课程
  const publishCourseWriter = useContractWrite({
    address,
    abi: COURSE_CONTRACT_ABI,
    functionName: "publishCourse",
  });
  /**
   * 发布课程（仅讲师）
   * @param courseId 课程ID
   * @returns
   */
  const publishCourse = async (courseId: bigint) => {
    if (!publishCourseWriter.writeAsync) {
      throw new Error("发布课程方法未创建");
    }
    return publishCourseWriter.writeAsync({ args: [courseId] });
  };

  // 取消发布课程
  const unpublishCourseWriter = useContractWrite({
    address,
    abi: COURSE_CONTRACT_ABI,
    functionName: "unpublishCourse",
  });
  /**
   * 取消发布课程（仅讲师）
   * @param courseId 课程ID
   */
  const unpublishCourse = async (courseId: bigint) => {
    if (!unpublishCourseWriter.writeAsync) {
      throw new Error("取消发布课程方法未创建");
    }
    return unpublishCourseWriter.writeAsync({ args: [courseId] });
  };

  // 删除课程
  const deleteCourseWriter = useContractWrite({
    address,
    abi: COURSE_CONTRACT_ABI,
    functionName: "deleteCourse",
  });
  /**
   * @dev 删除课程（仅讲师，且无学生购买）
   * @param courseId 课程ID
   */
  const deleteCourse = async (courseId: bigint) => {
    if (!unpublishCourseWriter.writeAsync) {
      throw new Error("取消发布课程方法未创建");
    }
    return deleteCourseWriter.writeAsync({ args: [courseId] });
  };

  return {
    createCourseReceipt: createCourseWriter.receipt,
    purchaseCourseReceipt: purchaseCourseWriter.receipt,

    hasAccess,
    getCourse,
    getStudentCourses,
    getCourseStudents,
    getInstructorCourses,
    getTotalCourses,
    getCourseStudentCount,
    batchCheckAccess,
    getCourseProgress,
    getRefundRequest,
    getRefundEligibilityDetails,
    isCertifiedInstructor,

    createCourse,
    purchaseCourse,
    updateCoursePrice,
    updateCourseProgress,
    requestRefund,
    certifyInstructor,
    revokeInstructor,
    batchCertifyInstructors,
    updatePlatformAddress,
    updateCourse,
    publishCourse,
    unpublishCourse,
    deleteCourse,
  };
}
