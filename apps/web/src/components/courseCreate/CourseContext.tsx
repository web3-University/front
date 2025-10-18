"use client";
import React, {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

// 课程内容项类型
export interface CourseContentItem {
  id: string;
  title: string;
  type: "video" | "text";
  description: string;
  videoFile?: File | null;
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
    coverImage: File | null;
    tags: string[];
    learningGoals: string[];
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
  validateForm: () => boolean;
  saveDraft: () => void;
  previewCourse: () => void;
  publishCourse: () => void;
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
  // 初始状态
  const [formData, setFormData] = useState<CourseFormData>({
    basicInfo: {
      title: "",
      description: "",
      category: "",
      difficulty: "beginner",
      coverImage: null,
      tags: [],
      learningGoals: ["掌握基础"],
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
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
  const saveDraft = () => {
    if (validateForm()) {
      console.log("保存草稿：", formData);
      // 可添加「保存到本地/后端」逻辑
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
  const publishCourse = () => {
    if (validateForm()) {
      console.log("发布课程：", formData);
      // 可添加「提交到后端」逻辑
    }
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
