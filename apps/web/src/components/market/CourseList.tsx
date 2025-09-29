import CourseItem from "./CourseItem";

const courses = [
  {
    id: 1,
    title: "区块链开发入门",
    description: "从零开始学习区块链开发，掌握智能合约编写",
    instructor: "李教授",
    rating: 4.9,
    reviews: 1250,
    duration: "20小时",
    price: 299,
    originalPrice: 399,
    tag: "热门",
    image: "/blockchain-intro.jpg",
  },
];
const CourseList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseItem key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CourseList;
