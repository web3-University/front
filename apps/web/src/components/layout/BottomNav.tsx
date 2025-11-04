// apps/web/src/components/layout/BottomNav.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { Menu, X } from "lucide-react";

import { MAIN_ROUTES } from "@/config/routes";
import { useTranslation } from "@/i18n/hooks";

export default function BottomNav() {
  const pathname = usePathname();
  const t = useTranslation("mobileNav");
  const tRoutes = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        aria-label={t("openNavigation")}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#8A71FF] to-[#FF9D6B] text-white shadow-xl shadow-[#8A71FF]/30 transition-transform hover:scale-105 active:scale-95 xl:hidden"
      >
        <Menu strokeWidth={2.5} size={22} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex xl:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative h-full w-[78%] max-w-xs rounded-tr-3xl bg-white pb-safe shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#F1F1FF] px-6 pt-9 pb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-[#8A71FF]">
                  {t("label")}
                </p>
                <h2 className="mt-2 text-lg font-semibold text-[#2B2558]">
                  {t("title")}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={t("closeNavigation")}
                className="rounded-full bg-[#F5F5FF] p-2 text-[#6A6D94] transition hover:text-[#2B2558]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
              <nav className="flex flex-col gap-2">
                {MAIN_ROUTES.map((route) => {
                  const isActive =
                    pathname === route.href || pathname.startsWith(route.href);
                  return (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={clsx(
                        "flex items-center justify-between rounded-2xl px-4 py-3 text-base font-medium transition-colors",
                        isActive
                          ? "bg-[#ECEBFF] text-[#312A73]"
                          : "text-[#2B2558] hover:bg-[#F6F6FF]",
                      )}
                    >
                      <span>{tRoutes(route.labelKey)}</span>
                      <span className="text-xs font-semibold text-[#8A71FF]">
                        {isActive ? t("active") : "›"}
                      </span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 space-y-3 rounded-2xl border border-[#ECEBFF] bg-[#F9F9FF] p-4">
                <p className="text-xs uppercase tracking-wide text-[#6A6D94]">
                  {t("summary.heading")}
                </p>
                <p className="text-sm text-[#2B2558]">{t("summary.body")}</p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
