import { ConnectButton } from "@rainbow-me/rainbowkit";
import type React from "react";
import { Profile } from "./Profile";
import "./WalletButton.css";
import { useMemo } from "react";
import { formatUnits } from "viem";
import { useSimpleYDToken } from "../../hooks/contract/useSimpleYDToken";

export interface WalletButtonProps {
  label?: string;
  showBalance?: boolean;
  showChainName?: boolean;
  className?: string;
  size?: "small" | "medium" | "large";
  onOpenProfile: () => void;
}

export const WalletButton: React.FC<WalletButtonProps> = ({
  label = "连接钱包",
  showBalance = true,
  showChainName = true,
  className = "",
  size = "medium",
  onOpenProfile,
}: WalletButtonProps) => {
  // 获取YD币余额
  const { balance: ydBalance } = useSimpleYDToken({
    enabled: true,
  });

  // 格式化YD币余额显示
  const ydBalanceLabel = useMemo(() => {
    console.log("一灯币", ydBalance);

    if (!ydBalance) return "0";
    return Number(formatUnits(ydBalance, 18)).toFixed(4);
  }, [ydBalance]);

  return (
    <div className={`wallet-button wallet-button--${size} ${className}`}>
      <ConnectButton.Custom>
        {({
          account,
          chain: currentChain,
          openAccountModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== "loading";
          const connected =
            ready &&
            account &&
            currentChain &&
            (!authenticationStatus || authenticationStatus === "authenticated");
          console.log(account);

          return (
            <div className="wallet-button__container">
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className="wallet-button__connect"
                    >
                      {label}
                    </button>
                  );
                }

                return (
                  <div className="wallet-button__connected">
                    {showChainName && (
                      <div className="wallet-button__chain">
                        {currentChain.iconUrl && (
                          <div className="wallet-button__chain-icon">
                            <img
                              alt={currentChain.name ?? "Chain icon"}
                              src={currentChain.iconUrl}
                              className="wallet-button__icon"
                            />
                          </div>
                        )}
                        {showBalance && <span>{ydBalanceLabel} YD</span>}
                      </div>
                    )}

                    <button type="button" className="wallet-button__account">
                      <span className="wallet-button__status-bot"></span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="wallet-icon"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
                        <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
                      </svg>
                      <span className="wallet-button__address">
                        {account.displayName}
                      </span>
                    </button>

                    {/* <!-- Notification Bell --> */}
                    <div className="notification-container">
                      <div className="notification-button">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                        <span className="notification-badge">{""}</span>
                      </div>
                    </div>

                    <Profile
                      account={account}
                      chain={currentChain}
                      openAccountModal={openAccountModal}
                      openProfile={onOpenProfile}
                    />
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
};
