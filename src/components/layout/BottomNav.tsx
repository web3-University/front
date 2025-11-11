import clsx from "clsx";
import { Menu, X } from "lucide-react";
import { useNavDrawer } from "@/state/ui/navDrawer";

export default function BottomNav() {
  const { isOpen, toggle } = useNavDrawer();

  return (
    <div className="fixed left-3 top-1/2 z-50 -translate-y-1/2 lg:hidden">
      <button
        type="button"
        aria-label={isOpen ? "收起导航菜单" : "展开导航菜单"}
        aria-expanded={isOpen}
        onClick={toggle}
        className={clsx(
          "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFB347] to-[#FF6B9A] text-white shadow-[0_14px_30px_rgba(255,123,154,0.45)] transition-transform",
          isOpen ? "scale-95" : "scale-100",
        )}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
    </div>
  );
}
