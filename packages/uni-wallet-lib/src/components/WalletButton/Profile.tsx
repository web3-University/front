import { useState, useRef, useEffect, useMemo } from "react";
import { useWalletConnection } from "../../hooks/wallet";
import { useSimpleYDToken } from "../../hooks/contract/useSimpleYDToken";
import "./Profile.css";

type AccountProps = {
  address: string;
  balanceDecimals?: number;
  balanceFormatted?: string;
  balanceSymbol?: string;
  displayBalance?: string;
  displayName: string;
  ensAvatar?: string;
  ensName?: string;
  hasPendingTransactions: boolean;
};

type ChainProps = {
  hasIcon: boolean;
  iconUrl?: string;
  iconBackground?: string;
  id: number;
  name?: string;
  unsupported?: boolean;
};

export interface ProfileProps {
  account: AccountProps;
  chain: ChainProps;
  openAccountModal: () => void;
  openProfile: () => void;
}

export const Profile: React.FC<ProfileProps> = ({
  account,
  chain,
  openProfile,
}: ProfileProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { disconnect } = useWalletConnection();

  // 获取YD币余额
  const { formattedBalance } = useSimpleYDToken({
    enabled: true,
  });

  // 从 localStorage 获取用户头像
  const userAvatar = useMemo(() => {
    try {
      const userStr = localStorage.getItem("USER");
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.avatar || null;
      }
      return null;
    } catch (error) {
      console.error("Failed to parse USER from localStorage:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDisconnect = (): void => {
    setIsMenuOpen(false);
    disconnect();
  };

  const handleProfile = (): void => {
    setIsMenuOpen(false);
    openProfile();
  };

  const handleCopyAddress = (): void => {
    navigator.clipboard.writeText("");
  };

  return (
    <div className="profile__menu-wrapper" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        type="button"
        className="profile__menu-trigger profile__avatar"
        aria-label="Account menu"
      >
        {userAvatar !== null ? (
          <img src={userAvatar} className="avatar" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        )}
      </button>

      {isMenuOpen && (
        // Wallet Dropdown (conditionally shown)
        <div className="wallet-dropdown" id="walletDropdown">
          <div className="wallet-header">
            <div>
              <div className="wallet-label">网络</div>
              <div className="wallet-value">{chain.name}</div>
            </div>
            <div className="wallet-chain-id">ID 1</div>
          </div>

          <div className="wallet-section">
            <div className="wallet-label">地址</div>
            <div className="wallet-address-box">
              <span className="wallet-address-text">{account.displayName}</span>
              <button
                type="button"
                className="copy-button"
                aria-label="复制地址"
                onClick={handleCopyAddress}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
          </div>

          <div className="balance-info-box">
            <div className="balance-info-label">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              当前余额
            </div>
            <div className="balance-info-amount">{formattedBalance}</div>
          </div>

          <div className="profile-box hover-animation">
            <button
              className="profile-box-button"
              type="button"
              onClick={handleProfile}
            ></button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            个人中心
          </div>

          <button className="disconnect-button" onClick={handleDisconnect}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            断开连接
          </button>
        </div>
      )}
    </div>
  );
};
