import React from "react";
// import { FaSave, FaEye, FaCheck } from 'react-icons/fa';
import { useCourseContext } from "./CourseContext";

const QuickActions = () => {
  const { saveDraft, previewCourse, publishCourse } = useCourseContext();

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <h3 className="text-white text-sm font-medium mb-3">快捷操作</h3>
      <button
        onClick={saveDraft}
        className="w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm py-2 rounded mb-2 transition-colors"
      >
        {/* <FaSave className="w-4 h-4" /> */}
        <span>保存草稿</span>
      </button>
      <button
        onClick={previewCourse}
        className="w-full flex items-center justify-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-600 text-sm py-2 rounded mb-2 transition-colors"
      >
        {/* <FaEye className="w-4 h-4" /> */}
        <span>预览课程</span>
      </button>
      <button
        onClick={publishCourse}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white text-sm py-2 rounded transition-colors"
      >
        {/* <FaCheck className="w-4 h-4" /> */}
        <span>发布课程</span>
      </button>
    </div>
  );
};

export default QuickActions;
