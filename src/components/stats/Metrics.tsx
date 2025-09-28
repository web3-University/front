import type { StatItem } from "@/lib/types";
import { Metric } from "./Metric";

export function Metrics({ items }: { items: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
      {items.map((it) => (
        <Metric key={it.label} {...it} />
      ))}
    </div>
  );
}
