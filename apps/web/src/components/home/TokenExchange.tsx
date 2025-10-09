"use client";

import { useState, type ReactNode } from "react";
import { ArrowRight, Coins, Shield, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useWallet } from "@/components/hooks/useWallet";

const RATE = 1000; // 1 ETH = 1000 YD（测试环境兑换比例）

export default function TokenExchange() {
  const { address, balance } = useWallet();
  const [ethAmount, setEthAmount] = useState("0.1");
  const ydAmount = Number(ethAmount || 0) * RATE;

  const handleEthChange = (value: string) => {
    // 仅允许数字与小数点
    if (value === "" || /^\d*(\.\d*)?$/.test(value)) {
      setEthAmount(value);
    }
  };

  const handleExchange = () => {
    // TODO: 调用合约，将用户支付的 ETH 按照 RATE 兑换成 YD 代币
    // 这里需要集成 wagmi/viem 的写操作，并处理交易签名与状态反馈
    console.info("exchange placeholder", { address, ethAmount, ydAmount });
  };

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-6 py-24">
        <header className="mb-12 text-center md:text-left">
          <h2 className="text-3xl font-bold text-[#2B2558] md:text-4xl">
            兑换中心
          </h2>
          <p className="mt-3 text-base text-[#4D4F75]">
            在测试网络中使用 ETH 快速兑换 YD 代币，后续可对接真实合约。
          </p>
        </header>

        <div className="grid gap-12 text-white md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[rgba(255,255,255,0.65)] to-[rgba(210,223,255,0.55)] p-8 text-[#253155] shadow-[0_25px_80px_rgba(116,136,255,0.32)] backdrop-blur-xl">
            <header className="flex items-center justify-between text-sm font-medium text-white/80">
              <h3 className="text-2xl font-semibold text-[#B1FF5A]">
                兑换 YD 代币
              </h3>
              <span>
                当前余额：
                <span className="font-semibold text-[#B1FF5A]">
                  {balance ? balance.formatted : 0}
                </span>{" "}
                YD
              </span>
            </header>

            <div className="mt-8 space-y-6 rounded-2xl bg-white/5 p-6">
              <div className="space-y-2">
                <span className="text-sm text-white/70">支付</span>
                <div className="flex items-center gap-3 rounded-xl bg-black/30 px-4 py-3 ring-1 ring-white/10">
                  <input
                    value={ethAmount}
                    onChange={(event) => handleEthChange(event.target.value)}
                    className="w-full bg-transparent text-lg font-semibold text-white outline-none"
                    inputMode="decimal"
                    placeholder="0.0"
                  />
                  <span className="text-sm font-semibold text-white/70">
                    ETH
                  </span>
                </div>
              </div>

              <ArrowRight className="mx-auto h-5 w-5 text-white/40" />

              <div className="space-y-2">
                <span className="text-sm text-white/70">可得</span>
                <div className="flex items-center gap-3 rounded-xl bg-black/30 px-4 py-3 ring-1 ring-[#B1FF5A]/20">
                  <input
                    value={ydAmount ? ydAmount.toFixed(2) : "0"}
                    readOnly
                    className="w-full bg-transparent text-lg font-semibold text-white outline-none"
                  />
                  <span className="text-sm font-semibold text-[#B1FF5A]">
                    YD
                  </span>
                </div>
              </div>

              <p className="text-xs text-white/60">
                兑换比例：1 ETH = {RATE} YD
              </p>

              <Button
                variant="primary"
                fullWidth
                onClick={handleExchange}
                className="bg-gradient-to-r from-[#BAFF63] to-[#73FF6C] text-[#1C1C1C] hover:brightness-95"
              >
                立即兑换
              </Button>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-8 text-left">
            <header>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.18em] text-[#B1FF5A]">
                欢迎来到兑换中心
              </p>
              <h3 className="mt-4 text-3xl font-bold text-[#B1FF5A] md:text-4xl">
                Web3 学院兑换站
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75">
                使用测试环境 ETH 一键兑换 YD
                代币，用于购买课程、支付认证与参与治理。
                当前兑换为测试合约，稍后可接入主网。
              </p>
            </header>

            <div className="grid gap-4 sm:grid-cols-3">
              <ExchangeStat
                icon={<Shield className="h-5 w-5" />}
                label="安全合约"
                value="多签托管"
              />
              <ExchangeStat
                icon={<Coins className="h-5 w-5" />}
                label="实时到账"
                value="< 15 秒"
              />
              <ExchangeStat
                icon={<Users className="h-5 w-5" />}
                label="活跃兑换"
                value="1,200+"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(129,212,255,0.55),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(189,178,255,0.55),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(104,178,255,0.75),rgba(178,143,255,0.75))]" />
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
    <div className="flex flex-col items-start gap-2 rounded-2xl bg-white/5 px-4 py-4 text-white/80 ring-1 ring-white/10">
      <div className="inline-flex items-center gap-2 text-sm font-medium text-[#B1FF5A]">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-xl font-semibold text-white">{value}</span>
    </div>
  );
}
