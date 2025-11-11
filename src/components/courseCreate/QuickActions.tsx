import React from "react";
// import { FaSave, FaEye, FaCheck } from 'react-icons/fa';
import { useCourseCreateStore } from "@/state/courseCreate/hooks";

const QuickActions = ({ onPreview }: { onPreview?: () => void }) => {
  const { saveDraft, previewCourse, publishCourse } = useCourseCreateStore();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow space-y-2">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">快捷操作</h3>
      <button
        onClick={saveDraft}
        className="w-full text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-md transition"
      >
        {/* <FaSave className="w-4 h-4" /> */}
        <span>保存草稿</span>
      </button>
      <button
        onClick={onPreview}
        className="w-full text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 py-2 rounded-md transition"
      >
        {/* <FaEye className="w-4 h-4" /> */}
        <span>预览课程</span>
      </button>
      <button
        onClick={publishCourse}
        className="w-full text-sm bg-gradient-to-r from-emerald-400 to-blue-400 hover:opacity-90 text-white py-2 rounded-md transition"
      >
        {/* <FaCheck className="w-4 h-4" /> */}
        <span>发布课程</span>
      </button>
    </div>
  );
};

export default QuickActions;
