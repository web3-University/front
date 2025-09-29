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

interface FormatRule {
  prefix: number; // 前几位
  suffix: number; // 后几位
  keepFullIfShort?: number; // 地址长度低于多少时保留原样
}

// 🔧 配置表
const addressFormatRules: Record<ChainType, FormatRule> = {
  ethereum: { prefix: 6, suffix: 4 },
  tron: { prefix: 6, suffix: 4 },
  bitcoin: { prefix: 4, suffix: 4 },
  solana: { prefix: 6, suffix: 6 },
  cosmos: { prefix: 6, suffix: 6 },
  polkadot: { prefix: 6, suffix: 6 },
  ripple: { prefix: 6, suffix: 6 },
  cardano: { prefix: 6, suffix: 6 },
  tezos: { prefix: 6, suffix: 6 },
  near: { prefix: 6, suffix: 6, keepFullIfShort: 15 }, // 短用户名直接显示
  generic: { prefix: 6, suffix: 4 },
};

/**
 * 格式化地址字符串
 *
 * @param address 地址字符串
 * @param chain 链类型，默认值为 "ethereum"
 * @returns 格式化后的地址字符串
 */
function formatAddress(address: string, chain: ChainType = "ethereum"): string {
  if (!address) return "";

  const rule = addressFormatRules[chain] || addressFormatRules["generic"];

  if (rule.keepFullIfShort && address.length <= rule.keepFullIfShort) {
    return address;
  }

  if (address.length <= rule.prefix + rule.suffix) {
    return address; // 避免过度截断
  }

  return address.slice(0, rule.prefix) + "..." + address.slice(-rule.suffix);
}

export default formatAddress;
