import React from "react";
import { useCourseContext } from "./CourseContext";

export default function ProgressBar() {
  const { formData, errors } = useCourseContext();

  // 计算各部分完成度（0-100）
  const calculateBasicInfoProgress = () => {
    const basicInfo = formData.basicInfo;
    const requiredFields = [
      basicInfo.title.trim(),
      basicInfo.description.trim(),
      basicInfo.category,
      basicInfo.coverImage,
    ];
    const completedFields = requiredFields.filter(Boolean).length;
    return (completedFields / requiredFields.length) * 100;
  };

  const calculateCourseContentProgress = () => {
    if (formData.courseContent.length === 0) return 0;

    const completedChapters = formData.courseContent.filter((chapter) => {
      const hasErrors = Object.keys(errors).some((key) =>
        key.startsWith(`courseContent.${chapter.id}.`),
      );
      if (hasErrors) return false;

      return chapter.type === "video"
        ? !!chapter.videoFile
        : !!chapter.textContent?.trim();
    }).length;

    return (completedChapters / formData.courseContent.length) * 100;
  };

  const calculatePricingProgress = () => {
    const pricing = formData.pricingSetting;
    const requiredFields = [
      pricing.price > 0,
      pricing.estimatedDuration.trim(),
    ];
    const completedFields = requiredFields.filter(Boolean).length;
    return (completedFields / requiredFields.length) * 100;
  };

  // 计算整体进度（各部分权重相等）
  const calculateOverallProgress = () => {
    const basicProgress = calculateBasicInfoProgress();
    const contentProgress = calculateCourseContentProgress();
    const pricingProgress = calculatePricingProgress();
    return Math.round((basicProgress + contentProgress + pricingProgress) / 3);
  };

  // 优先使用外部传入的进度，否则使用计算的进度
  const progress = calculateOverallProgress();

  return (
    <div className="bg-gray-800 rounded p-4 mb-4">
      <h3 className="text-white text-sm font-medium mb-1">课程完成度</h3>
      <div className="text-right text-gray-400 text-xs mt-1">{progress}%</div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            progress >= 60 ? "bg-green-600" : "bg-indigo-600"
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p
        className={`text-xs mt-1 ${progress >= 60 ? "text-green-400" : "text-gray-400"}`}
      >
        {progress >= 60 ? "已满足发布条件！" : "至少需要60%完成度才能发布课程"}
      </p>
    </div>
  );
}
