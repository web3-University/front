// apps/web/src/components/layout/BottomNav.tsx
"use client";

import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  LayoutGrid,
  Menu,
  ShieldEllipsis,
  ShoppingBag,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { MAIN_ROUTES } from "@/config/routes";
import { Link, usePathname } from "@/navigation";

type BottomNavProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const ROUTE_ICONS: Record<string, LucideIcon> = {
  home: LayoutGrid,
  market: ShoppingBag,
  dao: ShieldEllipsis,
  outsource: BriefcaseBusiness,
};

export default function BottomNav({ isOpen, onOpenChange }: BottomNavProps) {
  const tNav = useTranslations("navigation");
  const tHeader = useTranslations("header");
  const pathname = usePathname();

  useEffect(() => {
    onOpenChange(false);
  }, [pathname, onOpenChange]);

  return (
    <div className="lg:hidden">
      <div className="fixed left-3 top-1/2 z-50 -translate-y-1/2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(!isOpen)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "收起导航菜单" : "打开导航菜单"}
            className={clsx(
              "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFB347] to-[#FF6B9A] text-white shadow-[0_14px_30px_rgba(255,123,154,0.45)] transition-transform duration-300",
              isOpen ? "scale-95" : "scale-100",
            )}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <nav
            aria-label="主导航"
            className={clsx(
              "flex flex-col gap-2 transition-all duration-300 ease-out",
              isOpen
                ? "translate-x-0 opacity-100"
                : "-translate-x-4 opacity-0 pointer-events-none",
            )}
          >
            <div className="rounded-2xl bg-white/80 px-4 py-3 text-xs text-[#5F6094] shadow-[0_20px_40px_rgba(33,45,96,0.16)] backdrop-blur">
              <p className="font-semibold text-[#2B2558]">
                {tHeader("logo.brand")}
              </p>
              <p>{tHeader("logo.tagline")}</p>
            </div>
            {MAIN_ROUTES.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href);
              const Icon = ROUTE_ICONS[item.labelKey] ?? LayoutGrid;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onOpenChange(false)}
                  className={clsx(
                    "group flex items-center gap-3 rounded-r-3xl border-l-4 border-transparent bg-white/90 px-4 py-2 text-sm font-medium text-[#6A6D94] shadow-[0_16px_26px_rgba(34,46,96,0.12)] transition-all duration-200 backdrop-blur",
                    isActive
                      ? "border-[#FF6B9A] text-[#2B2558]"
                      : "hover:border-[#FFB347] hover:text-[#2B2558]",
                  )}
                >
                  <span
                    className={clsx(
                      "flex h-9 w-9 items-center justify-center rounded-2xl border border-[#E2E0FF] bg-white transition-colors duration-200",
                      isActive
                        ? "border-transparent bg-gradient-to-br from-[#FFB347] to-[#FF6B9A] text-white"
                        : "group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-[#FFB347]/80 group-hover:to-[#FF6B9A]/80 group-hover:text-white",
                    )}
                  >
                    <Icon size={18} />
                  </span>
                  <span>{tNav(item.labelKey)}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
