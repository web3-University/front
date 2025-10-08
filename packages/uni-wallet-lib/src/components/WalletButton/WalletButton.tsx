import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Profile } from "./Profile";
import "./WalletButton.css";

export interface WalletButtonProps {
  label?: string;
  showBalance?: boolean;
  showChainName?: boolean;
  className?: string;
  size?: "small" | "medium" | "large";
}

export const WalletButton: React.FC<WalletButtonProps> = ({
  label = "连接钱包",
  showBalance = true,
  showChainName = true,
  className = "",
  size = "medium",
}: WalletButtonProps) => {
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
                        {showBalance && account.displayBalance && (
                          <span>{account.displayBalance}</span>
                        )}
                      </div>
                    )}

                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="wallet-button__account"
                    >
                      <span className="wallet-button__status-bot"></span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="wallet-icon"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
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
                          stroke-width="2"
                        >
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                        <span className="notification-badge">{"99"}</span>
                      </div>
                    </div>

                    <Profile
                      account={account}
                      chain={currentChain}
                      openAccountModal={openAccountModal}
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
