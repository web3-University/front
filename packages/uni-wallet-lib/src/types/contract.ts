import type { Address, Abi } from "viem";

export interface ContractConfig {
  address: Address;
  abi: Abi;
  chainId?: number;
}

export interface ERC20TokenInfo {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply?: bigint;
}

export interface ERC721TokenInfo {
  address: Address;
  name: string;
  symbol: string;
  totalSupply?: bigint;
}

export interface TokenBalance {
  value: bigint;
  formatted: string;
  symbol: string;
  totalSupply?: bigint;
}

export interface NFTMetadata {
  name?: string;
  description?: string;
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}
