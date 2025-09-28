"use client";

import clsx from "clsx";
import { Bell, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { MAIN_ROUTES } from "@/config/routes";

function isRouteActive(href: string, pathname: string, aliases: string[] = []) {
  if (pathname === href) return true;
  if (aliases.includes(pathname)) return true;
  if (href !== "/" && pathname.startsWith(href)) return true;
  return false;
}

// 头部导航栏组件
// TODO: 假数据 待补充钱包逻辑
export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 text-[#2B2558]">
      {/* 半透明导航条，置中展示 */}
      <div className="mt-6 flex h-16 w-full max-w-[1280px] items-center justify-between rounded-2xl bg-white/80 px-6 backdrop-blur-xl shadow-[0_24px_60px_rgba(154,161,255,0.18)] ring-1 ring-white/60">
        <Link href="/home" className="flex items-center gap-3 text-inherit">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFB347] to-[#FF6B9A] text-sm font-semibold text-white shadow-lg">
            WEB
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">WEB3大学</div>
            <div className="text-[11px] text-[#6F6B93]">去中心化教育平台</div>
          </div>
        </Link>

        {/* 中间导航 */}
        <nav className="hidden items-center gap-2 md:flex">
          {MAIN_ROUTES.map((route) => {
            const active = isRouteActive(route.href, pathname, route.aliases);
            return (
              <Link
                key={route.href}
                href={route.href}
                className={clsx(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-[#ECEBFF] text-[#312A73] shadow-sm"
                    : "text-[#6A6D94] hover:bg-[#F6F6FF]",
                )}
              >
                {route.label}
              </Link>
            );
          })}
        </nav>

        {/* 右侧：余额、钱包、通知、头像（静态占位数值） */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FFE7C5] to-[#FFEAD4] px-3 py-1 text-sm font-medium text-[#5A4B23] shadow-sm ring-1 ring-white/60">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#FF9F50] to-[#FF6C70] text-xs font-bold text-white">
              YD
            </span>
            <span>25,680</span>
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-white px-3 py-1 text-sm text-[#66608D] shadow-sm ring-1 ring-[#E6E4FA] lg:flex">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span>0x1234...5678</span>
          </div>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#6A6D94] shadow-sm ring-1 ring-[#E7E5FB]">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#FF5A5F] px-1 text-[10px] font-semibold text-white">
              3
            </span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#6A6D94] shadow-sm ring-1 ring-[#E7E5FB]">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
