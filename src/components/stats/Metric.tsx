export function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-3xl bg-white px-6 py-8 text-left shadow-[0_25px_60px_rgba(156,166,255,0.18)] transition will-change-transform hover:-translate-y-[6px]">
      <div className="text-3xl font-semibold text-[#2B2558]">{value}</div>
      <div className="mt-2 text-sm font-medium uppercase tracking-[0.08em] text-[#8B8EB5]">
        {label}
      </div>
    </div>
  );
}
