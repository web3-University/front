import CourseList from "@/components/market/CourseList";
import { getServerTranslator } from "@/i18n/server";

export default async function MarketPage() {
  const t = await getServerTranslator("marketPage");

  return (
    <div className="min-h-screen text-white">
      {/* 主要内容 */}
      <main className="container mx-auto max-w-[1200px] px-4 pt-32">
        {/* 标题部分 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[#2B2558]">
            {t("title")}
          </h1>
          <p className="text-gray-400">{t("subtitle")}</p>
        </div>

        {/* 课程卡片列表（包含筛选功能）*/}
        <CourseList />
      </main>
    </div>
  );
}
