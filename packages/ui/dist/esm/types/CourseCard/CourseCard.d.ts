import type React from "react";
export interface CourseCardProps {
    course: {
        id: string;
        title: string;
        description?: string;
        category: string;
        instructor: string;
        rating: number;
        students: number;
        duration?: number;
        difficulty?: string;
        price: number;
        coverColor: string;
        cover?: string;
    };
    onDetail?: (course: CourseCardProps["course"]) => void;
    clickable?: boolean;
    children?: React.ReactNode;
}
export declare const CourseCard: React.FC<CourseCardProps>;
