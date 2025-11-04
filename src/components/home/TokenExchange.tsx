"use client";

import {
  useSimpleYDToken,
  useWalletInfo,
} from "@web3-university/uni-wallet-lib";
import { ArrowRight, Coins, Shield, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, useMemo, useState } from "react";
import { formatUnits } from "viem";
import { Button } from "@/components/ui/button";

const RATE = 4000; // 1 ETH = 4000 YD（测试环境兑换比例）

export default function TokenExchange() {
  const t = useTranslations("home.tokenExchange");
  const { isConnected } = useWalletInfo();
  const tokenAddress = useMemo(() => {
    const addr = process.env.NEXT_PUBLIC_YD_TOKEN_ADDRESS;
    return addr ? (addr as `0x${string}`) : undefined;
  }, []);

  const {
    balance: ydBalance,
    exchangeETHForTokens,
    refetchBalance,
  } = useSimpleYDToken({ address: tokenAddress });

  const [ethAmount, setEthAmount] = useState("0.1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const ydAmount = useMemo(() => Number(ethAmount || 0) * RATE, [ethAmount]);

  const ydBalanceLabel = useMemo(() => {
    if (!ydBalance) return "0";
    return Number(formatUnits(ydBalance, 18)).toFixed(4);
  }, [ydBalance]);

  const handleEthChange = (value: string) => {
    if (value === "" || /^\d*(\.\d*)?$/.test(value)) {
      setEthAmount(value);
      setError(null);
      setSuccess(null);
    }
  };

  const handleExchange = async () => {
    if (!isConnected) {
      setError(t("errors.connectWallet"));
      return;
    }

    if (!ethAmount || Number(ethAmount) <= 0) {
      setError(t("errors.invalidAmount"));
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      await exchangeETHForTokens(ethAmount);
      await refetchBalance();

      setSuccess(t("success", { amount: ydAmount.toFixed(2) }));
      setEthAmount("");
    } catch (err) {
      const message = err instanceof Error ? err.message : t("errors.generic");
      setError(message);
      console.error("exchangeETHForTokens error", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-6 py-24">
        <header className="mb-12 text-center md:text-left">
          <h2 className="text-3xl font-bold text-[#2B2558] md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-base text-[#6A6D94]">{t("subtitle")}</p>
        </header>

        <div className="grid gap-12 md:grid-cols-2">
          <div className="rounded-3xl bg-gradient-to-br from-[#F7F9FF] via-[#E6EEFF] to-white p-8 text-[#2B2558] shadow-[0_20px_60px_rgba(148,160,255,0.28)] ring-1 ring-[#E4E9FF]">
            <header className="flex items-center justify-between text-sm font-medium text-[#6A6D94]">
              <h3 className="text-2xl font-semibold text-[#4D6BFF]">
                {t("formTitle")}
              </h3>
              <span className="font-semibold text-[#4D6BFF]">
                {t("currentBalance", { balance: ydBalanceLabel })}
              </span>
            </header>

            <div className="mt-8 space-y-6 rounded-2xl bg-white/80 p-6 ring-1 ring-white/60">
              <div className="space-y-2">
                <span className="text-sm text-[#6A6D94]">{t("payLabel")}</span>
                <div className="flex items-center gap-3 rounded-xl bg-[#F2F4FF] px-4 py-3 ring-1 ring-[#DBE2FF]">
                  <input
                    value={ethAmount}
                    onChange={(event) => handleEthChange(event.target.value)}
                    className="w-full bg-transparent text-lg font-semibold text-[#2B2558] outline-none"
                    inputMode="decimal"
                    placeholder="0.0"
                  />
                  <span className="text-sm font-semibold text-[#8B90C3]">
                    ETH
                  </span>
                </div>
              </div>

              <ArrowRight className="mx-auto h-5 w-5 text-[#C1C5EF]" />

              <div className="space-y-2">
                <span className="text-sm text-[#6A6D94]">
                  {t("receiveLabel")}
                </span>
                <div className="flex items-center gap-3 rounded-xl bg-[#F2F4FF] px-4 py-3 ring-1 ring-[#B1FF5A]/35">
                  <input
                    value={ydAmount ? ydAmount.toFixed(2) : "0"}
                    readOnly
                    className="w-full bg-transparent text-lg font-semibold text-[#2B2558] outline-none"
                  />
                  <span className="text-sm font-semibold text-[#8BC34A]">
                    YD
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#8B90C3]">
                {t("exchangeRate", { rate: RATE })}
              </p>

              <Button
                variant="primary"
                fullWidth
                onClick={handleExchange}
                className="bg-gradient-to-r from-[#FF9F6B] via-[#FFCD6B] to-[#73FF6C] text-[#1C1C1C] hover:brightness-95"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("exchanging") : t("exchangeNow")}
              </Button>

              {error ? (
                <p className="text-xs text-red-500">{error}</p>
              ) : success ? (
                <p className="text-xs text-[#4D6BFF]">{success}</p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col justify-center gap-8 text-left text-[#2B2558]">
            <header>
              {/* <p className="inline-flex items-center gap-2 rounded-full bg-[#E4ECFF]/80 px-4 py-1 text-xs uppercase tracking-[0.18em] text-[#4D6BFF]">
                欢迎来到兑换中心
              </p> */}
              <h3 className="mt-4 text-3xl font-bold md:text-4xl">
                {t("introTitle")}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[#6A6D94]">
                {t("introDescription")}
              </p>
            </header>

            <div className="grid gap-4 sm:grid-cols-3">
              <ExchangeStat
                icon={<Shield className="h-5 w-5" />}
                label={t("stats.security.label")}
                value={t("stats.security.value")}
              />
              <ExchangeStat
                icon={<Coins className="h-5 w-5" />}
                label={t("stats.settlement.label")}
                value={t("stats.settlement.value")}
              />
              <ExchangeStat
                icon={<Users className="h-5 w-5" />}
                label={t("stats.activity.label")}
                value={t("stats.activity.value")}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(173,215,255,0.6),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(210,189,255,0.55),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(144,194,255,0.7),rgba(195,166,255,0.7))]" />
      </div>
    </section>
  );
}

function ExchangeStat({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-2xl bg-white px-4 py-4 text-[#2B2558] shadow-[0_15px_40px_rgba(161,174,255,0.24)] ring-1 ring-[#E3E8FF]">
      <div className="inline-flex items-center gap-2 text-sm font-medium text-[#4D6BFF]">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-xl font-semibold">{value}</span>
    </div>
  );
}
