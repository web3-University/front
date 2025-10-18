"use client";

import type { Course, Lesson } from "@/lib/api/course";
import { formatLessonDuration } from "@/lib/utils/formatters";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Lock,
  PlayCircle,
  Target,
} from "lucide-react";

interface CourseBodyProps {
  course: Course;
  lessons: Lesson[];
}

export default function CourseBody({ course, lessons }: CourseBodyProps) {
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
              课程章节正在制作中，敬请期待
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
                <div
                  key={lesson.id ?? `lesson-${lessonOrder}-${index}`}
                  className="group flex items-center gap-4 p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-all border border-gray-100 hover:border-blue-200"
                >
                  {/* 章节序号 */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {lessonOrder}
                  </div>

                  {/* 章节信息 */}
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

                  {/* 时长和状态 */}
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
                      <PlayCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <Lock className="h-6 w-6 text-gray-300" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
