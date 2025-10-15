import type React from "react";
export interface CourseCardProps {
    course: {
        id: string;
        title: string;
        description: string;
        category: string;
        instructor: string;
        rating: number;
        students: number;
        price: number;
        coverColor: string;
        duration?: number;
        difficulty?: string;
    };
    onDetail?: (course: CourseCardProps["course"]) => void;
    clickable?: boolean;
    children?: React.ReactNode;
}
export declare const CourseCard: React.FC<CourseCardProps>;
