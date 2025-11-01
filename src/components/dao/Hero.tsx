"use client";

export default function Hero() {
  return (
    <section className="relative">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-6">
          <span className="text-orange-300 font-medium">🔥 Web3 教育革命</span>
        </div>
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-orange-300 via-pink-300 to-purple-400 bg-clip-text text-transparent">
          社区治理
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          持有代币的社区成员可以提交提案并投票，共同决定平台的发展方向、课程规则和奖励分配机制
        </p>
      </div>
    </section>
  );
}
