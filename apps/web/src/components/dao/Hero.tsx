"use client";

import { useTranslation } from "@/i18n/hooks";

export default function Hero() {
  const t = useTranslation("daoHero");

  return (
    <section className="relative">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-6">
          <span className="text-orange-300 font-medium">{t("badge")}</span>
        </div>
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-orange-300 via-pink-300 to-purple-400 bg-clip-text text-transparent">
          {t("title")}
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          {t("description")}
        </p>
      </div>
    </section>
  );
}
