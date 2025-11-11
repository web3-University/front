"use client";

import { useCallback } from "react";
import { useAtom } from "jotai";
import { useAuth, useCourseContract } from "@web3-university/uni-wallet-lib";
import {
  createCourse,
  createLesson,
  type CreateCourseDto,
} from "@/lib/api/course";
import {
  COURSE_DRAFT_STORAGE_KEY,
  courseErrorsAtom,
  courseFormAtom,
  courseLoadingAtom,
} from "./atom";
import {
  createDefaultChapter,
  type CourseContentItem,
  type CourseFormData,
  type PricingSetting,
} from "./types";

const createAllLessons = async (
  courseId: number,
  formData: CourseFormData,
  instructorWallet?: string,
) => {
  if (!Array.isArray(formData.courseContent)) return;

  await Promise.all(
    formData.courseContent
      .filter((chapter) => chapter?.title)
      .map((chapter, index) => {
        const resolvedVideoUrl =
          typeof chapter.videoUrl === "string"
            ? chapter.videoUrl
            : typeof chapter.videoFile === "string"
              ? chapter.videoFile
              : null;

        const lessonData = {
          title: chapter.title,
          description: chapter.description || "",
          videoUrl: resolvedVideoUrl,
          duration: Number(chapter.duration) || 0,
          order: index + 1,
          type: chapter.type,
          isFreePreview: chapter.isFreePreview || false,
          courseId,
          instructorWallet: instructorWallet || "",
        };

        return createLesson(lessonData);
      }),
  );
};

export const useCourseCreateStore = () => {
  const [formData, setFormData] = useAtom(courseFormAtom);
  const [errors, setErrors] = useAtom(courseErrorsAtom);
  const [isLoading, setIsLoading] = useAtom(courseLoadingAtom);

  const auth = useAuth();
  const { registerCourse } = useCourseContract();

  const validateForm = useCallback(() => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

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
  }, [formData, setErrors]);

  const saveDraft = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          COURSE_DRAFT_STORAGE_KEY,
          JSON.stringify(formData),
        );
      }
      setErrors((prev) => ({ ...prev, draft: "" }));
    } catch (error) {
      console.error("保存草稿失败:", error);
      setErrors((prev) => ({
        ...prev,
        draft: "保存草稿失败，请重试",
      }));
    }
  }, [formData, setErrors]);

  const previewCourse = useCallback(() => {
    if (validateForm()) {
      console.log("预览课程，跳转逻辑...");
    }
  }, [validateForm]);

  const publishCourse = useCallback(async () => {
    if (!validateForm()) return;

    if (!auth.address) {
      setErrors((prev) => ({ ...prev, auth: "请先连接钱包" }));
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const createCourseData: CreateCourseDto = {
        walletAddress: auth.address,
        title: formData.basicInfo.title,
        description: formData.basicInfo.description,
        cover: formData.basicInfo.coverImage || "",
        categories: [formData.basicInfo.category],
        difficulty: formData.basicInfo.difficulty,
        price: formData.pricingSetting.price.toString(),
        duration: parseInt(formData.pricingSetting.estimatedDuration) || 0,
        isFree: formData.pricingSetting.price === 0 ? "1" : "0",
        tags: formData.basicInfo.tags,
        learningObjectives: formData.basicInfo.learningGoals,
        prerequisites: formData.basicInfo.prerequisites,
      };

      console.log("正在创建课程...", createCourseData);
      const response = await createCourse(createCourseData);
      const courseId = response.data.courseId;

      await createAllLessons(courseId, formData, auth.address);

      const txHash = await registerCourse(
        courseId,
        BigInt(formData.pricingSetting.price),
      );

      console.log("✅ 合约注册成功，交易 Hash:", txHash);
      if (typeof window !== "undefined") {
        localStorage.removeItem(COURSE_DRAFT_STORAGE_KEY);
        window.location.href = "/market";
      }
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
  }, [
    auth.address,
    formData,
    registerCourse,
    setErrors,
    setIsLoading,
    validateForm,
  ]);

  const addChapter = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      courseContent: [...prev.courseContent, createDefaultChapter()],
    }));
  }, [setFormData]);

  const removeChapter = useCallback(
    (id: string) => {
      setFormData((prev) => ({
        ...prev,
        courseContent: prev.courseContent.filter((ch) => ch.id !== id),
      }));
    },
    [setFormData],
  );

  const updateChapter = useCallback(
    (id: string, updatedData: Partial<CourseContentItem>) => {
      setFormData((prev) => ({
        ...prev,
        courseContent: prev.courseContent.map((ch) =>
          ch.id === id ? { ...ch, ...updatedData } : ch,
        ),
      }));
    },
    [setFormData],
  );

  const updatePricing = useCallback(
    (updatedData: Partial<PricingSetting>) => {
      setFormData((prev) => ({
        ...prev,
        pricingSetting: { ...prev.pricingSetting, ...updatedData },
      }));
    },
    [setFormData],
  );

  return {
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
  };
};
