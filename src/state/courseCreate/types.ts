export type ChapterType = "video" | "text";

export interface CourseContentItem {
  id: string;
  title: string;
  type: ChapterType;
  description: string;
  videoFile?: string | File | null;
  videoUrl?: string | null;
  textContent?: string;
  duration?: string;
  isFreePreview: boolean;
}

export interface PricingSetting {
  price: number;
  estimatedDuration: string;
  pricingStrategy: "basic" | "standard" | "premium";
}

export interface CourseFormData {
  basicInfo: {
    title: string;
    description: string;
    category: string;
    difficulty: string;
    coverImage: string | null;
    tags: string[];
    learningGoals: string[];
    prerequisites: string[];
  };
  courseContent: CourseContentItem[];
  pricingSetting: PricingSetting;
}

export const createDefaultChapter = (): CourseContentItem => ({
  id: `chapter-${Date.now()}`,
  title: "新章节",
  type: "video",
  description: "",
  videoFile: null,
  videoUrl: null,
  duration: "",
  isFreePreview: false,
});

export const defaultCourseFormState: CourseFormData = {
  basicInfo: {
    title: "",
    description: "",
    category: "",
    difficulty: "1",
    coverImage: null,
    tags: [],
    learningGoals: ["掌握基础"],
    prerequisites: [],
  },
  courseContent: [
    {
      id: "chapter-1",
      title: "课程介绍",
      type: "video",
      description: "",
      videoFile: null,
      videoUrl: null,
      duration: "",
      isFreePreview: true,
    },
  ],
  pricingSetting: {
    price: 0,
    estimatedDuration: "",
    pricingStrategy: "basic",
  },
};
