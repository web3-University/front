import Hero from "@/components/dao/Hero";
import Stats from "@/components/dao/Stats";
import NewProposal from "@/components/dao/NewProposal";
import ProposalsList from "@/components/dao/ProposalsList";

// 首页主体内容，不含全局布局元素
export default function DaoView() {
  return (
    <main className="pt-32 max-w-7xl mx-auto px-6 py-16">
      {/* 留出固定头部的高度 */}
      {/* Hero Section */}
      <Hero />
      {/* Stats */}
      <Stats />
      {/* Create Proposal Button */}
      <NewProposal />
      {/* Tabs & Proposals List */}
      <ProposalsList />
    </main>
  );
}
