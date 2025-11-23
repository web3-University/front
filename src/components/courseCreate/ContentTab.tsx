import React, { type ChangeEvent, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUpload, formatFileSize, formatSpeed } from "@/hooks/useUpload";
import { useCourseCreateStore } from "@/state/courseCreate/hooks";
import type { CourseContentItem } from "@/state/courseCreate/types";

// 上传状态管理
interface ChapterUploadState {
  [chapterId: string]: {
    isUploading: boolean;
    progress: number;
    error: string | null;
    uploadSpeed: number;
    currentChunk: number;
    totalChunks: number;
  };
}

const ContentTab = () => {
  const { formData, updateChapter, addChapter, removeChapter, errors } =
    useCourseCreateStore();
  const tContent = useTranslations("courseCreate.content");

  // 为每个章节维护独立的上传状态
  const [uploadStates, setUploadStates] = useState<ChapterUploadState>({});

  // 使用 useUpload hook
  const uploadHook = useUpload();
  // const {uploadFile,progress,uploadSpeed,} =  uploadHook

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

  // 处理视频上传（使用分片上传）
  const handleVideoUpload = async (
    id: string,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    console.log(file, "__fileTYPE🚀");
    console.log("📹 开始上传视频文件:", {
      fileName: file.name,
      fileSize: formatFileSize(file.size),
      fileType: file.type,
    });

    // 先保存文件对象到状态（用于显示文件名）
    handleChapterChange(id, "videoFile", file);

    // 初始化上传状态
    setUploadStates((prev) => ({
      ...prev,
      [id]: {
        isUploading: true,
        progress: 0,
        error: null,
        uploadSpeed: 0,
        currentChunk: 0,
        totalChunks: 0,
      },
    }));

    try {
      // 使用 hook 上传视频文件
      // 文件大于10MB会自动启用分片上传
      const videoUrl = await uploadHook.uploadFile(file, "video");
      console.log(videoUrl, "___videourl");
      if (videoUrl) {
        console.log("✅ 视频上传成功:", videoUrl);

        // 保存视频URL到章节数据
        updateChapter(id, {
          videoUrl: videoUrl,
          videoFile: file,
        });

        // 更新上传状态为成功
        setUploadStates((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            isUploading: false,
            progress: 100,
            error: null,
          },
        }));
      } else {
        throw new Error(tContent("uploadMissingUrl"));
      }
    } catch (error) {
      console.error("❌ 视频上传失败:", error);

      // 更新上传状态为失败
      setUploadStates((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          isUploading: false,
          progress: 0,
          error:
            error instanceof Error
              ? error.message
              : tContent("uploadFailedFallback"),
        },
      }));

      // 清除文件
      handleChapterChange(id, "videoFile", null);
    }
  };

  // 监听上传进度（从hook获取）
  useEffect(() => {
    // 当有章节在上传时，更新对应的进度
    Object.keys(uploadStates).forEach((chapterId) => {
      if (uploadStates[chapterId]?.isUploading && uploadHook.isUploading) {
        setUploadStates((prev) => ({
          ...prev,
          [chapterId]: {
            ...prev[chapterId],
            progress: uploadHook.progress,
            uploadSpeed: uploadHook.uploadSpeed,
            currentChunk: uploadHook.currentChunk,
            totalChunks: uploadHook.totalChunks,
          },
        }));
      }
    });
  }, [
    uploadHook.progress,
    uploadHook.uploadSpeed,
    uploadHook.currentChunk,
    uploadHook.totalChunks,
  ]);

  // 取消上传
  const handleCancelUpload = (id: string) => {
    uploadHook.cancelUpload();

    setUploadStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isUploading: false,
        progress: 0,
        error: tContent("uploadCancelled"),
      },
    }));

    // 清除文件
    handleChapterChange(id, "videoFile", null);
  };

  // 重新上传
  const handleRetryUpload = (id: string) => {
    const chapter = formData.courseContent.find((ch) => ch.id === id);
    if (chapter?.videoFile) {
      // 创建一个新的文件输入事件
      const event = {
        target: {
          files: [chapter.videoFile],
        },
      } as unknown as ChangeEvent<HTMLInputElement>;

      handleVideoUpload(id, event);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-gray-800 text-lg font-semibold">
        {tContent("title")}
      </h3>
      <button
        onClick={addChapter}
        className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-4 py-2 rounded-md shadow hover:opacity-90 transition"
      >
        + {tContent("addChapter")}
      </button>

      {formData.courseContent.map((chapter) => {
        const uploadState = uploadStates[chapter.id];
        const isUploading = uploadState?.isUploading || false;
        const uploadProgress = uploadState?.progress || 0;
        const uploadError = uploadState?.error;
        const uploadSpeed = uploadState?.uploadSpeed || 0;
        const currentChunk = uploadState?.currentChunk || 0;
        const totalChunks = uploadState?.totalChunks || 0;

        return (
          <div
            key={chapter.id}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow space-y-4"
          >
            <div className="flex justify-between items-center">
              {/* 章节标题、类型切换 */}
              <input
                type="text"
                value={chapter.title}
                onChange={(e) =>
                  handleChapterChange(chapter.id, "title", e.target.value)
                }
                placeholder={tContent("chapterTitlePlaceholder")}
                className="flex-1 rounded-md border border-gray-300 p-2 text-gray-800"
                disabled={isUploading}
              />
              <div className="flex items-center gap-2 ml-4">
                {/* 章节类型下拉选择 */}
                <select
                  value={chapter.type}
                  onChange={(e) =>
                    handleTypeChange(
                      chapter.id,
                      e.target.value as "video" | "text",
                    )
                  }
                  className="rounded-md border border-gray-300 p-2 text-gray-800"
                  disabled={isUploading}
                >
                  <option value="video">{tContent("types.video")}</option>
                  <option value="text">{tContent("types.text")}</option>
                </select>
                <button
                  onClick={() => removeChapter(chapter.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md disabled:opacity-50"
                  disabled={isUploading}
                  aria-label={tContent("removeChapterAria")}
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
              placeholder={tContent("descriptionPlaceholder")}
              className={`w-full rounded-md border p-2 text-gray-800 ${
                errors[`courseContent.${chapter.id}.description`]
                  ? "border-red-400"
                  : "border-gray-300"
              }`}
              disabled={isUploading}
            />
            {errors[`courseContent.${chapter.id}.description`] && (
              <p className="text-red-500 text-xs">
                {errors[`courseContent.${chapter.id}.description`]}
              </p>
            )}

            {/* 视频/文字内容区域 */}
            {chapter.type === "video" ? (
              <div className="space-y-3">
                <div
                  className={`border-2 border-dashed rounded-md p-6 text-center transition-colors ${
                    isUploading
                      ? "border-purple-400 bg-purple-50"
                      : "border-gray-300 bg-gray-50"
                  }`}
                >
                  {!isUploading && !chapter.videoUrl && (
                    <>
                      <p className="text-gray-600 mb-2">
                        {tContent("uploadPrompt")}
                      </p>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleVideoUpload(chapter.id, e)}
                        className="hidden"
                        id={`video-${chapter.id}`}
                      />
                      <label
                        htmlFor={`video-${chapter.id}`}
                        className="inline-block px-4 py-2 bg-purple-500 text-white text-sm rounded-md cursor-pointer hover:bg-purple-600 transition"
                      >
                        {tContent("selectVideo")}
                      </label>
                      {chapter.videoFile && (
                        <p className="text-sm text-gray-500 mt-2">
                          {tContent("selectedLabel")}
                          {chapter.videoFile instanceof File
                            ? chapter.videoFile.name
                            : chapter.videoFile ||
                              tContent("uploadedVideoFallback")}
                        </p>
                      )}
                    </>
                  )}

                  {/* 上传中状态 */}
                  {isUploading && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center mb-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                        <span className="ml-3 text-purple-600 font-medium">
                          {totalChunks > 1
                            ? tContent("uploadingChunk", {
                                current: currentChunk,
                                total: totalChunks,
                              })
                            : tContent("uploading")}
                        </span>
                      </div>

                      {/* 进度条 */}
                      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>

                      {/* 上传信息 */}
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{uploadProgress}%</span>
                        {uploadSpeed > 0 && (
                          <span>
                            {tContent("speedLabel", {
                              speed: formatSpeed(uploadSpeed),
                            })}
                          </span>
                        )}
                        {chapter.videoFile && (
                          <span>
                            {tContent("sizeLabel", {
                              size:
                                chapter.videoFile instanceof File
                                  ? formatFileSize(chapter.videoFile.size)
                                  : tContent("uploadedVideoFallback"),
                            })}
                          </span>
                        )}
                      </div>

                      {/* 取消按钮 */}
                      <button
                        onClick={() => handleCancelUpload(chapter.id)}
                        className="px-3 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 transition"
                      >
                        {tContent("cancelUpload")}
                      </button>
                    </div>
                  )}

                  {/* 上传成功状态 */}
                  {!isUploading && chapter.videoUrl && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center text-green-600">
                        <svg
                          className="w-6 h-6 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="font-medium">
                          {tContent("uploadSuccess")}
                        </span>
                      </div>
                      {chapter.videoFile && (
                        <p className="text-sm text-gray-600">
                          {chapter.videoFile instanceof File
                            ? `${chapter.videoFile.name} (${formatFileSize(chapter.videoFile.size)})`
                            : chapter.videoFile ||
                              tContent("uploadedVideoFallback")}
                        </p>
                      )}
                      <div className="flex gap-2 justify-center">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleVideoUpload(chapter.id, e)}
                          className="hidden"
                          id={`video-replace-${chapter.id}`}
                        />
                        <label
                          htmlFor={`video-replace-${chapter.id}`}
                          className="px-3 py-1 bg-gray-500 text-white text-sm rounded-md cursor-pointer hover:bg-gray-600 transition"
                        >
                          {tContent("replaceVideo")}
                        </label>
                      </div>
                    </div>
                  )}

                  {/* 错误状态 */}
                  {uploadError && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-red-600 text-sm flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {uploadError}
                      </p>
                      <button
                        onClick={() => handleRetryUpload(chapter.id)}
                        className="mt-2 px-3 py-1 bg-purple-500 text-white text-sm rounded-md hover:bg-purple-600 transition"
                      >
                        {tContent("retryUpload")}
                      </button>
                    </div>
                  )}
                </div>

                {errors[`courseContent.${chapter.id}.videoFile`] && (
                  <p className="text-red-500 text-xs">
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
                placeholder={tContent("textContentPlaceholder")}
                className={`w-full rounded-md border p-2 text-gray-800 ${
                  errors[`courseContent.${chapter.id}.textContent`]
                    ? "border-red-400"
                    : "border-gray-300"
                }`}
                rows={4}
                disabled={isUploading}
              />
            )}

            {/* 时长与免费预览 */}
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={chapter.duration || ""}
                onChange={(e) =>
                  handleChapterChange(chapter.id, "duration", e.target.value)
                }
                placeholder={tContent("durationPlaceholder")}
                className="w-28 rounded-md border border-gray-300 p-2 text-gray-800"
                disabled={isUploading}
              />
              <label className="flex items-center gap-2 text-gray-700">
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
                  className="accent-purple-500"
                  disabled={isUploading}
                />
                {tContent("freePreview")}
              </label>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContentTab;
