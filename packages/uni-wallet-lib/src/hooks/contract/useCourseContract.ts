import type { Address } from "viem";
import { parseUnits } from "viem";
import type { UseWaitForTransactionReceiptReturnType as ReceiptReturnType } from "wagmi";
import { COURSE_CONTRACT_ABI } from "../../contract";
import type { WriteReturnType } from "./contractFactory";
import { contractFactory } from "./contractFactory";
import type { UseContractReadReturn } from "./useContractRead";

const COURSE_CONTRACT_ADDRESS: Address =
  "0x7F08E79cc9955593EA442030Fa1CB22c879fc02a";

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
  // 合约地址，可选，默认使用预设地址
  address?: Address;
  // 代币精度，用于课程金额换算，默认18
  tokenDecimals?: number;
}

export function useCourseContract({
  address = COURSE_CONTRACT_ADDRESS,
  tokenDecimals = 18,
}: UseCourseContractProps = {}): {
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
  ) => Promise<WriteReturnType>;
  purchaseCourse: (courseId: string) => Promise<WriteReturnType>;
  updateCoursePrice: (
    courseId: bigint,
    newPrice: string,
  ) => Promise<WriteReturnType>;
  updateCourseProgress: (
    courseId: bigint,
    completedLessons: bigint,
  ) => Promise<WriteReturnType>;
  requestRefund: (courseId: bigint) => Promise<WriteReturnType>;
  certifyInstructor: (instructor: Address) => Promise<WriteReturnType>;
  revokeInstructor: (instructor: Address) => Promise<WriteReturnType>;
  batchCertifyInstructors: (instructors: Address[]) => Promise<WriteReturnType>;
  updateCourse: (
    courseId: bigint,
    title: string,
    totalLessons: bigint,
  ) => Promise<WriteReturnType>;
  updatePlatformAddress: (
    newPlatformAddress: Address,
  ) => Promise<WriteReturnType>;
  registerCourse: (courseId: string, price: bigint) => Promise<WriteReturnType>;
  publishCourse: (courseId: bigint) => Promise<WriteReturnType>;
  unpublishCourse: (courseId: bigint) => Promise<WriteReturnType>;
  deleteCourse: (courseId: bigint) => Promise<WriteReturnType>;

  /* Receipt */
  createCourseReceipt: ReceiptReturnType;
  purchaseCourseReceipt: ReceiptReturnType;
  updateCoursePriceReceipt: ReceiptReturnType;
  updateCourseProgressReceipt: ReceiptReturnType;
  requestRefundReceipt: ReceiptReturnType;
  certifyInstructorReceipt: ReceiptReturnType;
  revokeInstructorReceipt: ReceiptReturnType;
  batchCertifyInstructorsReceipt: ReceiptReturnType;
  updatePlatformAddressReceipt: ReceiptReturnType;
  updateCourseReceipt: ReceiptReturnType;
  registerCourseReceipt: ReceiptReturnType;
  publishCourseReceipt: ReceiptReturnType;
  unpublishCourseReceipt: ReceiptReturnType;
  deleteCourseReceipt: ReceiptReturnType;
} {
  const factory = contractFactory(COURSE_CONTRACT_ADDRESS, COURSE_CONTRACT_ABI);

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
    return factory.read<boolean>("hasAccess")(student, courseId);
  };

  /**
   * 获取课程信息
   * @param courseId 课程ID
   */
  const getCourse = (courseId?: bigint) => {
    return factory.read<Course>("getCourse")(courseId);
  };

  /**
   * 获取学生购买的所有课程
   * @param studentAddress 学生地址
   */
  const getStudentCourses = (student: Address) => {
    return factory.read<bigint[]>("getStudentCourses")(student);
  };

  /**
   * 获取课程的所有学生
   * @param courseId 课程ID
   * @returns
   */
  const getCourseStudents = (courseId: bigint) => {
    return factory.read<Address[]>("getCourseStudents")(courseId);
  };

  /**
   * 获取讲师的所有课程
   * @param instructorAddress 讲师地址
   * @returns
   */
  const getInstructorCourses = (instructor: Address) => {
    return factory.read<bigint[]>("getInstructorCourses")(instructor);
  };

  /**
   * 获取课程总数
   * @returns
   */
  const getTotalCourses = () => {
    return factory.read<bigint>("getTotalCourses")();
  };

  /**
   * 获取课程学生数量
   * @param courseId 课程ID
   * @returns
   */
  const getCourseStudentCount = (courseId: bigint) => {
    return factory.read<bigint>("getCourseStudentCount")(courseId);
  };

  /**
   * 批量检查访问权限
   * @param student 学生地址
   * @param courseIds 课程ID数组
   * @returns
   */
  const batchCheckAccess = (student: Address, courseIds: bigint[]) => {
    return factory.read<boolean[]>("batchCheckAccess")(student, courseIds);
  };

  /**
   * 获取课程学习进度
   * @param student 学生地址
   * @param courseId 课程ID
   * @returns
   */
  const getCourseProgress = (student: Address, courseId: bigint) => {
    return factory.read<LearningProgress>("getProgress")(student, courseId);
  };

  /**
   * 获取退款请求信息
   * @param requestId 课程ID
   * @returns
   */
  const getRefundRequest = (requestId: bigint) => {
    return factory.read<RefundRequest>("getRefundRequest")(requestId);
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
    return factory.read<[boolean, string, bigint, bigint, bigint, bigint]>(
      "getRefundEligibilityDetails",
    )(student, courseId);
  };

  /**
   * 检查是否为认证讲师
   * @param instructor 讲师地址
   * @return 是否认证
   */
  const isCertifiedInstructor = (instructor: Address) => {
    return factory.read<boolean>("isCertifiedInstructor")(instructor);
  };

  /* ========== 写入合约数据 ========== */
  // 创建课程
  const createCourseWriter = factory.write("createCourse");
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
    return await createCourseWriter.send(
      title,
      instructor,
      parsePrice(price),
      totalLessons,
    );
  };

  // 购买课程
  const purchaseCourseWriter = factory.write("purchaseCourse");

  /**
   * 购买课程
   * @param courseId 课程ID
   * @returns
   */
  const purchaseCourse = async (courseId: string) => {
    return await purchaseCourseWriter.send(courseId);
  };

  // 更新课程价格
  const updateCoursePriceWriter = factory.write("updateCoursePrice");
  /**
   * 更新课程价格
   * @param courseId 课程ID
   * @param newPrice 新的课程价格
   * @returns
   */
  const updateCoursePrice = async (courseId: bigint, newPrice: string) => {
    return await updateCoursePriceWriter.send(courseId, parsePrice(newPrice));
  };

  // 更新学习进度
  const updateCourseProgressWriter = factory.write("updateProgress");
  /**
   * 更新学习进度
   * @param courseId 课程ID
   * @param completedLessons 课程进度 （应该是百分比的整数表示，比如50表示50%）
   * @returns
   */
  const updateCourseProgress = async (
    courseId: bigint,
    completedLessons: bigint,
  ) => {
    return await updateCourseProgressWriter.send(courseId, completedLessons);
  };

  // 请求退款
  const requestRefundWriter = factory.write("requestRefund");
  /**
   * 请求退款
   * @param courseId 课程ID
   * @returns
   */
  const requestRefund = async (courseId: bigint) => {
    return await requestRefundWriter.send(courseId);
  };

  // 认证讲师
  const certifyInstructorWriter = factory.write("certifyInstructor");
  /**
   * 认证讲师（仅平台管理员）
   * @param instructor 讲师地址
   * @returns
   */
  const certifyInstructor = async (instructor: Address) => {
    return await certifyInstructorWriter.send(instructor);
  };

  // 撤销讲师认证
  const revokeInstructorWriter = factory.write("revokeInstructor");
  /**
   * 撤销讲师认证（仅平台管理员）
   * @param instructor 讲师地址
   * @returns
   */
  const revokeInstructor = async (instructor: Address) => {
    return await revokeInstructorWriter.send(instructor);
  };

  // 批量认证讲师
  const batchCertifyInstructorsWriter = factory.write(
    "batchCertifyInstructors",
  );
  /**
   * 批量认证讲师（仅平台管理员）
   * @param instructors 讲师地址数组
   * @returns
   */
  const batchCertifyInstructors = async (instructors: Address[]) => {
    return await batchCertifyInstructorsWriter.send(instructors);
  };

  // 更新平台地址
  const updatePlatformAddressWriter = factory.write("updatePlatformAddress");
  /**
   * 更新平台地址（仅平台管理员）
   * @param newPlatformAddress 新平台地址
   */
  const updatePlatformAddress = async (newPlatformAddress: Address) => {
    return await updatePlatformAddressWriter.send(newPlatformAddress);
  };

  // 注册课程
  const registerCourseWriter = factory.write("registerCourse");
  const registerCourse = async (courseId: string, price: bigint) => {
    return await registerCourseWriter.send(courseId, price);
  };

  // 更新课程
  const updateCourseWriter = factory.write("updateCourse");
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
    return await updateCourseWriter.send(courseId, title, totalLessons);
  };

  // 发布课程
  const publishCourseWriter = factory.write("publishCourse");
  /**
   * 发布课程（仅讲师）
   * @param courseId 课程ID
   * @returns
   */
  const publishCourse = async (courseId: bigint) => {
    return await publishCourseWriter.send(courseId);
  };

  // 取消发布课程
  const unpublishCourseWriter = factory.write("unpublishCourse");
  /**
   * 取消发布课程（仅讲师）
   * @param courseId 课程ID
   */
  const unpublishCourse = async (courseId: bigint) => {
    return await unpublishCourseWriter.send(courseId);
  };

  // 删除课程
  const deleteCourseWriter = factory.write("deleteCourse");
  /**
   * @dev 删除课程（仅讲师，且无学生购买）
   * @param courseId 课程ID
   */
  const deleteCourse = async (courseId: bigint) => {
    return await deleteCourseWriter.send(courseId);
  };

  return {
    // ========== 读取方法 ==========
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

    // ========== 写入方法 ==========
    createCourse,
    purchaseCourse,
    updateCoursePrice,
    updateCourseProgress,
    requestRefund,
    certifyInstructor,
    revokeInstructor,
    batchCertifyInstructors,
    updatePlatformAddress,
    registerCourse,
    updateCourse,
    publishCourse,
    unpublishCourse,
    deleteCourse,

    // ========== Receipt ==========
    createCourseReceipt: createCourseWriter.receipt,
    purchaseCourseReceipt: purchaseCourseWriter.receipt,
    updateCoursePriceReceipt: updateCoursePriceWriter.receipt,
    updateCourseProgressReceipt: updateCourseProgressWriter.receipt,
    requestRefundReceipt: requestRefundWriter.receipt,
    certifyInstructorReceipt: certifyInstructorWriter.receipt,
    revokeInstructorReceipt: revokeInstructorWriter.receipt,
    batchCertifyInstructorsReceipt: batchCertifyInstructorsWriter.receipt,
    updatePlatformAddressReceipt: updatePlatformAddressWriter.receipt,
    registerCourseReceipt: updateCoursePriceWriter.receipt,
    updateCourseReceipt: updateCourseWriter.receipt,
    publishCourseReceipt: publishCourseWriter.receipt,
    unpublishCourseReceipt: unpublishCourseWriter.receipt,
    deleteCourseReceipt: deleteCourseWriter.receipt,
  };
}
