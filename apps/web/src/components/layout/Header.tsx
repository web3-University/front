"use client";

import { useAuth, WalletButton } from "@web3-university/uni-wallet-lib";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { MAIN_ROUTES } from "@/config/routes";
import { registerUser } from "@/lib/api/user";

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

  // 监听钱包连接状态，连接后自动注册用户
  useEffect(() => {
    const handleUserRegistration = async () => {
      if (isAuthenticated && address && !hasRegistered.current) {
        hasRegistered.current = true;

        try {
          // 调用用户注册接口
          const registrationData = {
            walletAddress: address,
            username: `user_${address.slice(0, 8)}`, // 使用地址前8位作为默认用户名
            email: `${address.slice(0, 8)}@web3university.com`, // 生成默认邮箱
            avatar:
              "https://ipfs.io/ipfs/QmYx6GsYAKnNzZ9A6NvEKV9nf1VaDzJrqDR23Y8YSkebLU", // 默认头像
            bio: "Web3 学习者",
            specializations: ["blockchain", "web3"],
          };

          await registerUser(registrationData);
          console.log("用户注册成功");
        } catch (error) {
          console.error("用户注册失败:", error);
          // 注册失败时重置标志，允许重试
          hasRegistered.current = false;
        }
      }
    };

    handleUserRegistration();
  }, [isAuthenticated, address]);

  // 当地址变化时重置注册状态
  useEffect(() => {
    hasRegistered.current = false;
  }, [address]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 text-[#2B2558]">
      <div className="mt-6 flex h-16 w-full max-w-[1280px] items-center justify-between rounded-2xl bg-white/85 px-6 backdrop-blur-xl shadow-[0_24px_60px_rgba(154,161,255,0.18)] ring-1 ring-white/60">
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

        <div className="flex items-center gap-3">
          <WalletButton label="连接钱包" showBalance showChainName />
        </div>
      </div>
    </header>
  );
}
