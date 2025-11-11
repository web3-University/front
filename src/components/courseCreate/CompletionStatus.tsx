import React from "react";
import { useCourseCreateStore } from "@/state/courseCreate/hooks";

const CompletionStatus = () => {
  const { formData, errors } = useCourseCreateStore();

  // 计算基本信息完成状态
  const isBasicInfoComplete = () => {
    // 检查基本信息是否有必填项错误
    const hasBasicErrors = Object.keys(errors).some((key) =>
      key.startsWith("basicInfo."),
    );
    // 检查标题是否填写（核心必填项）
    return !hasBasicErrors && !!formData.basicInfo.title.trim();
  };

  // 计算课程内容完成状态
  const getCourseContentStatus = () => {
    const total = formData.courseContent.length;
    const completed = formData.courseContent.filter((chapter) => {
      // 检查章节是否有错误
      const hasChapterErrors = Object.keys(errors).some((key) =>
        key.startsWith(`courseContent.${chapter.id}.`),
      );
      // 检查章节核心内容是否完成
      if (chapter.type === "video") {
        return !hasChapterErrors && !!chapter.videoFile;
      } else {
        return !hasChapterErrors && !!chapter.textContent?.trim();
      }
    }).length;

    return { completed, total };
  };

  // 计算定价设置完成状态
  const isPricingComplete = () => {
    // 检查定价是否有错误
    const hasPricingErrors = Object.keys(errors).some((key) =>
      key.startsWith("pricingSetting."),
    );
    // 检查价格和时长是否填写
    return (
      !hasPricingErrors &&
      formData.pricingSetting.price > 0 &&
      !!formData.pricingSetting.estimatedDuration.trim()
    );
  };

  const basicInfoStatus = isBasicInfoComplete() ? "已完成" : "进行中";
  const { completed: contentCompleted, total: contentTotal } =
    getCourseContentStatus();
  const pricingStatus = isPricingComplete() ? "已设置" : "未设置";

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">📊 完成情况</h3>
      <ul className="space-y-2 text-sm text-gray-700">
        <li className="flex justify-between items-center">
          <span>基本信息：</span>
          <span
            className={`font-medium ${
              basicInfoStatus === "已完成"
                ? "text-emerald-500"
                : "text-yellow-500"
            }`}
          >
            {basicInfoStatus}
          </span>
        </li>
        <li className="flex justify-between items-center">
          <span>课程内容：</span>
          <span
            className={`font-medium ${
              contentCompleted === contentTotal
                ? "text-emerald-500"
                : "text-yellow-500"
            }`}
          >
            {contentCompleted}/{contentTotal}
          </span>
        </li>
        <li className="flex justify-between items-center">
          <span>定价设置：</span>
          <span
            className={`font-medium ${
              pricingStatus === "已设置"
                ? "text-emerald-500"
                : "text-yellow-500"
            }`}
          >
            {pricingStatus}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default CompletionStatus;
