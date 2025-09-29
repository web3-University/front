import React, { ChangeEvent } from "react";
// import { FaVideo, FaFont } from 'react-icons/fa';
import {
  useCourseContext,
  CourseContentItem,
} from "../components/CourseContext";

const ContentTab = () => {
  const { formData, updateChapter, addChapter, removeChapter, errors } =
    useCourseContext();

  // 处理章节类型切换（视频/文字）
  const handleTypeChange = (id: string, type: "video" | "text") => {
    updateChapter(id, { type });
  };

  // 处理章节输入变更（标题、描述、时长等）
  const handleChapterChange = (
    id: string,
    field: keyof Omit<CourseContentItem, "id" | "type">,
    value: string | boolean | File | null,
  ) => {
    updateChapter(id, { [field]: value } as Partial<CourseContentItem>);
  };

  // 处理视频上传
  const handleVideoUpload = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleChapterChange(id, "videoFile", e.target.files[0]);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-white text-lg font-semibold mb-6">课程内容</h3>
      <button
        onClick={addChapter}
        className="ml-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md mb-4"
      >
        + 添加章节
      </button>

      {formData.courseContent.map((chapter) => (
        <div key={chapter.id} className="bg-gray-700 rounded-md p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            {/* 章节标题、类型切换 */}
            <input
              type="text"
              value={chapter.title}
              onChange={(e) =>
                handleChapterChange(chapter.id, "title", e.target.value)
              }
              placeholder="章节标题"
              className="bg-gray-600 text-white rounded-md p-2 flex-1"
            />
            <div className="flex space-x-2">
              {/* 章节类型下拉选择 */}
              <select
                value={chapter.type}
                onChange={(e) =>
                  handleTypeChange(
                    chapter.id,
                    e.target.value as "video" | "text",
                  )
                }
                className="bg-gray-600 text-white rounded-md p-2"
              >
                <option value="video">视频</option>
                <option value="text">文字</option>
              </select>
              <button
                onClick={() => removeChapter(chapter.id)}
                className="p-2 rounded-md bg-red-600 text-white"
              >
                ×
              </button>
            </div>
          </div>

          {/* 章节描述 */}
          <textarea
            value={chapter.description}
            onChange={(e) =>
              handleChapterChange(chapter.id, "description", e.target.value)
            }
            placeholder="章节描述..."
            className={`w-full bg-gray-600 text-white rounded-md p-2 mb-2 ${
              errors[`courseContent.${chapter.id}.description`]
                ? "border-red-500"
                : ""
            }`}
          />
          {errors[`courseContent.${chapter.id}.description`] && (
            <p className="text-red-500 text-xs mb-2">
              {errors[`courseContent.${chapter.id}.description`]}
            </p>
          )}

          {/* 视频/文字内容区域 */}
          {chapter.type === "video" ? (
            <div className="border-2 border-dashed border-gray-600 rounded-md p-6 text-center mb-2">
              {/* <FaVideo className="text-blue-400 text-3xl mb-2" /> */}
              <p className="text-gray-400 mb-1">上传视频文件</p>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleVideoUpload(chapter.id, e)}
                className="hidden"
                id={`video-${chapter.id}`}
              />
              <label
                htmlFor={`video-${chapter.id}`}
                className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md cursor-pointer"
              >
                选择视频
              </label>
              {chapter.videoFile && (
                <p className="text-gray-400 text-xs mt-2">
                  已选择: {chapter.videoFile.name}
                </p>
              )}
              {errors[`courseContent.${chapter.id}.videoFile`] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[`courseContent.${chapter.id}.videoFile`]}
                </p>
              )}
            </div>
          ) : (
            <textarea
              value={chapter.textContent || ""}
              onChange={(e) =>
                handleChapterChange(chapter.id, "textContent", e.target.value)
              }
              placeholder="输入课程文字内容..."
              rows={4}
              className={`w-full bg-gray-600 text-white rounded-md p-2 ${
                errors[`courseContent.${chapter.id}.textContent`]
                  ? "border-red-500"
                  : ""
              }`}
            />
          )}

          {/* 时长与免费预览 */}
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={chapter.duration || ""}
              onChange={(e) =>
                handleChapterChange(chapter.id, "duration", e.target.value)
              }
              placeholder="时长"
              className="bg-gray-600 text-white rounded-md p-2 w-24"
            />
            <label className="flex items-center space-x-2 text-gray-300">
              <input
                type="checkbox"
                checked={chapter.isFreePreview}
                onChange={(e) =>
                  handleChapterChange(
                    chapter.id,
                    "isFreePreview",
                    e.target.checked,
                  )
                }
                className="accent-blue-600"
              />
              免费预览
            </label>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContentTab;
