import { jsx, jsxs } from 'react/jsx-runtime';
import React, { useState, useCallback, useEffect, useMemo, createContext, useContext, useRef } from 'react';
import { http, createStorage, cookieStorage, useAccount, useChainId, useChains, useConnect, useReconnect, useDisconnect, useSignMessage, WagmiProvider, useEnsName, useBalance, useSwitchChain, useReadContract, useWriteContract, useWaitForTransactionReceipt, useEstimateGas } from 'wagmi';
import { getDefaultConfig, lightTheme, darkTheme, RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { sepolia, mainnet } from 'wagmi/chains';
import { SiweMessage } from 'siwe';
import '@rainbow-me/rainbowkit/styles.css';
import { formatEther, parseUnits, parseEther } from 'viem';

// Hardhat 本地节点配置
const hardhat = {
    id: 31337,
    name: "Hardhat",
    nativeCurrency: {
        decimals: 18,
        name: "Ether",
        symbol: "ETH"
    },
    rpcUrls: {
        default: {
            http: [
                "http://127.0.0.1:8545"
            ]
        },
        public: {
            http: [
                "http://127.0.0.1:8545"
            ]
        }
    },
    testnet: true
};
const supportedChains = [
    mainnet,
    sepolia,
    hardhat
];
({
    [mainnet.id]: "🔷",
    [sepolia.id]: "🔷",
    [hardhat.id]: "🛠️"
});

function createWalletConfig(options) {
    const { appName = "APP_NAME", projectId = "YOUR_PROJECT_ID", alchemyApiKey, infuraApiKey } = options;
    // 创建传输层配置
    const transports = supportedChains.reduce((acc, chain)=>{
        let rpcUrl = "";
        // Hardhat 本地节点使用默认的本地 RPC URL
        if (chain.id === 31337) {
            rpcUrl = "http://127.0.0.1:8545";
        } else if (alchemyApiKey) {
            // 使用链名称构建 Alchemy URL
            const chainName = chain.name.toLowerCase().replace(/\s+/g, "-");
            rpcUrl = `https://${chainName}.g.alchemy.com/v2/${alchemyApiKey}`;
        } else if (infuraApiKey) {
            // 使用链名称构建 Infura URL
            const chainName = chain.name.toLowerCase().replace(/\s+/g, "-");
            rpcUrl = `https://${chainName}.infura.io/v3/${infuraApiKey}`;
        }
        acc[chain.id] = rpcUrl ? http(rpcUrl) : http();
        return acc;
    }, {});
    const config = getDefaultConfig({
        appName,
        projectId,
        chains: supportedChains,
        ssr: true,
        storage: createStorage({
            storage: cookieStorage
        })
    });
    return {
        config,
        transports
    };
}

({
    ...lightTheme(),
    colors: {
        ...lightTheme().colors},
    radii: {
        ...lightTheme().radii}
});
const customDarkTheme = {
    ...darkTheme(),
    colors: {
        ...darkTheme().colors,
        accentColor: "#0070f3",
        accentColorForeground: "white",
        actionButtonBorder: "rgba(255, 255, 255, 0.04)",
        actionButtonBorderMobile: "rgba(255, 255, 255, 0.06)",
        actionButtonSecondaryBackground: "rgba(255, 255, 255, 0.06)",
        closeButton: "rgba(224, 232, 255, 0.8)",
        closeButtonBackground: "rgba(255, 255, 255, 0.06)",
        connectButtonBackground: "#0070f3",
        connectButtonBackgroundError: "#ff494a",
        connectButtonInnerBackground: "linear-gradient(0deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))",
        connectButtonText: "#ffffff",
        connectButtonTextError: "#ffffff"
    },
    radii: {
        ...darkTheme().radii,
        actionButton: "8px",
        connectButton: "8px",
        menuButton: "8px",
        modal: "16px",
        modalMobile: "16px"
    }
};

function useWalletConnection() {
    const { address, connector, isConnected, isConnecting, isReconnecting } = useAccount();
    const chainId = useChainId();
    const chains = useChains();
    const { connect: wagmiConnect, connectors } = useConnect();
    const { reconnect: wagmiReconnect } = useReconnect();
    const { disconnect: wagmiDisconnect } = useDisconnect();
    // 根据当前chainId找到对应的chain对象
    const currentChain = chains.find((chain)=>chain.id === chainId);
    const connect = (connectorId)=>{
        if (connectorId) {
            const targetConnector = connectors.find((c)=>c.id === connectorId);
            if (targetConnector) {
                wagmiConnect({
                    connector: targetConnector
                });
            }
        } else {
            const availableConnector = connectors[0];
            if (availableConnector) {
                wagmiConnect({
                    connector: availableConnector
                });
            }
        }
    };
    const reconnect = (config)=>{
        wagmiReconnect(config);
    };
    const disconnect = ()=>{
        wagmiDisconnect();
    };
    return {
        isConnected,
        isConnecting,
        isReconnecting,
        address,
        connector: connector ? {
            id: connector.id,
            name: connector.name,
            type: connector.type
        } : undefined,
        chain: currentChain,
        chains,
        connect,
        reconnect,
        disconnect
    };
}

function useWalletSign() {
    const { address: connectedAddress } = useWalletConnection();
    const { signMessageAsync, isPending, isSuccess, isError } = useSignMessage();
    /**
   * 生成符合EIP-4361（SIWE）标准消息
   */ const generateSIWEMessage = (domain, address, nonce, chainId = 1, statement = "Sign in with Ethereum to the app.")=>{
        const message = new SiweMessage({
            domain,
            address,
            statement,
            uri: window ? window.location.origin : undefined,
            version: "1",
            chainId,
            nonce
        });
        return message;
    };
    /**
   * 自定义Message签名
   * @param message 自定义签名消息
   * @returns
   */ const signMessage = async (message)=>{
        if (!connectedAddress) throw new Error("❗️ 钱包未连接");
        const signature = await signMessageAsync({
            message
        });
        return {
            message,
            signature,
            address: connectedAddress
        };
    };
    /**
   * 符合EIP-4361（SIWE）标准消息签名
   * @param domain
   * @param nonce
   * @param chainId
   * @returns
   */ const signSIWEMessage = async (domain, nonce, chainId)=>{
        if (!connectedAddress) throw new Error("❗️ 钱包未连接");
        const message = generateSIWEMessage(domain, connectedAddress, nonce, chainId);
        const signature = await signMessageAsync({
            message: message.toMessage()
        });
        return {
            message,
            signature,
            address: connectedAddress
        };
    };
    return {
        address: connectedAddress,
        isPending,
        isSuccess,
        isError,
        signMessage,
        signSIWEMessage,
        generateSIWEMessage
    };
}

/**
 * Safe Storage Utility
 * 提供 SSR 安全的 localStorage 访问方法
 *
 * @description
 * 在 Next.js 等 SSR 框架中，localStorage 只在浏览器环境可用。
 * 这个工具提供了安全的访问方法，避免 "localStorage is not defined" 错误。
 *
 * @example
 * ```typescript
 * import { safeStorage } from './utils/safeStorage';
 *
 * // 读取
 * const token = safeStorage.getItem('AUTH_TOKEN');
 *
 * // 写入
 * safeStorage.setItem('AUTH_TOKEN', 'your-token');
 *
 * // 删除
 * safeStorage.removeItem('AUTH_TOKEN');
 *
 * // 清空
 * safeStorage.clear();
 * ```
 */ /**
 * 检查是否在浏览器环境
 */ const isBrowser = ()=>{
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
};
/**
 * 安全的 localStorage 工具
 */ const safeStorage = {
    /**
   * 获取存储的值
   *
   * @param key - 存储键名
   * @returns 存储的值，如果不存在或在服务端则返回 null
   *
   * @example
   * ```typescript
   * const token = safeStorage.getItem('AUTH_TOKEN');
   * if (token) {
   *   console.log('Token found:', token);
   * }
   * ```
   */ getItem (key) {
        if (!isBrowser()) {
            return null;
        }
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.warn(`[safeStorage] Failed to get item "${key}":`, error);
            return null;
        }
    },
    /**
   * 设置存储值
   *
   * @param key - 存储键名
   * @param value - 要存储的值
   * @returns 是否成功设置
   *
   * @example
   * ```typescript
   * const success = safeStorage.setItem('AUTH_TOKEN', 'abc123');
   * if (!success) {
   *   console.error('Failed to save token');
   * }
   * ```
   */ setItem (key, value) {
        if (!isBrowser()) {
            return false;
        }
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            // 可能是存储空间已满或隐私模式
            console.warn(`[safeStorage] Failed to set item "${key}":`, error);
            return false;
        }
    },
    /**
   * 删除存储值
   *
   * @param key - 存储键名
   * @returns 是否成功删除
   *
   * @example
   * ```typescript
   * safeStorage.removeItem('AUTH_TOKEN');
   * ```
   */ removeItem (key) {
        if (!isBrowser()) {
            return false;
        }
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn(`[safeStorage] Failed to remove item "${key}":`, error);
            return false;
        }
    },
    /**
   * 清空所有存储
   *
   * @returns 是否成功清空
   *
   * @example
   * ```typescript
   * safeStorage.clear();
   * ```
   */ clear () {
        if (!isBrowser()) {
            return false;
        }
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.warn("[safeStorage] Failed to clear storage:", error);
            return false;
        }
    },
    /**
   * 获取所有存储的键名
   *
   * @returns 所有键名的数组，服务端返回空数组
   *
   * @example
   * ```typescript
   * const keys = safeStorage.getAllKeys();
   * console.log('Stored keys:', keys);
   * ```
   */ getAllKeys () {
        if (!isBrowser()) {
            return [];
        }
        try {
            return Object.keys(localStorage);
        } catch (error) {
            console.warn("[safeStorage] Failed to get all keys:", error);
            return [];
        }
    },
    /**
   * 检查键是否存在
   *
   * @param key - 存储键名
   * @returns 是否存在
   *
   * @example
   * ```typescript
   * if (safeStorage.hasItem('AUTH_TOKEN')) {
   *   console.log('Token exists');
   * }
   * ```
   */ hasItem (key) {
        return this.getItem(key) !== null;
    },
    /**
   * 获取并解析 JSON 值
   *
   * @param key - 存储键名
   * @returns 解析后的对象，解析失败返回 null
   *
   * @example
   * ```typescript
   * const user = safeStorage.getJSON<User>('USER_DATA');
   * if (user) {
   *   console.log('User:', user.name);
   * }
   * ```
   */ getJSON (key) {
        const value = this.getItem(key);
        if (!value) {
            return null;
        }
        try {
            return JSON.parse(value);
        } catch (error) {
            console.warn(`[safeStorage] Failed to parse JSON for "${key}":`, error);
            return null;
        }
    },
    /**
   * 将对象序列化为 JSON 并存储
   *
   * @param key - 存储键名
   * @param value - 要存储的对象
   * @returns 是否成功设置
   *
   * @example
   * ```typescript
   * const user = { name: 'John', age: 30 };
   * safeStorage.setJSON('USER_DATA', user);
   * ```
   */ setJSON (key, value) {
        try {
            const jsonString = JSON.stringify(value);
            return this.setItem(key, jsonString);
        } catch (error) {
            console.warn(`[safeStorage] Failed to stringify JSON for "${key}":`, error);
            return false;
        }
    }
};

