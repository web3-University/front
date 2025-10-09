"use client";
import CourseItem from "./CourseItem";

export type FeaturedCourse = {
  id: string;
  title: string;
  category: string;
  instructor: string;
  rating: number;
  students: number;
  price: number;
  coverColor: string;
};

const _fallbackCourses: FeaturedCourse[] = [
  {
    id: "intro-chain",
    title: "区块链开发入门",
    category: "编程",
    instructor: "李教授",
    rating: 4.9,
    students: 1250,
    price: 299,
    coverColor: "from-[#4B6CFF] to-[#7EE7FF]",
  },
  {
    id: "web3-frontend",
    title: "Web3 前端开发实战",
    category: "前端",
    instructor: "张老师",
    rating: 4.8,
    students: 890,
    price: 399,
    coverColor: "from-[#FF9F7B] to-[#FFD56F]",
  },
  {
    id: "smart-contract-security",
    title: "智能合约安全审计",
    category: "安全",
    instructor: "王专家",
    rating: 4.9,
    students: 567,
    price: 599,
    coverColor: "from-[#7E64FF] to-[#B79BFF]",
  },
];
const CourseList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {_fallbackCourses.map((course) => (
        <CourseItem key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CourseList;
