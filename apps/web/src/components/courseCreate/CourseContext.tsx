"use client";
import { useAuth, useCourseContract } from "@web3-university/uni-wallet-lib";
import type React from "react";
import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useContext,
  useState,
} from "react";
import {
  type CreateCourseDto,
  createCourse,
  createLesson,
} from "@/lib/api/course";

// 课程内容项类型
export interface CourseContentItem {
  id: string;
  title: string;
  type: "video" | "text";
  description: string;
  videoFile?: string | null;
  textContent?: string;
  duration?: string;
  isFreePreview: boolean;
}

// 定价设置类型
interface PricingSetting {
  price: number;
  estimatedDuration: string;
  pricingStrategy: "basic" | "standard" | "premium";
}

// 整体课程表单数据
interface CourseFormData {
  basicInfo: {
    title: string;
    description: string;
    category: string;
    difficulty: string;
    coverImage: string;
    tags: string[];
    learningGoals: string[];
    prerequisites: string[]; // 添加prerequisites字段
  };
  courseContent: CourseContentItem[];
  pricingSetting: PricingSetting;
}

// Context 提供的方法和状态
interface CourseContextType {
  formData: CourseFormData;
  setFormData: Dispatch<SetStateAction<CourseFormData>>;
  errors: Record<string, string>;
  setErrors: Dispatch<SetStateAction<Record<string, string>>>;
  isLoading: boolean;
  validateForm: () => boolean;
  saveDraft: () => void;
  previewCourse: () => void;
  publishCourse: () => Promise<void>;
  addChapter: () => void;
  removeChapter: (id: string) => void;
  updateChapter: (id: string, updatedData: Partial<CourseContentItem>) => void;
  updatePricing: (updatedData: Partial<PricingSetting>) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

// 显式定义 CourseProvider 的 props 类型，确保包含 children
interface CourseProviderProps {
  children: React.ReactNode;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const auth = useAuth();
  const {
    // 写入方法（返回 Promise）
    registerCourse, // 创建课程
  } = useCourseContract();

