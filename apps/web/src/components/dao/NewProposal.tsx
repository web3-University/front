"use client";

import { Button } from "@/components/ui/button";

export default function NewProposal() {
  return (
    <section className="relative">
      <div className="mb-10">
        <Button
          variant="primary"
          size="lg"
          className="w-full from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 hover:scale-[1.02]"
        >
          + 创建新提案
        </Button>
      </div>
    </section>
  );
}
