import React from "react";
import { useTranslations } from "next-intl";
import { useCourseCreateStore } from "@/state/courseCreate/hooks";

export default function ProgressBar() {
  const { formData, errors } = useCourseCreateStore();
  const tProgress = useTranslations("courseCreate.progress");

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
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        {tProgress("title")}
      </h3>
      <div className="text-right text-xs text-gray-500 mb-1">{progress}%</div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            progress >= 60 ? "bg-emerald-400" : "bg-purple-400"
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p
        className={`text-xs mt-2 ${
          progress >= 60 ? "text-emerald-600" : "text-gray-500"
        }`}
      >
        {progress >= 60 ? tProgress("ready") : tProgress("requirement")}
      </p>
    </div>
  );
}