  // 初始状态
  const [formData, setFormData] = useState<CourseFormData>(() => {
    // 尝试从本地存储恢复草稿
    if (typeof window !== "undefined") {
      try {
        const savedDraft = localStorage.getItem("course_draft");
        if (savedDraft) {
          return JSON.parse(savedDraft);
        }
      } catch (error) {
        console.error("恢复草稿失败:", error);
      }
    }

    // 默认初始状态
    return {
      basicInfo: {
        title: "",
        description: "",
        category: "",
        difficulty: "1",
        coverImage: null,
        tags: [],
        learningGoals: ["掌握基础"],
        prerequisites: [], // 添加prerequisites默认值
      },
      courseContent: [
        {
          id: "chapter-1",
          title: "课程介绍",
          type: "video",
          description: "",
          videoFile: null,
          duration: "",
          isFreePreview: true,
        },
      ],
      pricingSetting: {
        price: 0,
        estimatedDuration: "",
        pricingStrategy: "basic",
      },
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 表单校验：所有模块（基本信息、课程内容、定价）
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    // 校验基本信息（同之前逻辑，略）
    if (!formData.basicInfo.title.trim()) {
      newErrors["basicInfo.title"] = "课程标题不能为空";
      isValid = false;
    }

    if (!formData.basicInfo.description.trim()) {
      newErrors["basicInfo.description"] = "课程描述不能为空";
      isValid = false;
    }

    if (!formData.basicInfo.category) {
      newErrors["basicInfo.category"] = "请选择课程分类";
      isValid = false;
    }

    if (!formData.basicInfo.difficulty) {
      newErrors["basicInfo.difficulty"] = "请选择难度级别";
      isValid = false;
    }

    if (!formData.basicInfo.coverImage) {
      newErrors["basicInfo.coverImage"] = "请上传课程封面图";
      isValid = false;
    }

    // 校验课程内容：每个章节需有描述、视频/文字内容
    formData.courseContent.forEach((chapter) => {
      if (!chapter.description.trim()) {
        newErrors[`courseContent.${chapter.id}.description`] =
          "章节描述不能为空";
        isValid = false;
      }
      if (chapter.type === "video" && !chapter.videoFile) {
        newErrors[`courseContent.${chapter.id}.videoFile`] =
          "视频章节需上传视频";
        isValid = false;
      }
      if (chapter.type === "text" && !chapter.textContent) {
        newErrors[`courseContent.${chapter.id}.textContent`] =
          "文字章节需填写内容";
        isValid = false;
      }
    });

    // 校验定价
    if (!formData.pricingSetting.price) {
      newErrors["pricingSetting.price"] = "课程价格不能为空";
      isValid = false;
    }
    if (!formData.pricingSetting.estimatedDuration.trim()) {
      newErrors["pricingSetting.estimatedDuration"] = "预估学习时长不能为空";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  // 快捷操作：保存草稿
  const saveDraft = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      console.log("保存草稿：", formData);
      // 可以将草稿保存到本地存储或后端
      localStorage.setItem("course_draft", JSON.stringify(formData));

      // 显示成功提示
      setErrors((prev) => ({ ...prev, draft: "" })); // 清除之前的错误
    } catch (error) {
      console.error("保存草稿失败:", error);
      setErrors((prev) => ({
        ...prev,
        draft: "保存草稿失败，请重试",
      }));
    }
  };

  // 快捷操作：预览课程
  const previewCourse = () => {
    if (validateForm()) {
      console.log("预览课程，跳转逻辑...");
      // 可添加「跳转预览页」逻辑
    }
  };

  // 快捷操作：发布课程
  const publishCourse = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    if (!auth.address) {
      setErrors((prev) => ({ ...prev, auth: "请先连接钱包" }));
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // 将formData转换为API所需的格式
      const createCourseData: CreateCourseDto = {
        walletAddress: auth.address,
        title: formData.basicInfo.title,
        description: formData.basicInfo.description,
        cover: formData.basicInfo.coverImage || "",
        categories: [formData.basicInfo.category], // 将单个分类转换为数组
        difficulty: formData.basicInfo.difficulty,
        price: formData.pricingSetting.price.toString(), // 转换为字符串
        duration: parseInt(formData.pricingSetting.estimatedDuration) || 0,
        isFree: formData.pricingSetting.price === 0 ? "1" : "0", // 根据价格判断是否免费
        tags: formData.basicInfo.tags,
        learningObjectives: formData.basicInfo.learningGoals,
        prerequisites: formData.basicInfo.prerequisites, // 使用表单中的prerequisites数据
      };

      console.log("正在创建课程...", createCourseData);

      const response = await createCourse(createCourseData);

      console.log("课程创建成功:", response);
      const courseId = response.data.courseId;
      await createAllLessons(courseId, formData, auth);

      const txHash = await registerCourse(
        courseId,
        BigInt(formData.pricingSetting.price),
      );

      console.log("✅ 合约注册成功，交易 Hash:", txHash);

      window.location.href = "/market";

      // 可以添加成功后的处理逻辑，比如跳转到课程详情页
      // 或者显示成功提示
    } catch (error) {
      console.error("创建课程失败:", error);
      setErrors((prev) => ({
        ...prev,
        publish:
          error instanceof Error ? error.message : "创建课程失败，请重试",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const createAllLessons = async (
    courseId: number,
    formData: any,
    auth: any,
  ) => {
    if (!Array.isArray(formData.courseContent)) return;
    await Promise.all(
      formData.courseContent
        // ✅ 过滤空章节，避免发送无意义请求
        .filter((chapter: CourseContentItem) => chapter?.title)
        .map((chapter: CourseContentItem, index: number) => {
          const lessonData = {
            title: chapter.title,
            description: chapter.description || "",
            videoUrl: chapter.videoFile || null, // 如果是 video 类型
            // content: chapter.textContent || "", // 如果是 text 类型
            duration: Number(chapter.duration) || 0,
            order: index + 1,
            type: chapter.type, // "video" | "text"
            isFreePreview: chapter.isFreePreview || false,
            courseId,
            instructorWallet: auth?.address || "",
          };

          // ✅ 并发请求创建章节
          return createLesson(lessonData);
        }),
    );
  };

  // 课程内容：添加章节
  const addChapter = () => {
    const newChapter: CourseContentItem = {
      id: `chapter-${Date.now()}`,
      title: `新章节`,
      type: "video",
      description: "",
      videoFile: null,
      duration: "",
      isFreePreview: false,
    };
    setFormData((prev) => ({
      ...prev,
      courseContent: [...prev.courseContent, newChapter],
    }));
  };

  // 课程内容：删除章节
  const removeChapter = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      courseContent: prev.courseContent.filter((ch) => ch.id !== id),
    }));
  };

  // 课程内容：更新章节
  const updateChapter = (
    id: string,
    updatedData: Partial<CourseContentItem>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      courseContent: prev.courseContent.map((ch) =>
        ch.id === id ? { ...ch, ...updatedData } : ch,
      ),
    }));
  };

  // 定价设置：更新定价
  const updatePricing = (updatedData: Partial<PricingSetting>) => {
    setFormData((prev) => ({
      ...prev,
      pricingSetting: { ...prev.pricingSetting, ...updatedData },
    }));
  };

  return (
    <CourseContext.Provider
      value={{
        formData,
        setFormData,
        errors,
        setErrors,
        isLoading,
        validateForm,
        saveDraft,
        previewCourse,
        publishCourse,
        addChapter,
        removeChapter,
        updateChapter,
        updatePricing,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourseContext = () => {
  const context = useContext(CourseContext);
  if (!context) throw new Error("useCourseContext 需在 CourseProvider 内使用");
  return context;
};
