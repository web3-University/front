// apps/web/src/components/layout/Header.tsx
"use client";

import { useAuth, WalletButton } from "@web3-university/uni-wallet-lib";
import clsx from "clsx";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

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
  const tMobileNav = useTranslation("mobileNav");
  const [setLocale, currentLocale] = useChangeLocale();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    hasRegistered.current = false;
  }, [address]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const routeToProfile = () => {
    router.push("/profile");
  };

  const handleLocaleChange = (nextLocale: Locale) => {
    setLocale(nextLocale);
  };

  const desktopNav = (
    <nav className="hidden xl:flex flex-1 min-w-0 items-center justify-center gap-2 overflow-x-auto px-3">
      {MAIN_ROUTES.map((route) => {
        const active = isRouteActive(route.href, pathname, route.aliases);
        return (
          <Link
            key={route.href}
            href={route.href}
            className={clsx(
              "inline-flex flex-shrink-0 items-center rounded-full px-4 py-2 text-sm font-medium transition-colors",
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
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 text-[#2B2558] sm:px-4">
        <div className="mt-4 flex h-14 w-full max-w-[1280px] items-center rounded-2xl bg-white/85 px-4 backdrop-blur-xl shadow-[0_24px_60px_rgba(154,161,255,0.18)] ring-1 ring-white/60 md:mt-6 md:h-16 md:px-6">
          <Link
            href="/home"
            className="flex min-w-[160px] items-center gap-2 text-inherit sm:min-w-[180px] sm:gap-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FFB347] to-[#FF6B9A] text-xs font-semibold text-white shadow-lg sm:h-10 sm:w-10 sm:rounded-xl sm:text-sm">
              WEB
            </div>
            <div className="hidden flex-col leading-tight sm:flex">
              <span className="text-sm font-semibold">
                {t("common.appName")}
              </span>
              <span className="text-[11px] text-[#6F6B93] hidden xl:block">
                {t("common.appTagline")}
              </span>
            </div>
          </Link>

          {desktopNav}

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {/* 移动端语言切换 */}
            <div className="flex items-center xl:hidden">
              <label htmlFor="mobile-language-inline" className="sr-only">
                {t("common.language")}
              </label>
              <select
                id="mobile-language-inline"
                value={currentLocale}
                onChange={(event) =>
                  handleLocaleChange(event.target.value as Locale)
                }
                className="rounded-full border border-[#E8E7FF] bg-white px-2.5 py-1 text-xs font-medium text-[#2B2558] shadow-sm transition-colors hover:border-[#D1D0FF] focus:outline-none focus:ring-2 focus:ring-[#B5B3FF]"
              >
                {SUPPORTED_LOCALES.map((locale) => (
                  <option key={locale} value={locale}>
                    {LOCALE_LABELS[locale]}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden items-center xl:flex">
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

            <div className="hidden md:block">
              <WalletButton
                label={t("common.connectWallet")}
                showBalance
                showChainName
                onOpenProfile={routeToProfile}
              />
            </div>

            <div className="md:hidden">
              <WalletButton
                label={t("common.connectShort")}
                showBalance={false}
                showChainName={false}
                onOpenProfile={routeToProfile}
              />
            </div>

            <button
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#2B2558] transition-colors hover:bg-[#F6F6FF] xl:hidden"
              aria-label={t("common.menu")}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={clsx(
          "fixed inset-0 z-40 flex h-full flex-col bg-white transition-transform duration-300 xl:hidden",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="h-20" />
        <div className="flex-1 overflow-y-auto px-6 pb-8">
          <nav className="flex flex-col gap-2">
            {MAIN_ROUTES.map((route) => {
              const active = isRouteActive(route.href, pathname, route.aliases);
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={clsx(
                    "flex items-center justify-between rounded-2xl px-4 py-3 text-base font-medium transition-colors",
                    active
                      ? "bg-[#ECEBFF] text-[#312A73]"
                      : "text-[#2B2558] hover:bg-[#F6F6FF]",
                  )}
                  title={t(route.labelKey)}
                >
                  <span>{t(route.labelKey)}</span>
                  <span className="text-xs font-semibold text-[#8A71FF]">
                    {active ? tMobileNav("active") : "›"}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 space-y-4">
            <div className="flex flex-col gap-2 rounded-2xl border border-[#ECEBFF] bg-white/80 p-4 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#6A6D94]">
                {t("common.language")}
              </span>
              <select
                id="mobile-language-select"
                value={currentLocale}
                onChange={(event) =>
                  handleLocaleChange(event.target.value as Locale)
                }
                className="rounded-xl border border-[#E8E7FF] bg-white px-4 py-2 text-sm font-medium text-[#2B2558] focus:outline-none focus:ring-2 focus:ring-[#B5B3FF]"
              >
                {SUPPORTED_LOCALES.map((locale) => (
                  <option key={locale} value={locale}>
                    {LOCALE_LABELS[locale]}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl bg-[#F6F6FF] px-4 py-3 text-sm text-[#2B2558] shadow-inner">
              <div className="font-semibold">{t("common.appName")}</div>
              <div className="text-xs text-[#6F6B93]">
                {t("common.appTagline")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
