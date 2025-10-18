import FeaturedCourses from "@/components/home/FeaturedCourses";
import Hero from "@/components/home/Hero";
import InstructorInvitation from "@/components/home/InstructorInvitation";
import PlatformAdvantages from "@/components/home/PlatformAdvantages";
import TokenExchange from "@/components/home/TokenExchange";

// 首页主体内容，不含全局布局元素
export default function HomeView() {
  return (
    <main className="pt-32">
      {/* 留出固定头部的高度 */}
      <Hero />
      <PlatformAdvantages />
      <FeaturedCourses />
      <InstructorInvitation />
      <TokenExchange />
    </main>
  );
}
