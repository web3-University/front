import React from "react";
import { SignInStatus } from "../../types/auth";
import "./AuthModal.css";

export interface AuthModalProps {
  status: SignInStatus;
  error?: string | null;
  onClose?: () => void;
}

export function AuthModal({
  status,
  error,
  onClose,
}: AuthModalProps): React.ReactElement | null {
  // 只在特定状态下显示
  if (status === SignInStatus.IDLE) {
    return null;
  }

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* 请求 nonce 状态 */}
        {status === SignInStatus.REQUESTING_NONCE && (
          <div className="auth-modal-body">
            <div className="auth-modal-spinner">
              <div className="spinner"></div>
            </div>
            <h3 className="auth-modal-title">准备中...</h3>
            <p className="auth-modal-description">正在准备签名消息</p>
          </div>
        )}

        {/* 等待签名状态 - OpenSea 风格 */}
        {status === SignInStatus.WAITING_SIGNATURE && (
          <div className="auth-modal-body">
            <div className="auth-modal-icon">
              {/* 钱包图标 */}
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
              </svg>
            </div>
            <h3 className="auth-modal-title">等待签名</h3>
            <p className="auth-modal-description">请在钱包中确认签名请求</p>
            <div className="auth-modal-spinner">
              <div className="spinner"></div>
            </div>
          </div>
        )}

        {/* 验证签名状态 */}
        {status === SignInStatus.VERIFYING && (
          <div className="auth-modal-body">
            <div className="auth-modal-spinner">
              <div className="spinner"></div>
            </div>
            <h3 className="auth-modal-title">验证中...</h3>
            <p className="auth-modal-description">正在验证您的签名</p>
          </div>
        )}

        {/* 成功状态 */}
        {status === SignInStatus.SUCCESS && (
          <div className="auth-modal-body">
            <div className="auth-modal-icon auth-modal-icon--success">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="auth-modal-title">登录成功!</h3>
            <p className="auth-modal-description">欢迎回来</p>
          </div>
        )}

        {/* 错误状态 */}
        {status === SignInStatus.ERROR && (
          <div className="auth-modal-body">
            <div className="auth-modal-icon auth-modal-icon--error">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h3 className="auth-modal-title">签名失败</h3>
            <p className="auth-modal-description">{error || "请重试"}</p>
            <button className="auth-modal-button" onClick={onClose}>
              关闭
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
