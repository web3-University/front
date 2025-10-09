import React from "react";

interface ButtonCvaProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}
declare const ButtonCva: React.ForwardRefExoticComponent<
  ButtonCvaProps & React.RefAttributes<HTMLButtonElement>
>;

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    category: string;
    instructor: string;
    rating: number;
    students: number;
    price: number;
    coverColor: string;
  };
  onDetail?: (course: CourseCardProps["course"]) => void;
  clickable?: boolean;
  children?: React.ReactNode;
}
declare const CourseCard: React.FC<CourseCardProps>;

export { ButtonCva, CourseCard };
export type { ButtonCvaProps, CourseCardProps };
