type ChainType =
  | "ethereum"
  | "bitcoin"
  | "solana"
  | "cosmos"
  | "polkadot"
  | "tron"
  | "ripple"
  | "cardano"
  | "tezos"
  | "near"
  | "generic";
/**
 * 格式化地址字符串
 *
 * @param address 地址字符串
 * @param chain 链类型，默认值为 "ethereum"
 * @returns 格式化后的地址字符串
 */
declare function formatAddress(address: string, chain?: ChainType): string;

declare const _default: {
  formatAddress: typeof formatAddress;
};

export { _default as default };
