import type { Hash, TransactionReceipt } from "viem";

export interface TransactionRequest {
  to?: string;
  value?: bigint;
  data?: string;
  gasLimit?: bigint;
  gasPrice?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
}

export interface TransactionStatus {
  hash: Hash;
  status: "pending" | "success" | "failed" | "replaced";
  confirmations: number;
  receipt?: TransactionReceipt;
  error?: Error;
}

export interface GasEstimate {
  gasLimit: bigint;
  gasPrice?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  estimatedCost: bigint;
}

export interface TransactionHistory {
  hash: Hash;
  from: string;
  to?: string;
  value: bigint;
  timestamp: number;
  status: "pending" | "success" | "failed";
  gasUsed?: bigint;
  gasPrice?: bigint;
  blockNumber?: number;
}
