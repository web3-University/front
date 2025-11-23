import React from "react";
import { useTranslations } from "next-intl";
// import { FaSave, FaEye, FaCheck } from 'react-icons/fa';
import { useCourseCreateStore } from "@/state/courseCreate/hooks";

const QuickActions = ({ onPreview }: { onPreview?: () => void }) => {
  const { saveDraft, previewCourse, publishCourse } = useCourseCreateStore();
  const tQuick = useTranslations("courseCreate.sidebar.quickActions");

  const handlePreviewClick = () => {
    previewCourse();
    onPreview?.();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow space-y-2">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">
        {tQuick("title")}
      </h3>
      <button
        onClick={saveDraft}
        className="w-full text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-md transition"
      >
        {/* <FaSave className="w-4 h-4" /> */}
        <span>{tQuick("saveDraft")}</span>
      </button>
      <button
        onClick={handlePreviewClick}
        className="w-full text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 py-2 rounded-md transition"
      >
        {/* <FaEye className="w-4 h-4" /> */}
        <span>{tQuick("preview")}</span>
      </button>
      <button
        onClick={publishCourse}
        className="w-full text-sm bg-gradient-to-r from-emerald-400 to-blue-400 hover:opacity-90 text-white py-2 rounded-md transition"
      >
        {/* <FaCheck className="w-4 h-4" /> */}
        <span>{tQuick("publish")}</span>
      </button>
    </div>
  );
};

export default QuickActions;
