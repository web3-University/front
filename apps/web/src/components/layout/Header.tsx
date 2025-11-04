// apps/web/src/components/layout/Header.tsx
"use client";

import { useAuth, WalletButton } from "@web3-university/uni-wallet-lib";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react"; // 需要安装: pnpm add lucide-react

import { MAIN_ROUTES } from "@/config/routes";
import { checkUserRegistered, registerUser } from "@/lib/api/user";
import { LOCALE_LABELS, SUPPORTED_LOCALES, type Locale } from "@/i18n/config";
import { useChangeLocale, useTranslation } from "@/i18n/hooks";

function isRouteActive(href: string, pathname: string, aliases: string[] = []) {
  if (pathname === href) return true;
  if (aliases.includes(pathname)) return true;
  if (href !== "/" && pathname.startsWith(href)) return true;
  return false;
}

export default function Header() {
  const pathname = usePathname();
  const { isAuthenticated, address } = useAuth();
  const hasRegistered = useRef(false);
  const router = useRouter();
  const t = useTranslation();
  const [setLocale, currentLocale] = useChangeLocale();

  // 移动端菜单状态
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const routeToProfile = () => {
    router.push("/profile");
  };

  const handleLocaleChange = (nextLocale: Locale) => {
    setLocale(nextLocale);
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
              <div className="text-sm font-semibold">{t("common.appName")}</div>
              <div className="text-[11px] text-[#6F6B93]">
                {t("common.appTagline")}
              </div>
            </div>
          </Link>

          {/* 桌面端导航 - 大屏幕显示 */}
          <nav className="hidden items-center gap-2 lg:flex lg:flex-nowrap lg:overflow-x-auto">
            {MAIN_ROUTES.map((route) => {
              const active = isRouteActive(route.href, pathname, route.aliases);
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={clsx(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    "inline-flex items-center max-w-[160px] flex-shrink-0 whitespace-nowrap", // 添加 whitespace-nowrap
                    active
                      ? "bg-[#ECEBFF] text-[#312A73] shadow-sm"
                      : "text-[#6A6D94] hover:bg-[#F6F6FF]",
                  )}
                  title={t(route.labelKey)}
                >
                  <span className="truncate">{t(route.labelKey)}</span>
                </Link>
              );
            })}
          </nav>

          {/* 右侧按钮组 */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* 桌面端语言切换 */}
            <div className="hidden items-center sm:flex">
              <label htmlFor="desktop-language-select" className="sr-only">
                {t("common.language")}
              </label>
              <select
                id="desktop-language-select"
                value={currentLocale}
                onChange={(event) =>
                  handleLocaleChange(event.target.value as Locale)
                }
                className="rounded-full border border-[#E8E7FF] bg-white px-3 py-1 text-sm font-medium text-[#2B2558] shadow-sm transition-colors hover:border-[#D1D0FF] focus:outline-none focus:ring-2 focus:ring-[#B5B3FF]"
              >
                {SUPPORTED_LOCALES.map((locale) => (
                  <option key={locale} value={locale}>
                    {LOCALE_LABELS[locale]}
                  </option>
                ))}
              </select>
            </div>

            {/* 钱包按钮 - 响应式调整 */}
            <div className="hidden sm:block">
              <WalletButton
                label={t("common.connectWallet")}
                showBalance
                showChainName
                onOpenProfile={routeToProfile}
              />
            </div>

            {/* 移动端简化版钱包按钮 */}
            <div className="sm:hidden">
              <WalletButton
                label={t("common.connectShort")}
                showBalance={false}
                showChainName={false}
                onOpenProfile={routeToProfile}
              />
            </div>

            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#2B2558] transition-colors hover:bg-[#F6F6FF] lg:hidden"
              aria-label={t("common.menu")}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* 移动端菜单 - 全屏抽屉 */}
      <div
        className={clsx(
          "fixed inset-0 z-40 flex h-full flex-col bg-white transition-transform duration-300 lg:hidden",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* 顶部占位，避免被 Header 遮挡 */}
        <div className="h-20" />

        {/* 菜单内容 */}
        {/* 桌面端导航 - 大屏幕显示 */}
        <nav className="hidden items-center gap-2 lg:flex lg:flex-nowrap lg:overflow-x-auto">
          {MAIN_ROUTES.map((route) => {
            const active = isRouteActive(route.href, pathname, route.aliases);
            return (
              <Link
                key={route.href}
                href={route.href}
                className={clsx(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  "inline-flex items-center max-w-[160px] flex-shrink-0 flex-nowrap", // 添加 flex-shrink-0
                  active
                    ? "bg-[#ECEBFF] text-[#312A73] shadow-sm"
                    : "text-[#6A6D94] hover:bg-[#F6F6FF]",
                )}
                title={t(route.labelKey)}
              >
                <span className="truncate">{t(route.labelKey)}</span>
              </Link>
            );
          })}
        </nav>

        {/* 语言切换入口 */}
        <div className="mx-6 mb-4 flex flex-col gap-3 rounded-xl border border-[#ECEBFF] bg-white/80 p-4 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#6A6D94]">
            {t("common.language")}
          </span>
          <select
            id="mobile-language-select"
            value={currentLocale}
            onChange={(event) => {
              handleLocaleChange(event.target.value as Locale);
              setIsMobileMenuOpen(false);
            }}
            className="rounded-xl border border-[#E8E7FF] bg-white px-4 py-2 text-sm font-medium text-[#2B2558] focus:outline-none focus:ring-2 focus:ring-[#B5B3FF]"
            aria-label={t("common.language")}
          >
            {SUPPORTED_LOCALES.map((locale) => (
              <option key={locale} value={locale}>
                {LOCALE_LABELS[locale]}
              </option>
            ))}
          </select>
        </div>

        {/* 底部信息 */}
        <div className="mx-6 mb-6 mt-auto rounded-xl bg-gradient-to-br from-[#FFB347]/10 to-[#FF6B9A]/10 p-4">
          <div className="text-sm font-semibold text-[#2B2558]">
            {t("common.appName")}
          </div>
          <div className="text-xs text-[#6F6B93]">{t("common.appTagline")}</div>
        </div>
      </div>

      {/* 遮罩层 */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
