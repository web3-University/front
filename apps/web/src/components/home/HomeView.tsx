import Hero from "@/components/home/Hero";
import PlatformAdvantages from "@/components/home/PlatformAdvantages";
import FeaturedCourses from "@/components/home/FeaturedCourses";

// 首页主体内容，不含全局布局元素
export default function HomeView() {
  return (
    <main className="pt-32">
      {/* 留出固定头部的高度 */}
      <Hero />
      <PlatformAdvantages />
      <FeaturedCourses />
      {/* TODO: 精选课程、教师招募等板块 */}
    </main>
  );
}
