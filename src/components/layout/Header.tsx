"use client";

import clsx from "clsx";
import { AlertCircle, Bell, Copy, LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { useWallet, useWalletActions } from "@/components/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MAIN_ROUTES } from "@/config/routes";

function isRouteActive(href: string, pathname: string, aliases: string[] = []) {
  if (pathname === href) return true;
  if (aliases.includes(pathname)) return true;
  if (href !== "/" && pathname.startsWith(href)) return true;
  return false;
}

export default function Header() {
  const pathname = usePathname();
  const { address, chain, balance, balanceLoading, isConnected } = useWallet();
  const { openConnectModal, disconnect, isDisconnecting } = useWalletActions();

  const [walletOpen, setWalletOpen] = useState(false);
  const walletRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!walletOpen) return;

    const handleClick = (event: MouseEvent) => {
      if (
        walletRef.current &&
        event.target instanceof Node &&
        !walletRef.current.contains(event.target)
      ) {
        setWalletOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [walletOpen]);

  const formattedAddress = useMemo(() => {
    if (!address) return "未连接";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  const balanceLabel = useMemo(() => {
    if (!balance) return "--";
    const value = Number(balance.formatted);
    if (Number.isNaN(value)) return balance.formatted;
    return value >= 1 ? value.toFixed(2) : value.toFixed(4);
  }, [balance]);

  const nativeSymbol =
    balance?.symbol ?? chain?.nativeCurrency?.symbol ?? "ETH";

  const handleWalletToggle = () => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
    setWalletOpen((prev) => !prev);
  };

  const copyAddress = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
    } catch (error) {
      console.error("复制钱包地址失败", error);
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 text-[#2B2558]">
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

        <div className="flex items-center gap-3" ref={walletRef}>
          {isConnected ? (
            <>
              {balanceLoading ? (
                <Skeleton className="h-10 w-28 rounded-full" />
              ) : (
                <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FFE7C5] to-[#FFEAD4] px-3 py-1 text-sm font-medium text-[#5A4B23] shadow-sm ring-1 ring-white/60">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#FF9F50] to-[#FF6C70] text-xs font-bold text-white">
                    {nativeSymbol}
                  </span>
                  <span>{balanceLabel}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleWalletToggle}
                className="hidden items-center gap-2 rounded-full bg-white px-3 py-1 text-sm text-[#66608D] shadow-sm ring-1 ring-[#E6E4FA] transition hover:-translate-y-[1px] lg:flex"
              >
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="font-medium text-[#2B2558]">
                  {chain?.name ?? "未知网络"}
                </span>
                <span className="text-xs text-[#8B8EB5]">
                  {formattedAddress}
                </span>
              </button>

              <div className="relative">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#6A6D94] shadow-sm ring-1 ring-[#E7E5FB]">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#FF5A5F] px-1 text-[10px] font-semibold text-white">
                    3
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleWalletToggle}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#6A6D94] shadow-sm ring-1 ring-[#E7E5FB] transition hover:-translate-y-[1px]"
              >
                <User className="h-5 w-5" />
              </button>

              {walletOpen ? (
                <div className="absolute right-0 top-14 w-72 rounded-2xl bg-white p-4 text-sm text-[#2B2558] shadow-[0_24px_60px_rgba(154,161,255,0.18)] ring-1 ring-[#ECEBFF]">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-[0.08em] text-[#8B8EB5]">
                        网络
                      </div>
                      <div className="mt-1 font-semibold">
                        {chain?.name ?? "未知网络"}
                      </div>
                    </div>
                    <div className="rounded-full bg-[#F4F4FF] px-3 py-1 text-xs font-medium text-[#5F6094]">
                      ID {chain?.id ?? "?"}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-xs uppercase tracking-[0.08em] text-[#8B8EB5]">
                      地址
                    </div>
                    <div className="mt-1 flex items-center justify-between rounded-xl bg-[#F8F8FF] px-3 py-2">
                      <span className="font-mono text-sm text-[#2B2558]">
                        {formattedAddress}
                      </span>
                      <button
                        type="button"
                        onClick={copyAddress}
                        className="rounded-full p-1 text-[#6A6D94] transition hover:bg-white"
                        aria-label="复制地址"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl bg-[#F9F9FF] px-3 py-3">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.08em] text-[#8B8EB5]">
                      <AlertCircle className="h-4 w-4" />
                      当前余额
                    </div>
                    <div className="mt-2 text-lg font-semibold">
                      {balanceLabel} {nativeSymbol}
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    fullWidth
                    className="mt-4"
                    onClick={async () => {
                      await disconnect();
                      setWalletOpen(false);
                    }}
                    loading={isDisconnecting}
                    disabled={isDisconnecting}
                    leftIcon={<LogOut className="h-4 w-4" />}
                  >
                    断开连接
                  </Button>
                </div>
              ) : null}
            </>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => openConnectModal?.()}
            >
              连接钱包
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
