import React from "react";
import { useCourseContext } from "./CourseContext";

const PreviewTab = () => {
  const { formData } = useCourseContext();

  // 模拟预览课程的方法
  const handlePreviewCourse = () => {
    console.log("预览课程，可在这里添加跳转或弹窗等逻辑");
    // 实际项目中可添加路由跳转、打开模态框等操作
  };

  return (
    <div className="space-y-6 text-gray-800">
      <h2 className="text-xl font-semibold">课程预览</h2>

      <div className="flex items-center border border-gray-200 bg-white rounded-xl p-4 shadow">
        {/* 课程预览图（从formData中获取封面图） */}
        {formData.basicInfo.coverImage ? (
          <img
            src={formData.basicInfo.coverImage}
            alt="课程封面"
            className="w-1/3 h-auto rounded-md object-cover"
          />
        ) : (
          <div className="w-1/3 h-40 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
            暂无封面
          </div>
        )}

        <div className="ml-6 flex-1 space-y-2">
          <h3 className="text-lg font-semibold">
            {formData.basicInfo.title || "课程标题"}
          </h3>
          <p className="text-sm text-gray-600">
            {formData.basicInfo.description || "课程描述..."}
          </p>
          <span className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
            {formData.basicInfo.difficulty || "初级"}
          </span>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-yellow-500 font-bold">YD</span>
            <span className="text-lg font-semibold">
              {formData.pricingSetting.price || 299}
            </span>
          </div>
        </div>

        <button
          onClick={handlePreviewCourse}
          className="ml-6 bg-gradient-to-r from-pink-400 to-purple-500 text-white px-5 py-2 rounded-md hover:opacity-90 transition"
        >
          预览课程
        </button>
      </div>

      <h3 className="text-lg font-semibold">课程章节</h3>
      <div className="bg-white border border-gray-200 rounded-lg shadow">
        {/* 遍历formData.courseContent生成课程章节 */}
        {formData.courseContent.map((chapter, index) => (
          <div
            key={chapter.id}
            className="flex items-center justify-between px-4 py-3 border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <span className="bg-purple-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                {index + 1}
              </span>
              <span>{chapter.title || `章节 ${index + 1}`}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-lg">
                {chapter.type === "video" ? "📹" : "📄"}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  chapter.isFreePreview
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {chapter.isFreePreview ? "免费" : "付费"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviewTab;
