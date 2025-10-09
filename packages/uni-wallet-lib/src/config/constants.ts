export const WALLET_STORAGE_KEY = "web3-wallet-lib.wallet";
export const THEME_STORAGE_KEY = "web3-wallet-lib.theme";

export const DEFAULT_APP_NAME = "Web3 DApp";
export const DEFAULT_APP_DESCRIPTION = "Connect your wallet to get started";

export const TRANSACTION_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
  REPLACED: "replaced",
} as const;

export const GAS_LIMIT_MULTIPLIER = 1.2;

export const TOKEN_DECIMALS = {
  ETH: 18,
  USDC: 6,
  USDT: 6,
  DAI: 18,
} as const;

export const ERROR_CODES = {
  USER_REJECTED: 4001,
  UNAUTHORIZED: 4100,
  UNSUPPORTED_METHOD: 4200,
  DISCONNECTED: 4900,
  CHAIN_DISCONNECTED: 4901,
} as const;
