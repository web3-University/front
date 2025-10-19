import { type NetworkChangeHandler, useWatchNetwork } from "../../hooks/wallet";

export interface NetworkSyncProps extends NetworkChangeHandler {
  /**
   * 是否在控制台显示调试信息
   * @default false
   */
  debug?: boolean;
}

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
 */
export function NetworkSync({
  debug = false,
  onNetworkChange,
  onAccountChange,
}: NetworkSyncProps) {
  const { currentChainId, currentAddress } = useWatchNetwork({
    onNetworkChange: (chainId) => {
      if (debug) {
        console.log(`[NetworkSync] 网络已切换: ${chainId}`);
      }
      onNetworkChange?.(chainId);
    },
    onAccountChange: (address) => {
      if (debug) {
        console.log(`[NetworkSync] 账户已切换: ${address || "已断开"}`);
      }
      onAccountChange?.(address);
    },
  });

  // 此组件不渲染任何 UI
  if (debug) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: "10px",
          right: "10px",
          padding: "8px 12px",
          background: "rgba(0, 0, 0, 0.8)",
          color: "white",
          borderRadius: "4px",
          fontSize: "12px",
          zIndex: 9999,
        }}
      >
        <div>Chain: {currentChainId}</div>
        <div>Account: {currentAddress?.slice(0, 6)}...</div>
      </div>
    );
  }

  return null;
}