/**
 * 签名登录状态枚举
 */ var SignInStatus = /*#__PURE__*/ function(SignInStatus) {
    SignInStatus["IDLE"] = "idle";
    SignInStatus["REQUESTING_NONCE"] = "requesting";
    SignInStatus["WAITING_SIGNATURE"] = "waiting";
    SignInStatus["VERIFYING"] = "verifying";
    SignInStatus["SUCCESS"] = "success";
    SignInStatus["ERROR"] = "error";
    return SignInStatus;
}({});

/**
 * 钱包认证 Hook
 * 提供完整的签名登录流程
 *
 * @description
 * 集成 SIWE (Sign-In with Ethereum) 标准的钱包认证流程：
 * 1. 请求 nonce
 * 2. 用户签名
 * 3. 验证签名
 * 4. 获取并存储 JWT token
 *
 * @example
 * ```typescript
 * const { signIn, signOut, isAuthenticated, status } = useWalletAuth({
 *   domain: 'http://localhost:3000',
 *   apiBaseUrl: '/api/v1/auth',
 *   onSuccess: (token) => console.log('Logged in:', token),
 * });
 * ```
 */ function useWalletAuth(config = {}) {
    const { domain = typeof window !== "undefined" ? window.location.host : "localhost", apiBaseUrl = "/api/v1/auth", onSuccess, onError, onStatusChange } = config;
    const tokenStorageKey = "AUTH_TOKEN";
    const refreshTokenStorageKey = "REFRESH_TOKEN";
    const userStorageKey = "USER";
    const signatureStorageKey = "WALLET_SIGNATURE";
    const { signSIWEMessage } = useWalletSign();
    const { address: walletAddress, isConnected } = useWalletConnection();
    const [status, setStatus] = useState(SignInStatus.IDLE);
    const [error, setError] = useState(null);
    /**
   * 更新状态并触发回调
   */ const updateStatus = useCallback((newStatus)=>{
        setStatus(newStatus);
        onStatusChange?.(newStatus);
    }, [
        onStatusChange
    ]);
    /**
   * 请求 nonce
   */ const requestNonce = async (walletAddress)=>{
        const response = await fetch(`${domain}${apiBaseUrl}/nonce`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                walletAddress: walletAddress
            })
        });
        if (!response.ok) {
            throw new Error("Failed to request nonce from server");
        }
        const json = await response.json();
        return {
            nonce: json.data.nonce,
            message: json.data.message,
            expiresAt: json.data.expiresAt
        };
    };
    /**
   * 验证签名
   */ const verifySignature = async (walletAddress, signature, message)=>{
        const response = await fetch(`${domain}${apiBaseUrl}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                walletAddress,
                signature,
                message
            })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Verification failed");
        }
        const json = await response.json();
        return json.data;
    };
    /**
   * 完整的签名登录流程
   */ const signIn = useCallback(async ()=>{
        if (!walletAddress || !isConnected) {
            const err = new Error("Wallet not connected");
            setError(err.message);
            onError?.(err);
            return null;
        }
        setError(null);
        try {
            // 步骤 1: 请求 nonce
            updateStatus(SignInStatus.REQUESTING_NONCE);
            const { nonce } = await requestNonce(walletAddress);
            // 步骤 2: 等待用户签名
            updateStatus(SignInStatus.WAITING_SIGNATURE);
            // 触发 MetaMask 签名弹窗
            const { signature, message } = await signSIWEMessage(domain, nonce);
            // 步骤 3: 验证签名
            updateStatus(SignInStatus.VERIFYING);
            const { accessToken, refreshToken, user } = await verifySignature(walletAddress, signature, message.toMessage());
            // 步骤 4: 保存 token / user / signature
            safeStorage.setItem(tokenStorageKey, accessToken);
            safeStorage.setItem(refreshTokenStorageKey, refreshToken);
            safeStorage.setItem(userStorageKey, JSON.stringify(user));
            safeStorage.setItem(signatureStorageKey, signature);
            // 成功
            updateStatus(SignInStatus.SUCCESS);
            onSuccess?.(accessToken);
            return accessToken;
        } catch (err) {
            // 处理用户拒绝签名的情况
            const errorMessage = err instanceof Error ? err.message : "Authentication failed";
            // 用户拒绝签名通常包含 "rejected" 或 "denied"
            const isUserRejection = errorMessage.toLowerCase().includes("rejected") || errorMessage.toLowerCase().includes("denied") || errorMessage.toLowerCase().includes("user rejected");
            const displayError = isUserRejection ? "用户取消签名" : errorMessage;
            setError(displayError);
            updateStatus(SignInStatus.ERROR);
            onError?.(err instanceof Error ? err : new Error(displayError));
            return null;
        } finally{
            setTimeout(()=>{
                reset(); // 重置状态
            }, 3000);
        }
    }, [
        walletAddress,
        isConnected,
        domain,
        apiBaseUrl,
        tokenStorageKey,
        updateStatus,
        onSuccess,
        onError
    ]);
    /**
   * 退出登录
   * 清除所有认证相关的存储数据
   */ const signOut = useCallback(()=>{
        safeStorage.removeItem(tokenStorageKey);
        safeStorage.removeItem(refreshTokenStorageKey);
        safeStorage.removeItem(`${tokenStorageKey}_address`);
        updateStatus(SignInStatus.IDLE);
        setError(null);
    }, [
        tokenStorageKey,
        refreshTokenStorageKey,
        updateStatus
    ]);
    /**
   * 检查是否已认证
   * 验证 token 和钱包地址是否匹配
   *
   * @returns 是否已通过认证
   */ const isAuthenticated = useCallback(()=>{
        const token = safeStorage.getItem(tokenStorageKey);
        const storedAddress = safeStorage.getItem(`${tokenStorageKey}_address`);
        return !!(token && storedAddress && storedAddress === walletAddress);
    }, [
        tokenStorageKey,
        walletAddress
    ]);
    /**
   * 重新加载认证状态
   * 如果钱包地址变化，自动登出
   */ const reload = useCallback(()=>{
        // 如果当前地址与存储的地址不匹配,自动登出
        const storedAddress = safeStorage.getItem(`${tokenStorageKey}_address`);
        if (storedAddress && walletAddress && storedAddress !== walletAddress) {
            signOut();
        }
    }, [
        walletAddress,
        tokenStorageKey,
        signOut
    ]);
    /**
   * 重置状态（用于关闭 Modal）
   */ const reset = useCallback(()=>{
        updateStatus(SignInStatus.IDLE);
        setError(null);
    }, [
        updateStatus
    ]);
    return {
        status,
        isAuthenticated: isAuthenticated(),
        isAuthenticating: status !== SignInStatus.IDLE && status !== SignInStatus.SUCCESS && status !== SignInStatus.ERROR,
        error,
        address: walletAddress,
        signIn,
        signOut,
        reload,
        reset
    };
}

function styleInject(css, ref) {
    if (ref === void 0) ref = {};
    var insertAt = ref.insertAt;
    if (!css || typeof document === 'undefined') {
        return;
    }
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    if (insertAt === 'top') {
        if (head.firstChild) {
            head.insertBefore(style, head.firstChild);
        } else {
            head.appendChild(style);
        }
    } else {
        head.appendChild(style);
    }
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
}

var css_248z$2 = ".auth-modal-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  backdrop-filter: blur(4px);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 9999;\n  animation: fadeIn 0.2s ease-out;\n}\n\n.auth-modal-content {\n  background: white;\n  border-radius: 16px;\n  padding: 32px;\n  max-width: 400px;\n  width: 90%;\n  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);\n  animation: slideUp 0.3s ease-out;\n}\n\n.auth-modal-body {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n}\n\n.auth-modal-icon {\n  margin-bottom: 16px;\n  color: #3b82f6;\n  animation: pulse 2s ease-in-out infinite;\n}\n\n.auth-modal-icon--success {\n  color: #10b981;\n  animation: scaleIn 0.3s ease-out;\n}\n\n.auth-modal-icon--error {\n  color: #ef4444;\n  animation: shake 0.5s ease-out;\n}\n\n.auth-modal-title {\n  font-size: 24px;\n  font-weight: 600;\n  margin: 0 0 8px 0;\n  color: #111;\n}\n\n.auth-modal-description {\n  font-size: 14px;\n  color: #6b7280;\n  margin: 0 0 24px 0;\n}\n\n.auth-modal-spinner {\n  margin-top: 16px;\n}\n\n.spinner {\n  width: 40px;\n  height: 40px;\n  border: 3px solid #e5e7eb;\n  border-top-color: #3b82f6;\n  border-radius: 50%;\n  animation: spin 1s linear infinite;\n}\n\n.auth-modal-button {\n  padding: 12px 24px;\n  background: #3b82f6;\n  color: white;\n  border: none;\n  border-radius: 8px;\n  font-size: 16px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: background 0.2s;\n}\n\n.auth-modal-button:hover {\n  background: #2563eb;\n}\n\n.auth-modal-button:active {\n  transform: scale(0.98);\n}\n\n/* 动画 */\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n\n@keyframes slideUp {\n  from {\n    transform: translateY(20px);\n    opacity: 0;\n  }\n  to {\n    transform: translateY(0);\n    opacity: 1;\n  }\n}\n\n@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes pulse {\n  0%,\n  100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.5;\n  }\n}\n\n@keyframes scaleIn {\n  from {\n    transform: scale(0);\n  }\n  to {\n    transform: scale(1);\n  }\n}\n\n@keyframes shake {\n  0%,\n  100% {\n    transform: translateX(0);\n  }\n  10%,\n  30%,\n  50%,\n  70%,\n  90% {\n    transform: translateX(-5px);\n  }\n  20%,\n  40%,\n  60%,\n  80% {\n    transform: translateX(5px);\n  }\n}\n\n/* 暗色模式 */\n@media (prefers-color-scheme: dark) {\n  .auth-modal-content {\n    background: #1f2937;\n  }\n\n  .auth-modal-title {\n    color: #f9fafb;\n  }\n\n  .auth-modal-description {\n    color: #9ca3af;\n  }\n\n  .spinner {\n    border-color: #374151;\n    border-top-color: #3b82f6;\n  }\n}\n";
styleInject(css_248z$2);

function AuthModal({ status, error, onClose }) {
    // 只在特定状态下显示
    if (status === SignInStatus.IDLE) {
        return null;
    }
    return /*#__PURE__*/ jsx("div", {
        className: "auth-modal-overlay",
        onClick: onClose,
        children: /*#__PURE__*/ jsxs("div", {
            className: "auth-modal-content",
            onClick: (e)=>e.stopPropagation(),
            children: [
                status === SignInStatus.REQUESTING_NONCE && /*#__PURE__*/ jsxs("div", {
                    className: "auth-modal-body",
                    children: [
                        /*#__PURE__*/ jsx("div", {
                            className: "auth-modal-spinner",
                            children: /*#__PURE__*/ jsx("div", {
                                className: "spinner"
                            })
                        }),
                        /*#__PURE__*/ jsx("h3", {
                            className: "auth-modal-title",
                            children: "准备中..."
                        }),
                        /*#__PURE__*/ jsx("p", {
                            className: "auth-modal-description",
                            children: "正在准备签名消息"
                        })
                    ]
                }),
                status === SignInStatus.WAITING_SIGNATURE && /*#__PURE__*/ jsxs("div", {
                    className: "auth-modal-body",
                    children: [
                        /*#__PURE__*/ jsx("div", {
                            className: "auth-modal-icon",
                            children: /*#__PURE__*/ jsxs("svg", {
                                width: "64",
                                height: "64",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2",
                                children: [
                                    /*#__PURE__*/ jsx("path", {
                                        d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"
                                    }),
                                    /*#__PURE__*/ jsx("path", {
                                        d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"
                                    })
                                ]
                            })
                        }),
                        /*#__PURE__*/ jsx("h3", {
                            className: "auth-modal-title",
                            children: "等待签名"
                        }),
                        /*#__PURE__*/ jsx("p", {
                            className: "auth-modal-description",
                            children: "请在钱包中确认签名请求"
                        }),
                        /*#__PURE__*/ jsx("div", {
                            className: "auth-modal-spinner",
                            children: /*#__PURE__*/ jsx("div", {
                                className: "spinner"
                            })
                        })
                    ]
                }),
                status === SignInStatus.VERIFYING && /*#__PURE__*/ jsxs("div", {
                    className: "auth-modal-body",
                    children: [
                        /*#__PURE__*/ jsx("div", {
                            className: "auth-modal-spinner",
                            children: /*#__PURE__*/ jsx("div", {
                                className: "spinner"
                            })
                        }),
                        /*#__PURE__*/ jsx("h3", {
                            className: "auth-modal-title",
                            children: "验证中..."
                        }),
                        /*#__PURE__*/ jsx("p", {
                            className: "auth-modal-description",
                            children: "正在验证您的签名"
                        })
                    ]
                }),
                status === SignInStatus.SUCCESS && /*#__PURE__*/ jsxs("div", {
                    className: "auth-modal-body",
                    children: [
                        /*#__PURE__*/ jsx("div", {
                            className: "auth-modal-icon auth-modal-icon--success",
                            children: /*#__PURE__*/ jsx("svg", {
                                width: "64",
                                height: "64",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2",
                                children: /*#__PURE__*/ jsx("path", {
                                    d: "M20 6L9 17l-5-5"
                                })
                            })
                        }),
                        /*#__PURE__*/ jsx("h3", {
                            className: "auth-modal-title",
                            children: "登录成功!"
                        }),
                        /*#__PURE__*/ jsx("p", {
                            className: "auth-modal-description",
                            children: "欢迎回来"
                        })
                    ]
                }),
                status === SignInStatus.ERROR && /*#__PURE__*/ jsxs("div", {
                    className: "auth-modal-body",
                    children: [
                        /*#__PURE__*/ jsx("div", {
                            className: "auth-modal-icon auth-modal-icon--error",
                            children: /*#__PURE__*/ jsxs("svg", {
                                width: "64",
                                height: "64",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2",
                                children: [
                                    /*#__PURE__*/ jsx("circle", {
                                        cx: "12",
                                        cy: "12",
                                        r: "10"
                                    }),
                                    /*#__PURE__*/ jsx("line", {
                                        x1: "15",
                                        y1: "9",
                                        x2: "9",
                                        y2: "15"
                                    }),
                                    /*#__PURE__*/ jsx("line", {
                                        x1: "9",
                                        y1: "9",
                                        x2: "15",
                                        y2: "15"
                                    })
                                ]
                            })
                        }),
                        /*#__PURE__*/ jsx("h3", {
                            className: "auth-modal-title",
                            children: "签名失败"
                        }),
                        /*#__PURE__*/ jsx("p", {
                            className: "auth-modal-description",
                            children: error || "请重试"
                        }),
                        /*#__PURE__*/ jsx("button", {
                            className: "auth-modal-button",
                            onClick: onClose,
                            children: "关闭"
                        })
                    ]
                })
            ]
        })
    });
}

const AuthContext = /*#__PURE__*/ createContext(null);
/**
 * AuthProvider - 全局认证状态管理
 *
 * 功能:
 * 1. 监听钱包连接状态
 * 2. 自动触发签名流程(如果配置了 autoSignOnConnect)
 * 3. 管理认证 Modal 显示
 * 4. 提供认证上下文给所有子组件
 *
 * @example
 * ```tsx
 * <WalletProvider>
 *   <AuthProvider autoSignOnConnect>
 *     <App />
 *   </AuthProvider>
 * </WalletProvider>
 * ```
 */ function AuthProvider({ children, autoSignOnConnect = false, ...authConfig }) {
    const { isConnected } = useWalletConnection();
    const { signIn, signOut, reload, reset, status, isAuthenticated, isAuthenticating, error, address } = useWalletAuth(authConfig);
    // 监听钱包连接状态,自动签名
    useEffect(()=>{
        if (autoSignOnConnect && isConnected && !isAuthenticated) {
            signIn();
        }
    }, [
        autoSignOnConnect,
        isConnected,
        isAuthenticated
    ]);
    // 监听地址变化,自动重载认证状态
    useEffect(()=>{
        reload();
    }, [
        address,
        reload
    ]);
    // 构建上下文值
    const contextValue = useMemo(()=>({
            status,
            isAuthenticated,
            isAuthenticating,
            error,
            address,
            signIn,
            signOut,
            reload,
            reset
        }), [
        status,
        isAuthenticated,
        isAuthenticating,
        error,
        address,
        signIn,
        signOut,
        reload,
        reset
    ]);
    return /*#__PURE__*/ jsxs(AuthContext.Provider, {
        value: contextValue,
        children: [
            children,
            /*#__PURE__*/ jsx(AuthModal, {
                status: status,
                error: error,
                onClose: reset
            })
        ]
    });
}
/**
 * useAuth Hook - 获取认证上下文
 */ function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}

const defaultQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false
        }
    }
});
function WalletProvider({ children, theme = "auto", queryClient = defaultQueryClient, initialState, enableAuth = false, authConfig, ...configOptions }) {
    const { config: wagmiConfig } = React.useMemo(()=>createWalletConfig(configOptions), [
        configOptions.appName,
        configOptions.projectId,
        configOptions.alchemyApiKey,
        configOptions.infuraApiKey
    ]);
    const rainbowKitTheme = React.useMemo(()=>{
        return customDarkTheme;
    }, [
        theme
    ]);
    // 根据 enableAuth 决定是否包裹 AuthProvider
    const content = enableAuth && authConfig ? /*#__PURE__*/ jsx(AuthProvider, {
        ...authConfig,
        children: children
    }) : children;
    return /*#__PURE__*/ jsx(WagmiProvider, {
        config: wagmiConfig,
        reconnectOnMount: true,
        initialState: initialState,
        children: /*#__PURE__*/ jsx(QueryClientProvider, {
            client: queryClient,
            children: /*#__PURE__*/ jsx(RainbowKitProvider, {
                theme: rainbowKitTheme,
                modalSize: "compact",
                showRecentTransactions: true,
                children: content
            })
        })
    });
}

function useWalletInfo() {
    const { address, connector, isConnected } = useAccount();
    const chainId = useChainId();
    const chains = useChains();
    const chain = chains.find((c)=>c.id === chainId);
    const { data: ensName } = useEnsName({
        address
    });
    const { data: balance, isLoading: isBalanceLoading } = useBalance({
        address: address
    });
    const formattedBalance = balance ? {
        value: balance.value,
        formatted: formatEther(balance.value),
        symbol: balance.symbol,
        decimals: balance.decimals
    } : undefined;
    return {
        address,
        isConnected,
        ensName,
        chainId,
        connector: connector ? {
            id: connector.id,
            name: connector.name,
            type: connector.type,
            icon: connector.icon
        } : undefined,
        chain,
        balance: formattedBalance,
        isBalanceLoading
    };
}

function useNetworkSwitch() {
    const chains = useChains();
    const chainId = useChainId();
    const currentChain = chains.find((c)=>c.id === chainId);
    const { switchChain, isPending, error, isSuccess, reset } = useSwitchChain();
    const switchToNetwork = (options)=>{
        if (!switchChain) {
            throw new Error("❌Network switching not supported");
        }
        try {
            switchChain({
                chainId: options.chainId
            });
        } catch (error) {
            console.error("Failed to switch network:", error);
            throw error;
        }
    };
    const isCurrentChain = (_chainId)=>{
        return chainId === _chainId;
    };
    return {
        currentChain,
        switchToNetwork,
        isPending,
        error,
        isSuccess,
        reset,
        isCurrentChain,
        canSwitchNetwork: !!switchChain
    };
}

/**
 * 监听网络和账户变化的 Hook
 *
 * 当用户在 MetaMask 等钱包中切换网络或账户时，会自动触发回调
 *
 * @example
 * ```tsx
 * useWatchNetwork({
 *   onNetworkChange: (chainId) => {
 *     console.log('网络切换到:', chainId);
 *     // 重新获取数据或更新 UI
 *   },
 *   onAccountChange: (address) => {
 *     console.log('账户切换到:', address);
 *   }
 * });
 * ```
 */ function useWatchNetwork({ onNetworkChange, onAccountChange } = {}) {
    const chainId = useChainId();
    const { address } = useAccount();
    // 监听网络变化
    useEffect(()=>{
        if (onNetworkChange && chainId) {
            console.log(`🔄 Network changed to chainId: ${chainId}`);
            onNetworkChange(chainId);
        }
    }, [
        chainId,
        onNetworkChange
    ]);
    // 监听账户变化
    useEffect(()=>{
        if (onAccountChange) {
            console.log(`🔄 Account changed to: ${address || "disconnected"}`);
            onAccountChange(address);
        }
    }, [
        address,
        onAccountChange
    ]);
    return {
        currentChainId: chainId,
        currentAddress: address
    };
}

function useContractRead({ address, abi, functionName, args, chainId, enabled = true, cacheTime = 0, staleTime = 0 }) {
    const { data, ...result } = useReadContract({
        address,
        abi,
        functionName,
        args,
        chainId,
        query: {
            enabled,
            gcTime: cacheTime,
            staleTime
        }
    });
    return {
        data: data,
        ...result
    };
}

function useContractWrite({ address, abi, functionName, args, value, chainId, enabled = true, gasLimit }) {
    const { writeContract, writeContractAsync, ...returnTypes } = useWriteContract();
    const receipt = useWaitForTransactionReceipt({
        hash: returnTypes.data,
        query: {
            enabled: !!returnTypes.data
        }
    });
    const write = (overrides)=>{
        if (!enabled) return;
        writeContract({
            address,
            abi,
            functionName,
            args: overrides?.args || args,
            value: overrides?.value || value,
            chainId,
            gas: overrides?.gas || gasLimit
        });
    };
    const writeAsync = async (overrides)=>{
        if (!enabled) return;
        return await writeContractAsync({
            address,
            abi,
            functionName,
            args: overrides?.args || args,
            value: overrides?.value || value,
            chainId,
            gas: overrides?.gas || gasLimit
        });
    };
    return {
        write,
        writeAsync,
        receipt,
        ...returnTypes
    };
}

var ERC20Abi = [
    {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [
            {
                name: "",
                type: "string"
            }
        ],
        type: "function"
    },
    {
        constant: true,
        inputs: [],
        name: "symbol",
        outputs: [
            {
                name: "",
                type: "string"
            }
        ],
        type: "function"
    },
    {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [
            {
                name: "",
                type: "uint8"
            }
        ],
        type: "function"
    },
    {
        constant: true,
        inputs: [],
        name: "totalSupply",
        outputs: [
            {
                name: "",
                type: "uint256"
            }
        ],
        type: "function"
    },
    {
        constant: true,
        inputs: [
            {
                name: "_owner",
                type: "address"
            }
        ],
        name: "balanceOf",
        outputs: [
            {
                name: "balance",
                type: "uint256"
            }
        ],
        type: "function"
    },
    {
        constant: false,
        inputs: [
            {
                name: "_to",
                type: "address"
            },
            {
                name: "_value",
                type: "uint256"
            }
        ],
        name: "transfer",
        outputs: [
            {
                name: "",
                type: "bool"
            }
        ],
        type: "function"
    },
    {
        constant: false,
        inputs: [
            {
                name: "_from",
                type: "address"
            },
            {
                name: "_to",
                type: "address"
            },
            {
                name: "_value",
                type: "uint256"
            }
        ],
        name: "transferFrom",
        outputs: [
            {
                name: "",
                type: "bool"
            }
        ],
        type: "function"
    },
    {
        constant: false,
        inputs: [
            {
                name: "_spender",
                type: "address"
            },
            {
                name: "_value",
                type: "uint256"
            }
        ],
        name: "approve",
        outputs: [
            {
                name: "",
                type: "bool"
            }
        ],
        type: "function"
    },
    {
        constant: true,
        inputs: [
            {
                name: "_owner",
                type: "address"
            },
            {
                name: "_spender",
                type: "address"
            }
        ],
        name: "allowance",
        outputs: [
            {
                name: "",
                type: "uint256"
            }
        ],
        type: "function"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: "from",
                type: "address"
            },
            {
                indexed: true,
                name: "to",
                type: "address"
            },
            {
                indexed: false,
                name: "value",
                type: "uint256"
            }
        ],
        name: "Transfer",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: "owner",
                type: "address"
            },
            {
                indexed: true,
                name: "spender",
                type: "address"
            },
            {
                indexed: false,
                name: "value",
                type: "uint256"
            }
        ],
        name: "Approval",
        type: "event"
    }
];

var CourseContractAbi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_ydToken",
                type: "address"
            },
            {
                internalType: "address",
                name: "_platformAddress",
                type: "address"
            }
        ],
        stateMutability: "nonpayable",
        type: "constructor"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "courseId",
                type: "uint256"
            },
            {
                indexed: true,
                internalType: "address",
                name: "instructor",
                type: "address"
            },
            {
                indexed: false,
                internalType: "string",
                name: "title",
                type: "string"
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "price",
                type: "uint256"
            }
        ],
        name: "CourseCreated",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "courseId",
                type: "uint256"
            },
            {
                indexed: true,
                internalType: "address",
                name: "student",
                type: "address"
            },
            {
                indexed: true,
                internalType: "address",
                name: "instructor",
                type: "address"
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "price",
                type: "uint256"
            }
        ],
        name: "CoursePurchased",
        type: "event"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "student",
                type: "address"
            },
            {
                internalType: "uint256[]",
                name: "courseIds",
                type: "uint256[]"
            }
        ],
        name: "batchCheckAccess",
        outputs: [
            {
                internalType: "bool[]",
                name: "",
                type: "bool[]"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        name: "courseStudentCount",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        name: "courseStudents",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        name: "courses",
        outputs: [
            {
                internalType: "uint256",
                name: "id",
                type: "uint256"
            },
            {
                internalType: "string",
                name: "title",
                type: "string"
            },
            {
                internalType: "address",
                name: "instructor",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "price",
                type: "uint256"
            },
            {
                internalType: "bool",
                name: "isPublished",
                type: "bool"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "title",
                type: "string"
            },
            {
                internalType: "address",
                name: "instructor",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "price",
                type: "uint256"
            }
        ],
        name: "createCourse",
        outputs: [
            {
                internalType: "uint256",
                name: "courseId",
                type: "uint256"
            }
        ],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "courseId",
                type: "uint256"
            }
        ],
        name: "getCourse",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "id",
                        type: "uint256"
                    },
                    {
                        internalType: "string",
                        name: "title",
                        type: "string"
                    },
                    {
                        internalType: "address",
                        name: "instructor",
                        type: "address"
                    },
                    {
                        internalType: "uint256",
                        name: "price",
                        type: "uint256"
                    },
                    {
                        internalType: "bool",
                        name: "isPublished",
                        type: "bool"
                    }
                ],
                internalType: "struct ICourseContract.Course",
                name: "",
                type: "tuple"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "courseId",
                type: "uint256"
            }
        ],
        name: "getCourseStudentCount",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "courseId",
                type: "uint256"
            }
        ],
        name: "getCourseStudents",
        outputs: [
            {
                internalType: "address[]",
                name: "",
                type: "address[]"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "instructor",
                type: "address"
            }
        ],
        name: "getInstructorCourses",
        outputs: [
            {
                internalType: "uint256[]",
                name: "",
                type: "uint256[]"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "student",
                type: "address"
            }
        ],
        name: "getStudentCourses",
        outputs: [
            {
                internalType: "uint256[]",
                name: "",
                type: "uint256[]"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "getTotalCourses",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "student",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "courseId",
                type: "uint256"
            }
        ],
        name: "hasAccess",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        name: "hasPurchased",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "platformAddress",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "courseId",
                type: "uint256"
            }
        ],
        name: "purchaseCourse",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        name: "studentCourses",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "totalCourses",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "ydToken",
        outputs: [
            {
                internalType: "contract IERC20",
                name: "",
                type: "address"
            }
        ],
        stateMutability: "view",
        type: "function"
    }
];

var SimpleYDContractAbi = [
    {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address"
            },
            {
                indexed: true,
                internalType: "address",
                name: "spender",
                type: "address"
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256"
            }
        ],
        name: "Approval",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address"
            },
            {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address"
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256"
            }
        ],
        name: "Transfer",
        type: "event"
    },
    {
        inputs: [],
        name: "EXCHANGE_RATE",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "ownerAddr",
                type: "address"
            },
            {
                internalType: "address",
                name: "spender",
                type: "address"
            }
        ],
        name: "allowance",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "spender",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256"
            }
        ],
        name: "approve",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool"
            }
        ],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "account",
                type: "address"
            }
        ],
        name: "balanceOf",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address[]",
                name: "recipients",
                type: "address[]"
            },
            {
                internalType: "uint256[]",
                name: "amounts",
                type: "uint256[]"
            }
        ],
        name: "batchTransfer",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [],
        name: "decimals",
        outputs: [
            {
                internalType: "uint8",
                name: "",
                type: "uint8"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "exchangeETHForTokens",
        outputs: [],
        stateMutability: "payable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "to",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256"
            }
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [],
        name: "name",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "owner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "symbol",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "totalSupply",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "to",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256"
            }
        ],
        name: "transfer",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool"
            }
        ],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "from",
                type: "address"
            },
            {
                internalType: "address",
                name: "to",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256"
            }
        ],
        name: "transferFrom",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool"
            }
        ],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "newOwner",
                type: "address"
            }
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    }
];

const ERC20_ABI = ERC20Abi;
const COURSE_CONTRACT_ABI = CourseContractAbi;
const SIMPLE_YD_TOKEN_ABI = SimpleYDContractAbi;

function useERC20({ address, spenderAddress, enabled = true }) {
    const { address: userAddress } = useAccount();
    /* ========== 辅助方法 ========== */ /**
   * 解析金额
   * 将字符串形式的金额转换为 bigint（考虑代币精度）
   * @param amount - 字符串形式的金额，如 '100.5'
   * @returns bigint 类型的代币数量
   * @throws 如果代币精度未加载，抛出错误
   */ const parseAmount = (amount)=>{
        if (!decimals) throw new Error("Decimals not loaded");
        return parseUnits(amount, decimals);
    };
    /* ========== 读取合约数据 ========== */ // 读取代币总供应量
    const { data: totalSupply } = useContractRead({
        address,
        abi: ERC20_ABI,
        functionName: "totalSupply",
        enabled
    });
    // 读取当前用户的代币余额
    const { data: balance, refetch: refetchBalance } = useContractRead({
        address,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: userAddress ? [
            userAddress
        ] : undefined,
        enabled: enabled && !!userAddress
    });
    // 读取代币精度
    const { data: decimals } = useContractRead({
        address,
        abi: ERC20_ABI,
        functionName: "decimals",
        enabled
    });
    // 读取当前用户对指定地址的授权额度
    const { data: allowance, refetch: refetchAllowance } = useContractRead({
        address,
        abi: ERC20_ABI,
        functionName: "allowance",
        args: userAddress && spenderAddress ? [
            userAddress,
            spenderAddress
        ] : undefined,
        enabled: enabled && !!userAddress && !!spenderAddress
    });
    /* ========== 合约写入方法 ========== */ // 转账
    const transferWrite = useContractWrite({
        address,
        abi: ERC20_ABI,
        functionName: "transfer"
    });
    /**
   * 转账函数
   * 将代币从当前用户转账到指定地址
   * @param to - 接收地址
   * @param amount - 转账金额（字符串形式，如 '100.5'）
   * @returns 交易的 Promise
   * @throws 如果转账功能不可用，抛出错误
   */ const transfer = async (to, amount)=>{
        if (!transferWrite.writeAsync) throw new Error("Transfer not available");
        const parsedAmount = parseAmount(amount);
        return transferWrite.writeAsync({
            args: [
                to,
                parsedAmount
            ]
        });
    };
    // 授权
    const approveWrite = useContractWrite({
        address,
        abi: ERC20_ABI,
        functionName: "approve"
    });
    /**
   * 授权函数
   * 授权指定地址可以支配的代币数量
   * @param spender - 被授权地址
   * @param amount - 授权金额（字符串形式，如 '1000'）
   * @returns 交易的 Promise
   * @throws 如果授权功能不可用，抛出错误
   */ const approve = async (spender, amount)=>{
        if (!approveWrite.writeAsync) throw new Error("Approve not available");
        const parsedAmount = parseAmount(amount);
        return approveWrite.writeAsync({
            args: [
                spender,
                parsedAmount
            ]
        });
    };
    // 代理转账函数的写入 Hook
    const transferFromWrite = useContractWrite({
        address,
        abi: ERC20_ABI,
        functionName: "transferFrom"
    });
    /**
   * 代理转账函数
   * 从指定地址转账到另一个地址（需要提前授权）
   * @param from - 转出地址
   * @param to - 接收地址
   * @param amount - 转账金额（字符串形式，如 '50'）
   * @returns 交易的 Promise
   * @throws 如果代理转账功能不可用，抛出错误
   */ const transferFrom = async (from, to, amount)=>{
        if (!transferFromWrite.writeAsync) throw new Error("TransferFrom not available");
        const parsedAmount = parseAmount(amount);
        return transferFromWrite.writeAsync({
            args: [
                from,
                to,
                parsedAmount
            ]
        });
    };
    return {
        /* 代币基本信息 */ totalSupply: totalSupply,
        balance: balance,
        allowance: allowance,
        transferReceipt: transferWrite.receipt,
        approveReceipt: approveWrite.receipt,
        transferFromReceipt: transferFromWrite.receipt,
        /* 方法 */ refetchBalance,
        refetchAllowance,
        transfer,
        approve,
        transferFrom
    };
}

/**
 * 🚀 链式调用 API：创建合约交互工厂（推荐）
 *
 * @param address 合约地址
 * @param abi 合约 ABI
 * @returns 返回链式调用对象
 *
 * @example
 * ✨ 创建工厂
 * const factory = contractFactory(CONTRACT_ADDRESS, CONTRACT_ABI)
 *
 * 📖 读取方法
 * const balanceOf = factory.read<bigint>('balanceOf')
 * const { data } = balanceOf(userAddress)
 *
 * ✍️ 写入方法（简单）
 * const transfer = factory.write('transfer')
 * await transfer.send(toAddress, amount)
 * console.log(transfer.receipt)
 *
 * ✍️ 写入方法（带 value/gas）
 * const purchaseCourse = factory.write('purchaseCourse')
 * await purchaseCourse.send(courseId, {
 *   value: parseEther('0.1'),
 *   gas: 100000n
 * })
 */ function contractFactory(address, abi) {
    return {
        /**
     * 创建读取方法
     * @param functionName 合约函数名
     * @returns 返回可调用的读取函数
     *
     * @example
     * const balanceOf = factory.read<bigint>('balanceOf')
     * const { data } = balanceOf(userAddress)
     */ read: (functionName, enabled = true)=>{
            return (...args)=>{
                const hasArgs = args.length > 0 && args.every((arg)=>arg !== undefined);
                return useContractRead({
                    address,
                    abi,
                    functionName,
                    args: hasArgs ? args : undefined,
                    enabled: enabled
                });
            };
        },
        /**
     * 创建写入方法
     * @param functionName 合约函数名
     * @returns 返回对象 { send, receipt, writer }
     *
     * @example
     * - 简单调用
     * const transfer = factory.write('transfer')
     * await transfer.send(toAddress, amount)
     *
     * - 带 overrides (value, gas, etc.)
     * await transfer.send(toAddress, amount, {
     *   value: parseEther('1.0'),
     *   gas: 100000n
     * })
     *
     * - Payable 函数
     * const purchaseCourse = factory.write('purchaseCourse')
     * await purchaseCourse.send(courseId, {
     *   value: parseEther('0.1')
     * })
     */ write: (functionName)=>{
            const writer = useContractWrite({
                address,
                abi,
                functionName
            });
            /**
       * 发送交易
       * @param args 合约函数参数 + 可选的Payable函数参数
       * @returns 交易 hash
       *
       * 支持两种调用方式：
       * 1. send(arg1, arg2, ...)
       * 2. send(arg1, arg2, ..., { value, gas, ... })
       */ const send = async (...args)=>{
                if (!writer.writeAsync) {
                    throw new Error(`Function ${functionName} is not writable`);
                }
                // 🔍 检测最后一个参数是否是 overrides
                // overrides 的特征：包含 value/gas/gasPrice 等字段的普通对象
                let contractArgs = args;
                let overrides = undefined;
                if (args.length > 0) {
                    const lastArg = args[args.length - 1];
                    // 检查是否是 overrides 对象
                    const isOverrides = lastArg && typeof lastArg === "object" && !Array.isArray(lastArg) && // 检查是否包含 overrides 的常见字段
                    (lastArg.value !== undefined || lastArg.gas !== undefined);
                    if (isOverrides) {
                        overrides = lastArg;
                        contractArgs = args.slice(0, -1);
                    }
                }
                return writer.writeAsync({
                    args: contractArgs,
                    value: overrides?.value,
                    gas: overrides?.gas
                });
            };
            return {
                send,
                receipt: writer.receipt,
                writer
            };
        }
    };
}

const YD_CONTRACT_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
function useSimpleYDToken({ address = YD_CONTRACT_ADDRESS, spenderAddress, enabled = true }) {
    const { address: userAddress } = useAccount();
    const [estGasTo, setEstGasTo] = useState();
    const [estGasValue, setEstGasValue] = useState();
    const { data: gasEstimate, refetch: refetchEstimateGas } = useEstimateGas({
        account: userAddress,
        to: estGasTo,
        value: estGasValue,
        query: {
            enabled: false
        }
    });
    /* ========== 辅助方法 ========== */ /**
   * 解析金额
   * 将字符串形式的金额转换为 bigint（考虑代币精度）
   * @param amount - 字符串形式的金额，如 '100.5'
   * @returns bigint 类型的代币数量
   * @throws 如果代币精度未加载，抛出错误
   */ const parseAmount = (amount)=>{
        if (!decimals) throw new Error("Decimals not loaded");
        return parseUnits(amount, decimals);
    };
    const prepareRefetchEstimateGas = async (to, value)=>{
        setEstGasTo(to);
        setEstGasValue(value);
        // 等待 React 下一次渲染周期，确保 state 更新
        await new Promise((resolve)=>setTimeout(resolve, 0));
        console.log(`🔢 请求参数: to->${to} / value->${value}`);
        // 然后调用 refetch
        await refetchEstimateGas();
        console.log("⛽️ Estimate Gas:", gasEstimate);
        // ✅ 立即清理
        setEstGasTo(undefined);
        setEstGasValue(undefined);
    };
    const factory = contractFactory(address, SIMPLE_YD_TOKEN_ABI);
    /* ========== 读取合约数据 ========== */ // 读取代币总供应量
    const { data: totalSupply } = factory.read("totalSupply")();
    // 读取当前用户的代币余额
    const { data: balance, refetch: refetchBalance } = factory.read("balanceOf", enabled && !!userAddress)(userAddress);
    // 调试信息：打印余额和用户地址
    console.log("📊 [useSimpleYDToken] 合约地址:", address);
    console.log("📊 [useSimpleYDToken] 用户地址:", userAddress);
    console.log("📊 [useSimpleYDToken] 余额数据:", balance);
    console.log("📊 [useSimpleYDToken] enabled:", enabled);
    // 读取代币精度
    const { data: decimals } = factory.read("decimals")();
    // 读取当前用户对指定地址的授权额度
    const { data: allowance, refetch: refetchAllowance } = factory.read("allowance")(userAddress, spenderAddress);
    // 获取质押信息
    const getStakeInfo = (user)=>{
        return factory.read("getStakeInfo")(user);
    };
    // 计算待领取奖励
    const calculatePendingReward = (user)=>{
        return factory.read("calculatePendingReward")(user);
    };
    // 查检是否可解除质押
    const canUnstake = (user)=>{
        return factory.read("canUnstake")(user);
    };
    /* ========== 合约写入方法 ========== */ // 转账
    const transferWriter = factory.write("transfer");
    /**
   * 转账函数
   * 将代币从当前用户转账到指定地址
   * @param to - 接收地址
   * @param amount - 转账金额（字符串形式，如 '100.5'）
   * @returns 交易的 Promise
   * @throws 如果转账功能不可用，抛出错误
   */ const transfer = async (to, amount)=>{
        const parsedAmount = parseAmount(amount);
        await prepareRefetchEstimateGas(to, parsedAmount);
        return transferWriter.send(to, parsedAmount, {
            gas: gasEstimate
        });
    };
    // 授权
    const approveWriter = factory.write("approve");
    /**
   * 授权函数
   * 授权指定地址可以支配的代币数量
   * @param spender - 被授权地址
   * @param amount - 授权金额（字符串形式，如 '1000'）
   * @returns 交易的 Promise
   * @throws 如果授权功能不可用，抛出错误
   */ const approve = async (spender, amount)=>{
        const parsedAmount = parseAmount(amount);
        // await prepareRefetchEstimateGas(YD_CONTRACT_ADDRESS, undefined);
        // , {
        //       gas: gasEstimate,
        //     }
        return approveWriter.send(spender, parsedAmount);
    };
    // 代理转账函数的写入 Hook
    const transferFromWriter = factory.write("transferFrom");
    /**
   * 代理转账函数
   * 从指定地址转账到另一个地址（需要提前授权）
   * @param from - 转出地址
   * @param to - 接收地址
   * @param amount - 转账金额（字符串形式，如 '50'）
   * @returns 交易的 Promise
   * @throws 如果代理转账功能不可用，抛出错误
   */ const transferFrom = async (from, to, amount)=>{
        const parsedAmount = parseAmount(amount);
        await prepareRefetchEstimateGas(to, parsedAmount);
        return transferFromWriter.send(from, to, parsedAmount);
    };
    // 兑换YD币
    const exchangeETHForTokensWriter = factory.write("exchangeETHForTokens");
    /**
   * 兑换YD币 (ETH -> YD)
   * @param ether 兑换的ETH金额
   * @returns
   */ const exchangeETHForTokens = async (ether)=>{
        await prepareRefetchEstimateGas(YD_CONTRACT_ADDRESS, parseEther(ether));
        return exchangeETHForTokensWriter.send({
            value: parseEther(ether),
            gas: gasEstimate
        });
    };
    // 质押YD代币
    const stakeWriter = factory.write("stake");
    /**
   * 质押YD代币
   * @param amount 质押数量
   * @param lockPeriod 锁定期（30/90/180天）
   * @returns
   */ const stake = async (amount, lockPeriod)=>{
        return stakeWriter.send(amount, lockPeriod);
    };
    // 解除质押
    const unstakeWriter = factory.write("unstake");
    /**
   * 解除质押
   * @param forceUnlock 是否强制解锁（会扣除20%惩罚）
   * @returns
   */ const unstake = async (forceUnlock)=>{
        return unstakeWriter.send(forceUnlock);
    };
    // 领取质押收益
    const claimRewardWriter = factory.write("claimReward");
    /**
   * 领取质押收益
   * @returns
   */ const claimReward = async ()=>{
        return claimRewardWriter.send();
    };
    return {
        /* 代币基本信息 */ totalSupply: totalSupply,
        balance: balance,
        allowance: allowance,
        transferReceipt: transferWriter.receipt,
        approveReceipt: approveWriter.receipt,
        transferFromReceipt: transferFromWriter.receipt,
        exchangeETHForTokensReceipt: exchangeETHForTokensWriter.receipt,
        stakeReceipt: stakeWriter.receipt,
        unstakeReceipt: unstakeWriter.receipt,
        claimRewardReceipt: claimRewardWriter.receipt,
        /* 方法 */ refetchBalance,
        refetchAllowance,
        getStakeInfo,
        calculatePendingReward,
        canUnstake,
        transfer,
        approve,
        transferFrom,
        exchangeETHForTokens,
        stake,
        unstake,
        claimReward
    };
}

const COURSE_CONTRACT_ADDRESS = "0x0a42F4f8Cb23460BDeD2e18475920Bdb6df5641d";
function useCourseContract({ address = COURSE_CONTRACT_ADDRESS, tokenDecimals = 18 }) {
    const factory = contractFactory(address, COURSE_CONTRACT_ABI);
    // ========== 工具函数 ==========
    /**
   * 解析价格
   * 将字符串形式的价格转换为 bigint（考虑代币精度）
   */ const parsePrice = (price)=>{
        return parseUnits(price, tokenDecimals);
    };
    /* ========== 读取合约数据 ========== */ /**
   * 检查用户是否有课程访问权限
   * @param studentAddress 学生地址
   * @param courseId 课程ID
   */ const hasAccess = (student, courseId)=>{
        return factory.read("hasAccess")(student, courseId);
    };
    /**
   * 获取课程信息
   * @param courseId 课程ID
   */ const getCourse = (courseId)=>{
        return factory.read("getCourse")(courseId);
    };
    /**
   * 获取学生购买的所有课程
   * @param studentAddress 学生地址
   */ const getStudentCourses = (student)=>{
        return factory.read("getStudentCourses")(student);
    };
    /**
   * 获取课程的所有学生
   * @param courseId 课程ID
   * @returns
   */ const getCourseStudents = (courseId)=>{
        return factory.read("getCourseStudents")(courseId);
    };
    /**
   * 获取讲师的所有课程
   * @param instructorAddress 讲师地址
   * @returns
   */ const getInstructorCourses = (instructor)=>{
        return factory.read("getInstructorCourses")(instructor);
    };
    /**
   * 获取课程总数
   * @returns
   */ const getTotalCourses = ()=>{
        return factory.read("getTotalCourses")();
    };
    /**
   * 获取课程学生数量
   * @param courseId 课程ID
   * @returns
   */ const getCourseStudentCount = (courseId)=>{
        return factory.read("getCourseStudentCount")(courseId);
    };
    /**
   * 批量检查访问权限
   * @param student 学生地址
   * @param courseIds 课程ID数组
   * @returns
   */ const batchCheckAccess = (student, courseIds)=>{
        return factory.read("batchCheckAccess")(student, courseIds);
    };
    /**
   * 获取课程学习进度
   * @param student 学生地址
   * @param courseId 课程ID
   * @returns
   */ const getCourseProgress = (student, courseId)=>{
        return factory.read("getProgress")(student, courseId);
    };
    /**
   * 获取退款请求信息
   * @param requestId 课程ID
   * @returns
   */ const getRefundRequest = (requestId)=>{
        return factory.read("getRefundRequest")(requestId);
    };
    /**
   * 获取学生的退款资格详细信息
   * @param student 学生ID
   * @param courseId 课程ID
   * @return eligible: boolean 是否可以退款
   * @return reason: string 不能退款的原因（空表示可以）
   * @return refundAmount: bigint 可退款金额
   * @return daysRemaining: bigint 剩余退款天数
   * @return progressPercent: bigint 学习进度百分比
   * @return timeUntilEligible: bigint 距离满足最小持有时间的秒数
   */ const getRefundEligibilityDetails = (student, courseId)=>{
        return factory.read("getRefundEligibilityDetails")(student, courseId);
    };
    /**
   * 检查是否为认证讲师
   * @param instructor 讲师地址
   * @return 是否认证
   */ const isCertifiedInstructor = (instructor)=>{
        return factory.read("isCertifiedInstructor")(instructor);
    };
    /* ========== 写入合约数据 ========== */ // 创建课程
    const createCourseWriter = factory.write("createCourse");
    /**
   * 创建课程
   * @param title 课程标题
   * @param instructor 课程价格
   * @param price
   * @returns
   */ const createCourse = async (title, instructor, price, totalLessons)=>{
        return await createCourseWriter.send(title, instructor, parsePrice(price), totalLessons);
    };
    // 购买课程
    const purchaseCourseWriter = factory.write("purchaseCourse");
    /**
   * 购买课程
   * @param courseId 课程ID
   * @returns
   */ const purchaseCourse = async (courseId)=>{
        return await purchaseCourseWriter.send(courseId);
    };
    // 更新课程价格
    const updateCoursePriceWriter = factory.write("updateCoursePrice");
    /**
   * 更新课程价格
   * @param courseId 课程ID
   * @param newPrice 新的课程价格
   * @returns
   */ const updateCoursePrice = async (courseId, newPrice)=>{
        return await updateCoursePriceWriter.send(courseId, parsePrice(newPrice));
    };
    // 更新学习进度
    const updateCourseProgressWriter = factory.write("updateProgress");
    /**
   * 更新学习进度
   * @param courseId 课程ID
   * @param completedLessons 课程进度 （应该是百分比的整数表示，比如50表示50%）
   * @returns
   */ const updateCourseProgress = async (courseId, completedLessons)=>{
        return await updateCourseProgressWriter.send(courseId, completedLessons);
    };
    // 请求退款
    const requestRefundWriter = factory.write("requestRefund");
    /**
   * 请求退款
   * @param courseId 课程ID
   * @returns
   */ const requestRefund = async (courseId)=>{
        return await requestRefundWriter.send(courseId);
    };
    // 认证讲师
    const certifyInstructorWriter = factory.write("certifyInstructor");
    /**
   * 认证讲师（仅平台管理员）
   * @param instructor 讲师地址
   * @returns
   */ const certifyInstructor = async (instructor)=>{
        return await certifyInstructorWriter.send(instructor);
    };
    // 撤销讲师认证
    const revokeInstructorWriter = factory.write("revokeInstructor");
    /**
   * 撤销讲师认证（仅平台管理员）
   * @param instructor 讲师地址
   * @returns
   */ const revokeInstructor = async (instructor)=>{
        return await revokeInstructorWriter.send(instructor);
    };
    // 批量认证讲师
    const batchCertifyInstructorsWriter = factory.write("batchCertifyInstructors");
    /**
   * 批量认证讲师（仅平台管理员）
   * @param instructors 讲师地址数组
   * @returns
   */ const batchCertifyInstructors = async (instructors)=>{
        return await batchCertifyInstructorsWriter.send(instructors);
    };
    // 更新平台地址
    const updatePlatformAddressWriter = factory.write("updatePlatformAddress");
    /**
   * 更新平台地址（仅平台管理员）
   * @param newPlatformAddress 新平台地址
   */ const updatePlatformAddress = async (newPlatformAddress)=>{
        return await updatePlatformAddressWriter.send(newPlatformAddress);
    };
    // 更新课程
    const updateCourseWriter = factory.write("updateCourse");
    /**
   * 更新课程信息（仅讲师）
   * @param courseId 课程ID
   * @param title 新标题
   * @param totalLessons 新课时数
   */ const updateCourse = async (courseId, title, totalLessons)=>{
        return await updateCourseWriter.send(courseId, title, totalLessons);
    };
    // 发布课程
    const publishCourseWriter = factory.write("publishCourse");
    /**
   * 发布课程（仅讲师）
   * @param courseId 课程ID
   * @returns
   */ const publishCourse = async (courseId)=>{
        return await publishCourseWriter.send(courseId);
    };
    // 取消发布课程
    const unpublishCourseWriter = factory.write("unpublishCourse");
    /**
   * 取消发布课程（仅讲师）
   * @param courseId 课程ID
   */ const unpublishCourse = async (courseId)=>{
        return await unpublishCourseWriter.send(courseId);
    };
    // 删除课程
    const deleteCourseWriter = factory.write("deleteCourse");
    /**
   * @dev 删除课程（仅讲师，且无学生购买）
   * @param courseId 课程ID
   */ const deleteCourse = async (courseId)=>{
        return await deleteCourseWriter.send(courseId);
    };
    return {
        // ========== 读取方法 ==========
        hasAccess,
        getCourse,
        getStudentCourses,
        getCourseStudents,
        getInstructorCourses,
        getTotalCourses,
        getCourseStudentCount,
        batchCheckAccess,
        getCourseProgress,
        getRefundRequest,
        getRefundEligibilityDetails,
        isCertifiedInstructor,
        // ========== 写入方法 ==========
        createCourse,
        purchaseCourse,
        updateCoursePrice,
        updateCourseProgress,
        requestRefund,
        certifyInstructor,
        revokeInstructor,
        batchCertifyInstructors,
        updatePlatformAddress,
        updateCourse,
        publishCourse,
        unpublishCourse,
        deleteCourse,
        // ========== Receipt ==========
        createCourseReceipt: createCourseWriter.receipt,
        purchaseCourseReceipt: purchaseCourseWriter.receipt,
        updateCoursePriceReceipt: updateCoursePriceWriter.receipt,
        updateCourseProgressReceipt: updateCourseProgressWriter.receipt,
        requestRefundReceipt: requestRefundWriter.receipt,
        certifyInstructorReceipt: certifyInstructorWriter.receipt,
        revokeInstructorReceipt: revokeInstructorWriter.receipt,
        batchCertifyInstructorsReceipt: batchCertifyInstructorsWriter.receipt,
        updatePlatformAddressReceipt: updatePlatformAddressWriter.receipt,
        updateCourseReceipt: updateCourseWriter.receipt,
        publishCourseReceipt: publishCourseWriter.receipt,
        unpublishCourseReceipt: unpublishCourseWriter.receipt,
        deleteCourseReceipt: deleteCourseWriter.receipt
    };
}

var css_248z$1 = "/* Profile Menu */\n.profile__menu-wrapper {\n  position: relative;\n}\n\n.profile__menu-trigger {\n  display: flex;\n  height: 2.5rem;\n  width: 2.5rem;\n  align-items: center;\n  justify-content: center;\n  border-radius: 9999px;\n  background-color: white;\n  color: #6a6d94;\n  border: 1px solid #e7e5fb;\n  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n  transition: transform 0.2s;\n  cursor: pointer;\n}\n\n.profile__menu-trigger:hover {\n  transform: translateY(-1px);\n}\n\n.profile__avatar {\n  border-radius: 50%;\n}\n\n/* Wallet Dropdown */\n.wallet-dropdown {\n  position: absolute;\n  right: 0;\n  top: 2.8rem;\n  width: 18rem;\n  border-radius: 1rem;\n  background-color: white;\n  padding: 1rem;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  color: #2b2558;\n  box-shadow: 0 24px 60px rgba(154, 161, 255, 0.18);\n  border: 1px solid #ecebff;\n}\n\n.wallet-header {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n}\n\n.wallet-label {\n  font-size: 0.75rem;\n  line-height: 1rem;\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n  color: #8b8eb5;\n}\n\n.wallet-value {\n  margin-top: 0.25rem;\n  font-weight: 600;\n}\n\n.wallet-chain-id {\n  border-radius: 9999px;\n  background-color: #f4f4ff;\n  padding: 0.25rem 0.75rem;\n  font-size: 0.75rem;\n  line-height: 1rem;\n  font-weight: 500;\n  color: #5f6094;\n}\n\n.wallet-section {\n  margin-top: 1rem;\n}\n\n.wallet-address-box {\n  margin-top: 0.25rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  border-radius: 0.75rem;\n  background-color: #f8f8ff;\n  padding: 0.5rem 0.75rem;\n}\n\n.wallet-address-text {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  color: #2b2558;\n}\n\n.copy-button {\n  border-radius: 9999px;\n  padding: 0.25rem;\n  color: #6a6d94;\n  transition: background-color 0.2s;\n  border: none;\n  background: transparent;\n  cursor: pointer;\n}\n\n.copy-button:hover {\n  background-color: white;\n}\n\n/* Balance Info Box */\n.balance-info-box {\n  margin-top: 1rem;\n  border-radius: 0.75rem;\n  background-color: #f9f9ff;\n  padding: 0.75rem;\n}\n\n.balance-info-label {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-size: 0.75rem;\n  line-height: 1rem;\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n  color: #8b8eb5;\n}\n\n.balance-info-amount {\n  margin-top: 0.5rem;\n  font-size: 1.125rem;\n  line-height: 1.75rem;\n  font-weight: 600;\n}\n\n/* Disconnect Button */\n.disconnect-button {\n  margin-top: 1rem;\n  width: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  padding: 0.5rem 1rem;\n  border-radius: 0.5rem;\n  background-color: #f3f4f6;\n  color: #374151;\n  font-weight: 500;\n  border: none;\n  cursor: pointer;\n  transition: background-color 0.2s;\n}\n\n.disconnect-button:hover:not(:disabled) {\n  background-color: #e5e7eb;\n}\n\n.disconnect-button:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n.disconnect-button.loading {\n  opacity: 0.7;\n}\n";
styleInject(css_248z$1);

const Profile = ({ account, chain, openAccountModal })=>{
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const { disconnect } = useWalletConnection();
    useEffect(()=>{
        const handleClickOutside = (event)=>{
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return ()=>{
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const handleDisconnect = ()=>{
        setIsMenuOpen(false);
        disconnect();
    };
    const handleCopyAddress = ()=>{
        navigator.clipboard.writeText("");
    };
    return /*#__PURE__*/ jsxs("div", {
        className: "profile__menu-wrapper",
        ref: menuRef,
        children: [
            /*#__PURE__*/ jsx("button", {
                onClick: ()=>setIsMenuOpen(!isMenuOpen),
                type: "button",
                className: "profile__menu-trigger profile__avatar",
                "aria-label": "Account menu",
                children: /*#__PURE__*/ jsxs("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "20",
                    height: "20",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    children: [
                        /*#__PURE__*/ jsx("path", {
                            d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
                        }),
                        /*#__PURE__*/ jsx("circle", {
                            cx: "12",
                            cy: "7",
                            r: "4"
                        })
                    ]
                })
            }),
            isMenuOpen && // Wallet Dropdown (conditionally shown)
            /*#__PURE__*/ jsxs("div", {
                className: "wallet-dropdown",
                id: "walletDropdown",
                children: [
                    /*#__PURE__*/ jsxs("div", {
                        className: "wallet-header",
                        children: [
                            /*#__PURE__*/ jsxs("div", {
                                children: [
                                    /*#__PURE__*/ jsx("div", {
                                        className: "wallet-label",
                                        children: "网络"
                                    }),
                                    /*#__PURE__*/ jsx("div", {
                                        className: "wallet-value",
                                        children: chain.name
                                    })
                                ]
                            }),
                            /*#__PURE__*/ jsx("div", {
                                className: "wallet-chain-id",
                                children: "ID 1"
                            })
                        ]
                    }),
                    /*#__PURE__*/ jsxs("div", {
                        className: "wallet-section",
                        children: [
                            /*#__PURE__*/ jsx("div", {
                                className: "wallet-label",
                                children: "地址"
                            }),
                            /*#__PURE__*/ jsxs("div", {
                                className: "wallet-address-box",
                                children: [
                                    /*#__PURE__*/ jsx("span", {
                                        className: "wallet-address-text",
                                        children: account.displayName
                                    }),
                                    /*#__PURE__*/ jsx("button", {
                                        type: "button",
                                        className: "copy-button",
                                        "aria-label": "复制地址",
                                        onClick: handleCopyAddress,
                                        children: /*#__PURE__*/ jsxs("svg", {
                                            width: "16",
                                            height: "16",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            children: [
                                                /*#__PURE__*/ jsx("rect", {
                                                    x: "9",
                                                    y: "9",
                                                    width: "13",
                                                    height: "13",
                                                    rx: "2",
                                                    ry: "2"
                                                }),
                                                /*#__PURE__*/ jsx("path", {
                                                    d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                                                })
                                            ]
                                        })
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ jsxs("div", {
                        className: "balance-info-box",
                        children: [
                            /*#__PURE__*/ jsxs("div", {
                                className: "balance-info-label",
                                children: [
                                    /*#__PURE__*/ jsxs("svg", {
                                        width: "16",
                                        height: "16",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2",
                                        children: [
                                            /*#__PURE__*/ jsx("circle", {
                                                cx: "12",
                                                cy: "12",
                                                r: "10"
                                            }),
                                            /*#__PURE__*/ jsx("line", {
                                                x1: "12",
                                                y1: "16",
                                                x2: "12",
                                                y2: "12"
                                            }),
                                            /*#__PURE__*/ jsx("line", {
                                                x1: "12",
                                                y1: "8",
                                                x2: "12.01",
                                                y2: "8"
                                            })
                                        ]
                                    }),
                                    "当前余额"
                                ]
                            }),
                            /*#__PURE__*/ jsx("div", {
                                className: "balance-info-amount",
                                children: account.displayBalance
                            })
                        ]
                    }),
                    /*#__PURE__*/ jsxs("button", {
                        className: "disconnect-button",
                        onClick: handleDisconnect,
                        children: [
                            /*#__PURE__*/ jsxs("svg", {
                                width: "16",
                                height: "16",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2",
                                children: [
                                    /*#__PURE__*/ jsx("path", {
                                        d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                                    }),
                                    /*#__PURE__*/ jsx("polyline", {
                                        points: "16 17 21 12 16 7"
                                    }),
                                    /*#__PURE__*/ jsx("line", {
                                        x1: "21",
                                        y1: "12",
                                        x2: "9",
                                        y2: "12"
                                    })
                                ]
                            }),
                            "断开连接"
                        ]
                    })
                ]
            })
        ]
    });
};

var css_248z = "/* WalletButton Component Styles */\n.wallet-button {\n  font-family:\n    -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Roboto\", \"Oxygen\", \"Ubuntu\",\n    \"Cantarell\", \"Fira Sans\", \"Droid Sans\", \"Helvetica Neue\", sans-serif;\n}\n\n.wallet-button__container {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  height: 44px;\n}\n\n.wallet-button__connect {\n  background: linear-gradient(to right, #eab308, #f97316);\n  border: none;\n  border-radius: 12px;\n  color: white;\n  cursor: pointer;\n  font-weight: 600;\n  padding: 12px 24px;\n  transition: all 0.2s ease;\n  font-size: 14px;\n}\n\n.wallet-button__connect:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);\n}\n\n.wallet-button__wrong-network {\n  background: #ff6b6b;\n  border: none;\n  border-radius: 12px;\n  color: white;\n  cursor: pointer;\n  font-weight: 600;\n  padding: 12px 24px;\n  transition: all 0.2s ease;\n  font-size: 14px;\n}\n\n.wallet-button__wrong-network:hover {\n  background: #ff5252;\n}\n\n.wallet-button__connected {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n}\n\n.wallet-button__chain {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  border-radius: 9999px;\n  background: linear-gradient(to right, #ffe7c5, #ffead4);\n  padding: 8px 12px;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  font-weight: 500;\n  color: #5a4b23;\n  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.6);\n}\n\n.wallet-button__chain-icon {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  border-radius: 0.5rem;\n}\n\n.wallet-button__icon {\n  width: 1.5rem;\n  height: 1.5rem;\n  background: linear-gradient(to right, #facc15, #f97316);\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.wallet-button__account {\n  transform: translateY(-1px);\n  display: flex;\n  align-items: center;\n  justify-content: space-evenly;\n  gap: 0.5rem;\n  background-color: rgba(22, 163, 74, 0.2);\n  border: 1px solid rgba(34, 197, 94, 0.3);\n  border-radius: 0.5rem;\n  padding: 0 12px;\n  height: 40px;\n  min-width: 150px;\n\n  align-items: center;\n  gap: 0.5rem;\n  border-radius: 9999px;\n  background-color: white;\n  padding: 0.25rem 0.75rem;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  color: #66608d;\n  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n  border: 1px solid #e6e4fa;\n  transition: transform 0.2s;\n  cursor: pointer;\n  border: none;\n}\n\n.wallet-button__status-bot {\n  width: 0.5rem;\n  height: 0.5rem;\n  background-color: #4ade80;\n  border-radius: 9999px;\n  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;\n}\n\n.wallet-icon {\n  width: 1rem;\n  height: 1rem;\n  color: #4ade80;\n}\n\n.wallet-button__address {\n  font-weight: 600;\n  font-size: 0.875rem;\n  color: #4ade80;\n\n  font-size: 0.75rem;\n  line-height: 1rem;\n  color: #8b8eb5;\n}\n\n/* Notification Bell */\n.notification-container {\n  position: relative;\n}\n\n.notification-button {\n  position: relative;\n  display: flex;\n  height: 2.5rem;\n  width: 2.5rem;\n  align-items: center;\n  justify-content: center;\n  border-radius: 9999px;\n  background-color: white;\n  color: #6a6d94;\n  border: 1px solid #e7e5fb;\n  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n  box-sizing: border-box;\n}\n\n.notification-badge {\n  position: absolute;\n  right: -0.25rem;\n  top: -0.25rem;\n  display: inline-flex;\n  height: 1rem;\n  width: 1rem;\n\n  align-items: center;\n  justify-content: center;\n  border-radius: 9999px;\n  background-color: #ff5a5f;\n  padding: 0.25 0.25rem;\n  font-size: 0.625rem;\n  line-height: 1rem;\n  font-weight: 600;\n  color: white;\n}\n";
styleInject(css_248z);

const WalletButton = ({ label = "连接钱包", showBalance = true, showChainName = true, className = "", size = "medium" })=>{
    return /*#__PURE__*/ jsx("div", {
        className: `wallet-button wallet-button--${size} ${className}`,
        children: /*#__PURE__*/ jsx(ConnectButton.Custom, {
            children: ({ account, chain: currentChain, openAccountModal, openConnectModal, authenticationStatus, mounted })=>{
                const ready = mounted && authenticationStatus !== "loading";
                const connected = ready && account && currentChain && (!authenticationStatus || authenticationStatus === "authenticated");
                return /*#__PURE__*/ jsx("div", {
                    className: "wallet-button__container",
                    children: (()=>{
                        if (!connected) {
                            return /*#__PURE__*/ jsx("button", {
                                onClick: openConnectModal,
                                type: "button",
                                className: "wallet-button__connect",
                                children: label
                            });
                        }
                        return /*#__PURE__*/ jsxs("div", {
                            className: "wallet-button__connected",
                            children: [
                                showChainName && /*#__PURE__*/ jsxs("div", {
                                    className: "wallet-button__chain",
                                    children: [
                                        currentChain.iconUrl && /*#__PURE__*/ jsx("div", {
                                            className: "wallet-button__chain-icon",
                                            children: /*#__PURE__*/ jsx("img", {
                                                alt: currentChain.name ?? "Chain icon",
                                                src: currentChain.iconUrl,
                                                className: "wallet-button__icon"
                                            })
                                        }),
                                        showBalance && account.displayBalance && /*#__PURE__*/ jsx("span", {
                                            children: account.displayBalance
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ jsxs("button", {
                                    onClick: openAccountModal,
                                    type: "button",
                                    className: "wallet-button__account",
                                    children: [
                                        /*#__PURE__*/ jsx("span", {
                                            className: "wallet-button__status-bot"
                                        }),
                                        /*#__PURE__*/ jsxs("svg", {
                                            xmlns: "http://www.w3.org/2000/svg",
                                            className: "wallet-icon",
                                            width: "24",
                                            height: "24",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            "aria-hidden": "true",
                                            children: [
                                                /*#__PURE__*/ jsx("path", {
                                                    d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"
                                                }),
                                                /*#__PURE__*/ jsx("path", {
                                                    d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ jsx("span", {
                                            className: "wallet-button__address",
                                            children: account.displayName
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ jsx("div", {
                                    className: "notification-container",
                                    children: /*#__PURE__*/ jsxs("div", {
                                        className: "notification-button",
                                        children: [
                                            /*#__PURE__*/ jsxs("svg", {
                                                width: "20",
                                                height: "20",
                                                viewBox: "0 0 24 24",
                                                fill: "none",
                                                stroke: "currentColor",
                                                strokeWidth: "2",
                                                children: [
                                                    /*#__PURE__*/ jsx("path", {
                                                        d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                                                    }),
                                                    /*#__PURE__*/ jsx("path", {
                                                        d: "M13.73 21a2 2 0 0 1-3.46 0"
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ jsx("span", {
                                                className: "notification-badge",
                                                children: "99"
                                            })
                                        ]
                                    })
                                }),
                                /*#__PURE__*/ jsx(Profile, {
                                    account: account,
                                    chain: currentChain,
                                    openAccountModal: openAccountModal
                                })
                            ]
                        });
                    })()
                });
            }
        })
    });
};

/**
 * 网络同步组件
 *
 * 用于监听钱包网络和账户变化，确保应用状态与钱包同步
 *
 * @example
 * ```tsx
 * // 在根组件中使用
 * <WalletProvider {...config}>
 *   <NetworkSync
 *     debug={true}
 *     onNetworkChange={(chainId) => {
 *       // 网络切换时的处理逻辑
 *       console.log('切换到网络:', chainId);
 *     }}
 *     onAccountChange={(address) => {
 *       // 账户切换时的处理逻辑
 *       console.log('切换到账户:', address);
 *     }}
 *   />
 *   <App />
 * </WalletProvider>
 * ```
 */ function NetworkSync({ debug = false, onNetworkChange, onAccountChange }) {
    const { currentChainId, currentAddress } = useWatchNetwork({
        onNetworkChange: (chainId)=>{
            if (debug) {
                console.log(`[NetworkSync] 网络已切换: ${chainId}`);
            }
            onNetworkChange?.(chainId);
        },
        onAccountChange: (address)=>{
            if (debug) {
                console.log(`[NetworkSync] 账户已切换: ${address || "已断开"}`);
            }
            onAccountChange?.(address);
        }
    });
    // 此组件不渲染任何 UI
    if (debug) {
        return /*#__PURE__*/ jsxs("div", {
            style: {
                position: "fixed",
                bottom: "10px",
                right: "10px",
                padding: "8px 12px",
                background: "rgba(0, 0, 0, 0.8)",
                color: "white",
                borderRadius: "4px",
                fontSize: "12px",
                zIndex: 9999
            },
            children: [
                /*#__PURE__*/ jsxs("div", {
                    children: [
                        "Chain: ",
                        currentChainId
                    ]
                }),
                /*#__PURE__*/ jsxs("div", {
                    children: [
                        "Account: ",
                        currentAddress?.slice(0, 6),
                        "..."
                    ]
                })
            ]
        });
    }
    return null;
}

export { AuthModal, AuthProvider, NetworkSync, SignInStatus, WalletButton, WalletProvider, useAuth, useCourseContract, useERC20, useNetworkSwitch, useSimpleYDToken, useWalletAuth, useWalletConnection, useWalletInfo, useWalletSign, useWatchNetwork };
//# sourceMappingURL=index.esm.js.map
