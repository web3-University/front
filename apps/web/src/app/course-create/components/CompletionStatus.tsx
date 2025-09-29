import React from "react";
import { useCourseContext } from "./CourseContext";

const CompletionStatus = () => {
  const { formData, errors } = useCourseContext();

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
    <div className="rounded-lg p-4 border border-indigo-700">
      <div className="flex items-center mb-4">
        <h3 className="text-white text-base font-medium">📊 完成情况</h3>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <p className="text-gray-300 text-sm">基本信息:</p>
          <p
            className={`text-sm font-medium ${
              basicInfoStatus === "已完成"
                ? "text-green-400"
                : "text-yellow-400"
            }`}
          >
            {basicInfoStatus}
          </p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-300 text-sm">课程内容:</p>
          <p
            className={`text-sm font-medium ${
              contentCompleted === contentTotal
                ? "text-green-400"
                : "text-yellow-400"
            }`}
          >
            {contentCompleted}/{contentTotal}
          </p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-300 text-sm">定价设置:</p>
          <p
            className={`text-sm font-medium ${
              pricingStatus === "已设置" ? "text-green-400" : "text-yellow-400"
            }`}
          >
            {pricingStatus}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompletionStatus;
