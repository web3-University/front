import { useState, useRef, useEffect } from "react";
import { useWalletConnection } from "../../hooks/wallet";
import "./Profile.css";

export interface ProfileProps {
  openAccountModal: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ openAccountModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { disconnect } = useWalletConnection();

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
    openAccountModal();
  };

  return (
    <div className="profile__menu-wrapper" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        type="button"
        className="profile__menu-trigger profile__avatar"
        aria-label="Account menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
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
      </button>

      {isMenuOpen && (
        <div className="profile__dropdown-menu">
          <button onClick={handleProfile} className="profile__menu-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
            <span>Profile</span>
          </button>

          <button
            onClick={handleDisconnect}
            className="profile__menu-item profile__menu-item--danger"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};
