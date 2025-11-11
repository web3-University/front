"use client";
import AuthConfigWrapper from "./auth-config-wrapper";
import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import BottomNav from "@/components/layout/BottomNav";
import Header from "@/components/layout/Header";
import LanguageSwitch from "@/components/layout/LanguageSwitch";
import { usePathname } from "@/navigation";
import { Provider as JotaiProvider } from "jotai";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export default function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/"; // 👈 添加默认值
  const [isMobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const toggleMobileNav = useCallback(
    () => setMobileNavOpen((open) => !open),
    [],
  );
  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);

  if (!projectId) {
    console.warn(
      "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID 未配置，钱包功能可能无法使用",
    );
  }

  return (
    <JotaiProvider>
      <AuthConfigWrapper>
        <Header
          isMobileNavOpen={isMobileNavOpen}
          onToggleMobileNav={toggleMobileNav}
          onCloseMobileNav={closeMobileNav}
        />
        <ErrorBoundary fallback={null}>
          <LanguageSwitch />
        </ErrorBoundary>

        <main className="min-h-screen pt-20 pb-20 md:pt-24 md:pb-8 lg:pb-8">
          <ErrorBoundary
            key={pathname} // 👈 现在 pathname 不会是 undefined
            fallback={
              <div className="mx-auto max-w-[960px] rounded-2xl bg-white/80 p-8 text-center text-[#2B2558] shadow-[0_24px_60px_rgba(154,161,255,0.12)] ring-1 ring-white/50">
                <h2 className="text-xl font-semibold">内容暂时不可用</h2>
                <p className="mt-2 text-sm text-[#6A6D94]">
                  我们已记录这个错误，请稍后再试。
                </p>
              </div>
            }
          >
            {children}
          </ErrorBoundary>
        </main>

        <BottomNav />
      </AuthConfigWrapper>
    </JotaiProvider>
  );
}
