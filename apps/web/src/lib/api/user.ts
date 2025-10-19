// src/lib/api/user.ts
import { http } from "@/lib/http";

// ========== 类型定义 ==========

export interface User {
  userId: number;
  walletAddress: string;
  username: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  specializations: string | null;
  rating: number;
  isInstructorRegistered: boolean;
  isInstructorApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterUserDto {
  walletAddress: string;
  username: string;
  email?: string;
  avatar?: string;
  bio?: string;
  specializations?: string[];
  isInstructorRegistered?: boolean;
}
export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode?: number;
}

// ========== 用户管理 API ==========

/**
 * 用户注册
 * POST /api/users/register
 */
export const registerUser = (data: RegisterUserDto) =>
  http<ApiResponse<User>>("/api/users/register", {
    method: "POST",
    body: data,
  });

/**
 * 获取用户信息
 * GET /api/users/profile
 */
export const getUserProfile = (walletAddress: string) =>
  http<ApiResponse<User>>(`/users/profile?walletAddress=${walletAddress}`);

/**
 * 更新用户信息
 * PUT /api/users/profile
 */
export const updateUserProfile = (data: Partial<RegisterUserDto>) =>
  http<ApiResponse<User>>("/users/profile", {
    method: "PUT",
    body: data,
  });

/**
 * 判断用户是否已注册
 * GET /api/users/isRegistered
 */
export const checkUserRegistered = (walletAddress: string) =>
  http<ApiResponse<boolean>>(
    `/users/isRegistered?walletAddress=${walletAddress}`,
  );
