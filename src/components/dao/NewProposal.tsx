"use client";

import { Button } from "@/components/ui/button";

const categories = {
  proposal: "提交新提案",
  dispute: "提交争议",
  history: "历史记录",
} as const;

interface NewProposalProps {
  type: keyof typeof categories;
  onClick: () => void;
}
export default function NewProposal({ type, onClick }: NewProposalProps) {
  return type === "history" ? (
    ""
  ) : (
    <section
      className="relative"
      style={{ display: "flex", justifyContent: "flex-end" }}
    >
      <div className="mb-10">
        <Button
          onClick={onClick}
          variant="primary"
          size="lg"
          className="w-full from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 hover:scale-[1.02]"
        >
          + {categories[type]}
        </Button>
      </div>
    </section>
  );
}
