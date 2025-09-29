import React from "react";
import { useCourseContext } from "../components/CourseContext";

const PreviewTab = () => {
  const { formData } = useCourseContext();

  // 模拟预览课程的方法
  const handlePreviewCourse = () => {
    console.log("预览课程，可在这里添加跳转或弹窗等逻辑");
    // 实际项目中可添加路由跳转、打开模态框等操作
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-white text-xl font-semibold mb-6">课程预览</h2>
      <div className="flex items-center bg-gray-700 rounded-lg p-4 mb-6">
        {/* 课程预览图（从formData中获取封面图） */}
        {formData.basicInfo.coverImage ? (
          <img
            src={URL.createObjectURL(formData.basicInfo.coverImage)}
            alt="课程封面"
            className="w-1/3 rounded-md"
          />
        ) : (
          <div className="w-1/3 h-40 bg-gray-600 rounded-md flex items-center justify-center">
            <span className="text-gray-400">暂无封面</span>
          </div>
        )}
        <div className="ml-6 flex-1">
          <h3 className="text-white text-xl font-semibold mb-2">
            {formData.basicInfo.title || "课程标题"}
          </h3>
          <p className="text-gray-300 mb-4">
            {formData.basicInfo.description || "课程描述..."}
          </p>
          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
            {formData.basicInfo.difficulty || "初级"}
          </span>
          <div className="mt-4 flex items-center">
            <span className="text-yellow-400 mr-1">YD</span>
            <span className="text-yellow-400 text-lg font-semibold">
              {formData.pricingSetting.price || 299}
            </span>
          </div>
        </div>
        <button
          onClick={handlePreviewCourse}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
        >
          预览课程
        </button>
      </div>

      <h3 className="text-white text-lg font-semibold mb-3">课程章节</h3>
      <div className="bg-gray-700 rounded-lg p-4">
        {/* 遍历formData.courseContent生成课程章节 */}
        {formData.courseContent.map((chapter, index) => (
          <div
            key={chapter.id}
            className="flex items-center justify-between p-3 border-b border-gray-600"
          >
            <div className="flex items-center">
              <span className="bg-blue-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center mr-3">
                {index + 1}
              </span>
              <span className="text-white">{chapter.title}</span>
            </div>
            <div className="flex items-center">
              <span className="text-purple-400 mr-3">📹</span>
              <span
                className={`bg-${chapter.isFreePreview ? "green" : "gray"}-600 text-white text-xs px-2 py-1 rounded`}
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
