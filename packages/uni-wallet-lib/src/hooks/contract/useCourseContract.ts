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

  hasAccess: (
    studentAddress?: Address,
    courseId?: bigint,
  ) => UseContractReadReturn<boolean>;
  getCourse: (courseId?: bigint) => UseContractReadReturn<Course>;
  getStudentCourses: (
    studentAddress: Address,
  ) => UseContractReadReturn<bigint[]>;
  getCourseStudents: (courseId: bigint) => UseContractReadReturn<Address[]>;
  getInstructorCourses: (
    instructorAddress: Address,
  ) => UseContractReadReturn<bigint[]>;
  getTotalCourses: () => UseContractReadReturn<bigint>;
  getCourseStudentCount: (courseId: bigint) => UseContractReadReturn<bigint>;
  batchCheckAccess: (
    student: Address,
    courseIds: bigint[],
  ) => UseContractReadReturn<boolean[]>;

  createCourse: (
    title: string,
    instructor: Address,
    price: string,
  ) => Promise<any>;
  purchaseCourse: (courseId: bigint) => Promise<any>;
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
  const hasAccess = (studentAddress?: Address, courseId?: bigint) => {
    const hasArgs = Boolean(studentAddress && courseId);
    return useContractRead<boolean>({
      address,
      abi: COURSE_CONTRACT_ABI,
      functionName: "hasAccess",
      args: hasArgs
        ? [studentAddress as Address, courseId as bigint]
        : undefined,
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
  const getStudentCourses = (studentAddress: Address) => {
    return useContractRead<bigint[]>({
      address,
      abi: COURSE_CONTRACT_ABI,
      functionName: "getStudentCourses",
      args: studentAddress ? [studentAddress] : undefined,
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
  const getInstructorCourses = (instructorAddress: Address) => {
    return useContractRead<bigint[]>({
      address,
      abi: COURSE_CONTRACT_ABI,
      functionName: "getInstructorCourses",
      args: instructorAddress ? [instructorAddress] : undefined,
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
  ) => {
    if (!createCourseWriter.writeAsync) {
      throw new Error("创建课程方法未创建");
    }
    const parsedPrice = parsePrice(price);
    return createCourseWriter.writeAsync({
      args: [title, instructor, parsedPrice],
    });
  };

  // 购买课程
  const purchaseCourseWriter = useContractWrite({
    address,
    abi: COURSE_CONTRACT_ABI,
    functionName: "purchaseCourse",
  });
  const purchaseCourse = async (courseId: bigint) => {
    if (!purchaseCourseWriter.writeAsync) {
      throw new Error("创建课程方法未创建");
    }
    return purchaseCourseWriter.writeAsync({ args: [courseId] });
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

    createCourse,
    purchaseCourse,
  };
}
