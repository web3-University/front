// apps/web/src/components/layout/Header.tsx
"use client";

import { useAuth, WalletButton } from "@web3-university/uni-wallet-lib";
import clsx from "clsx";
import { Menu, X } from "lucide-react"; // 需要安装: pnpm add lucide-react
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { MAIN_ROUTES } from "@/config/routes";
import { checkUserRegistered, registerUser } from "@/lib/api/user";
import { Link, usePathname, useRouter } from "@/navigation";
import { useNavDrawer } from "@/state/ui/navDrawer"; // 新增

function isRouteActive(href: string, pathname: string, aliases: string[] = []) {
  if (pathname === href) return true;
  if (aliases.includes(pathname)) return true;
  if (href !== "/" && pathname.startsWith(href)) return true;
  return false;
}

export default function Header() {
  const { isOpen, toggle, close } = useNavDrawer();
  const tHeader = useTranslations("header");
  const tNav = useTranslations("navigation");
  const pathname = usePathname();
  const { isAuthenticated, address } = useAuth();
  const hasRegistered = useRef(false);
  const router = useRouter();

  useEffect(() => {
    console.log("[Header] render", {
      pathname,
      brand: tHeader("logo.brand"),
    });
  }, [pathname, tHeader]);

  // 监听钱包连接状态，连接后自动注册用户
  useEffect(() => {
    const handleUserRegistration = async () => {
      if (!isAuthenticated || !address || hasRegistered.current) return;
      hasRegistered.current = true;

      try {
        const { data: isRegistered } = await checkUserRegistered(address);
        if (isRegistered) {
          return;
        }

        const registrationData = {
          walletAddress: address,
          username: `user_${address.slice(0, 8)}`,
          email: `${address.slice(0, 8)}@web3university.com`,
        };

        await registerUser(registrationData);
        console.log("用户注册成功");
      } catch (error) {
        console.error("检测或注册用户失败:", error);
        hasRegistered.current = false;
      }
    };

    handleUserRegistration();
  }, [isAuthenticated, address]);

  // 当地址变化时重置注册状态
  useEffect(() => {
    hasRegistered.current = false;
  }, [address]);

  // 路由变化时关闭移动端菜单
  useEffect(() => {
    close();
  }, [pathname, close]);

  const routeToProfile = () => {
    router.push("/profile");
  };

  return (
    <>
      {/* 桌面端 Header */}
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 text-[#2B2558]">
        <div className="mt-4 flex h-14 w-full max-w-[1280px] items-center justify-between rounded-2xl bg-white/85 px-4 backdrop-blur-xl shadow-[0_24px_60px_rgba(154,161,255,0.18)] ring-1 ring-white/60 md:mt-6 md:h-16 md:px-6">
          {/* Logo - 响应式调整 */}
          <Link
            href="/home"
            className="flex items-center gap-2 text-inherit md:gap-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FFB347] to-[#FF6B9A] text-xs font-semibold text-white shadow-lg md:h-10 md:w-10 md:rounded-xl md:text-sm">
              WEB
            </div>
            <div className="hidden leading-tight sm:block">
              <div className="text-sm font-semibold">
                {tHeader("logo.brand")}
              </div>
              <div className="text-[11px] text-[#6F6B93]">
                {tHeader("logo.tagline")}
              </div>
            </div>
          </Link>

          {/* 桌面端导航 - 大屏幕显示 */}
          <nav className="hidden items-center gap-2 lg:flex">
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
                  {tNav(route.labelKey)}
                </Link>
              );
            })}
          </nav>

          {/* 右侧按钮组 */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* 钱包按钮 - 响应式调整 */}
            <div className="hidden sm:block">
              <WalletButton
                label={tHeader("walletButton.desktop")}
                showBalance
                showChainName
                onOpenProfile={routeToProfile}
              />
            </div>

            {/* 移动端简化版钱包按钮 */}
            <div className="sm:hidden">
              <WalletButton
                label={tHeader("walletButton.mobile")}
                showBalance={false}
                showChainName={false}
                onOpenProfile={routeToProfile}
              />
            </div>

            {/* 移动端菜单按钮 */}
            <button
              onClick={toggle}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#2B2558] transition-colors hover:bg-[#F6F6FF] lg:hidden"
              aria-label="菜单"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* 移动端菜单 - 全屏抽屉 */}
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-white transition-transform duration-300 lg:hidden",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* 顶部占位，避免被 Header 遮挡 */}
        <div className="h-20" />

        {/* 菜单内容 */}
        <nav className="flex flex-col gap-2 px-6 py-4">
          {MAIN_ROUTES.map((route) => {
            const active = isRouteActive(route.href, pathname, route.aliases);
            return (
              <Link
                key={route.href}
                href={route.href}
                onClick={close}
                className={clsx(
                  "rounded-xl px-4 py-3 text-base font-medium transition-colors",
                  active
                    ? "bg-[#ECEBFF] text-[#312A73] shadow-sm"
                    : "text-[#6A6D94] hover:bg-[#F6F6FF]",
                )}
              >
                {tNav(route.labelKey)}
              </Link>
            );
          })}
        </nav>

        {/* 底部信息 */}
        <div className="absolute bottom-6 left-6 right-6 rounded-xl bg-gradient-to-br from-[#FFB347]/10 to-[#FF6B9A]/10 p-4">
          <div className="text-sm font-semibold text-[#2B2558]">
            {tHeader("logo.brand")}
          </div>
          <div className="text-xs text-[#6F6B93]">
            {tHeader("logo.tagline")}
          </div>
        </div>
      </div>

      {/* 遮罩层 */}
      {isOpen && (
        <button
          type="button"
          aria-label="关闭导航菜单"
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={close}
        />
      )}
    </>
  );
}
