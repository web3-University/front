"use client";

import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Clock,
  Lock,
  PlayCircle,
  Target,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Course, Lesson } from "@/lib/api/course";
import { formatLessonDuration } from "@/lib/utils/formatters";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
  loading: () => (
    <div className="aspect-video bg-gray-900 flex items-center justify-center">
      <div className="text-white">加载播放器...</div>
    </div>
  ),
});

interface CourseBodyProps {
  course: Course;
  lessons: Lesson[];
}

export default function CourseBody({ course, lessons }: CourseBodyProps) {
  const [playingLessonId, setPlayingLessonId] = useState<
    null | number | string
  >(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // 使用一个肯定可以嵌入的测试视频
  const mockVideoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePlay = (lessonId: string | number) => {
    setIsPlayerReady(false);
    setPlayerError(null);
    setPlayingLessonId(playingLessonId === lessonId ? null : lessonId);
  };

  const handleClosePlayer = () => {
    setPlayingLessonId(null);
    setIsPlayerReady(false);
    setPlayerError(null);
  };

  useEffect(() => {
    if (!playingLessonId) {
      setIsPlayerReady(false);
      setPlayerError(null);
    }
  }, [playingLessonId]);

  const hasValidObjectives =
    course.learningObjectives &&
    course.learningObjectives.length > 0 &&
    course.learningObjectives.some((obj) => obj && obj.trim() !== "");

  const hasValidPrerequisites =
    course.prerequisites &&
    course.prerequisites.length > 0 &&
    course.prerequisites.some((pre) => pre && pre.trim() !== "");

  const validTags =
    course.tags?.filter((tag) => tag && tag.trim() !== "") || [];

  const lessonList: Lesson[] = lessons
    ? [...lessons].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* 学习目标 */}
      {hasValidObjectives && (
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#2B2558]">学习目标</h2>
          </div>
          <ul className="space-y-4">
            {course.learningObjectives?.map((objective, index) => (
              <li key={index} className="flex items-start gap-4 group">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="h-6 w-6 text-green-500 transition-transform group-hover:scale-110" />
                </div>
                <span className="text-[#2B2558] text-lg leading-relaxed">
                  {objective}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 前置要求 */}
      {hasValidPrerequisites && (
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-xl">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#2B2558]">前置要求</h2>
          </div>
          <ul className="space-y-4">
            {course.prerequisites?.map((prerequisite, index) => (
              <li key={index} className="flex items-start gap-4 group">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="h-6 w-6 text-blue-500 transition-transform group-hover:scale-110" />
                </div>
                <span className="text-[#2B2558] text-lg leading-relaxed">
                  {prerequisite}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 相关标签 */}
      {validTags.length > 0 && (
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-[#2B2558] mb-4">相关标签</h3>
          <div className="flex flex-wrap gap-3">
            {validTags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-200 hover:shadow-md transition-shadow"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 课程章节 */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#2B2558]">课程章节</h2>
          <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold">
            {lessonList.length} 个章节
          </span>
        </div>

        {lessonList.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">暂无章节内容</p>
            <p className="text-gray-400 text-sm mt-2">
              课程章节正在制作中,敬请期待
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {lessonList.map((lesson, index) => {
              const lessonOrder = lesson.order ?? index + 1;
              const lessonTitle = lesson.title || `未命名章节 ${lessonOrder}`;
              const lessonSummary =
                typeof lesson.content === "string" ? lesson.content : "";
              const lessonDuration = formatLessonDuration(lesson.duration);
              const hasVideo = Boolean(lesson.videoUrl);

              return (
                <div key={lesson.id ?? `lesson-${lessonOrder}-${index}`}>
                  {/* 课程行 */}
                  <div className="group flex items-center gap-4 p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-all border border-gray-100 hover:border-blue-200">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {lessonOrder}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#2B2558] font-semibold text-lg group-hover:text-blue-600 transition-colors mb-1">
                        {lessonTitle}
                      </h3>
                      {lessonSummary && (
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {lessonSummary}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      {lessonDuration && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-600">
                            {lessonDuration}
                          </span>
                        </div>
                      )}

                      {hasVideo ? (
                        <button
                          onClick={() => handlePlay(lesson.id)}
                          className="hover:scale-110 transition-transform"
                        >
                          <PlayCircle
                            className={`h-6 w-6 ${
                              playingLessonId === lesson.id
                                ? "text-green-600"
                                : "text-green-500"
                            }`}
                          />
                        </button>
                      ) : (
                        <Lock className="h-6 w-6 text-gray-300" />
                      )}
                    </div>
                  </div>

                  {/* 视频播放器 */}
                  {isMounted && playingLessonId === lesson.id && (
                    <div
                      ref={playerContainerRef}
                      className="mt-2 bg-black rounded-lg overflow-hidden relative"
                    >
                      <button
                        onClick={handleClosePlayer}
                        className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all"
                        title="关闭"
                      >
                        <X className="h-5 w-5 text-white" />
                      </button>

                      {playerError ? (
                        <div className="aspect-video flex items-center justify-center bg-gray-900 text-white p-8">
                          <div className="text-center">
                            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
                            <p className="text-lg mb-2">视频加载失败</p>
                            <p className="text-sm text-gray-400">
                              {playerError}
                            </p>
                            <button
                              onClick={handleClosePlayer}
                              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                            >
                              关闭
                            </button>
                          </div>
                        </div>
                      ) : (
                        <ReactPlayer
                          src={lesson.videoUrl || mockVideoUrl}
                          width="100%"
                          height="100%"
                          controls={true}
                          playing={isPlayerReady}
                          light={false}
                          className="aspect-video"
                          onError={(e: any) => {
                            console.error("视频播放错误:", e);
                            setPlayerError(
                              "该视频可能不允许嵌入播放,请直接访问 YouTube 观看",
                            );
                          }}
                          onReady={() => {
                            console.log("视频准备就绪");
                            setIsPlayerReady(true);
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
