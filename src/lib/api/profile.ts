// src/lib/api/profile.ts
import { http } from "@/lib/http";

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  walletAddress: string;
}

export interface UpdateProfileRequest {
  walletAddress: string;
  name: string;
  email: string;
  avatarUrl: string;
  signature: string;
  message: string;
  timestamp: number;
}

export interface NFT {
  id: number;
  tokenId: string;
  name: string;
  description: string;
  imageUrl: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  contractAddress: string;
  obtainedDate: string;
  attributes?: {
    trait_type: string;
    value: string;
  }[];
}

// 获取用户信息
export const getUserProfile = (address: string) =>
  http<UserProfile>(`/users/profile?address=${address}`);

// 更新用户信息
export const updateUserProfile = (data: UpdateProfileRequest) =>
  http<{ success: boolean; message: string }>("/users/profile", {
    method: "POST",
    body: data,
  });

// 上传头像
export const uploadAvatar = (file: FormData) =>
  http<{ url: string }>("/upload/avatar", {
    method: "POST",
    body: file,
  });

// 获取用户的 NFT 列表
export const getUserNFTs = (address: string) =>
  http<NFT[]>(`/nfts/user?address=${address}`);
