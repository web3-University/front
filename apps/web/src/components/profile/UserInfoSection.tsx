"use client";

import {
  useSimpleYDToken,
  useWalletInfo,
  useWalletSign,
} from "@web3-university/uni-wallet-lib";
import {
  AlertCircle,
  Camera,
  CheckCircle,
  Coins,
  Loader2,
  Mail,
  Save,
  User,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatUnits } from "viem";
import { http } from "@/lib/http";

interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  walletAddress: string;
}

export default function UserInfoSection() {
  const { address, isConnected } = useWalletInfo();
  const { signMessage } = useWalletSign();

  // YD代币相关
  const tokenAddress = useMemo(() => {
    const addr = process.env.NEXT_PUBLIC_YD_TOKEN_ADDRESS;
    return addr ? (addr as `0x${string}`) : undefined;
  }, []);

  const { balance: ydBalance } = useSimpleYDToken({ address: tokenAddress });

  const ydBalanceLabel = useMemo(() => {
    if (!ydBalance) return "0";
    return Number(formatUnits(ydBalance, 18)).toFixed(2);
  }, [ydBalance]);

  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    avatarUrl: "",
    walletAddress: address || "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 验证码相关状态
  const [_emailCode, setEmailCode] = useState("");
  const [_isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [originalEmail, setOriginalEmail] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 加载用户信息
  useEffect(() => {
    if (address) {
      loadUserProfile();
    }
  }, [address]);

  // 倒计时效果
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const loadUserProfile = async () => {
    try {
      // 优先从 localStorage 读取用户数据
      const localUserData = localStorage.getItem("USER");
      if (localUserData) {
        try {
          const userData = JSON.parse(localUserData);
          // 如果 localStorage 中有数据，直接使用
          // 注意：localStorage 中的字段名是 username 和 avatar
          setProfile({
            name: userData.username || "",
            email: userData.email || "",
            avatarUrl: userData.avatar || "",
            walletAddress: address || "",
          });
          setOriginalEmail(userData.email || "");
          console.log("从 localStorage 加载用户信息成功", userData);
        } catch (parseError) {
          console.error("解析 localStorage 用户数据失败:", parseError);
        }
      }
    } catch (error) {
      console.error("加载用户信息失败:", error);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "请选择图片文件" });
      return;
    }

    // 检查文件大小（限制为 5MB）
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "图片大小不能超过 5MB" });
      return;
    }

    // 创建预览
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setProfile((prev) => ({ ...prev, avatarUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const _handleSendCode = async () => {
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      setMessage({ type: "error", text: "请输入有效的邮箱地址" });
      return;
    }

    setIsSendingCode(true);
    setMessage(null);

    try {
      console.log("发送验证码请求:", {
        url: "/users/profile/email-code",
        body: {
          walletAddress: address,
          email: profile.email,
        },
      });

      await http("/users/profile/email-code", {
        method: "POST",
        body: {
          walletAddress: address,
          email: profile.email,
        },
      });

      setMessage({ type: "success", text: "验证码已发送，请查收邮箱" });
      setCountdown(60); // 60秒倒计时

      // 3秒后清除成功消息
      setTimeout(() => setMessage(null), 3000);
    } catch (error: unknown) {
      console.error("发送验证码失败:", error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "发送验证码失败，请重试",
      });
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleSave = async () => {
    if (!isConnected || !address) {
      setMessage({ type: "error", text: "请先连接钱包" });
      return;
    }

    if (!profile.name.trim()) {
      setMessage({ type: "error", text: "请输入用户名" });
      return;
    }

    if (!profile.email.trim()) {
      setMessage({ type: "error", text: "请输入邮箱" });
      return;
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      setMessage({ type: "error", text: "请输入有效的邮箱地址" });
      return;
    }

    // 检查邮箱是否修改，如果修改了需要验证码
    const _emailChanged = profile.email !== originalEmail;
    // 暂时禁用邮箱验证码验证
    // if (emailChanged && !emailCode.trim()) {
    //   setMessage({ type: "error", text: "邮箱已修改，请输入邮箱验证码" });
    //   return;
    // }

    setIsSaving(true);
    setMessage(null);

    try {
      // 生成签名消息用于用户确认
      const timestamp = Date.now();
      const message = `更新个人信息\n时间戳: ${timestamp}\n钱包地址: ${address}\n名称: ${profile.name}\n邮箱: ${profile.email}`;

      // 请求钱包签名（用户确认操作）
      let signature: string;
      try {
        const signResult = await signMessage(message);
        signature = signResult.signature;
      } catch (_signError) {
        // 用户拒绝签名，不继续请求接口
        console.log("用户拒绝签名");
        setMessage({ type: "error", text: "已取消操作" });
        return;
      }

      // 签名通过后，继续上传头像和保存用户信息
      // 上传头像（如果有新头像）
      let avatarUrl = profile.avatarUrl;
      if (profile.avatarUrl?.startsWith("data:")) {
        // 将 base64 转换为 blob
        const blob = await fetch(profile.avatarUrl).then((r) => r.blob());
        const formData = new FormData();
        formData.append("file", blob, "avatar.jpg");
        formData.append("fileType", "avatar");

        const uploadResult = await http<{ url: string }>("/storage/upload", {
          method: "POST",
          body: formData,
        });
        avatarUrl = uploadResult.url;
      }

      // 保存用户信息
      await http("/users/profile", {
        method: "PUT",
        body: {
          walletAddress: address,
          username: profile.name,
          avatar: avatarUrl,
          email: profile.email,
          // 暂时禁用邮箱验证码
          // verificationCode: emailChanged ? emailCode : undefined, // 只有修改邮箱时才需要验证码
          verificationCode: undefined, // 暂时不传验证码
          signature,
          message,
          timestamp,
        },
      });

      setMessage({ type: "success", text: "保存成功！" });
      setIsEditing(false);
      setEmailCode(""); // 清空验证码
      setOriginalEmail(profile.email); // 更新原始邮箱

      // 更新本地头像 URL
      setProfile((prev) => ({ ...prev, avatarUrl }));

      // 3秒后清除成功消息
      setTimeout(() => setMessage(null), 3000);
    } catch (error: unknown) {
      console.error("保存失败:", error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "保存失败，请重试",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Wallet className="mb-4 h-16 w-16 text-[#6A6D94]" />
        <p className="text-lg text-[#6A6D94]">请先连接钱包</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 消息提示 */}
      {message && (
        <div
          className={`flex items-center gap-3 rounded-xl p-4 ${
            message.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* 头像和基本信息卡片 */}
      <div className="rounded-2xl bg-white/60 p-6 backdrop-blur-sm shadow-sm ring-1 ring-white/60">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* 头像 */}
          <div className="relative">
            <div className="h-32 w-32 overflow-hidden rounded-full bg-gradient-to-br from-[#8A71FF] to-[#FF9D6B] p-1 shadow-lg">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="Avatar"
                  className="h-full w-full rounded-full object-cover bg-white"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                  <User className="h-16 w-16 text-[#6A6D94]" />
                </div>
              )}
            </div>
            {/* 头像编辑按钮（仅在编辑模式显示） */}
            {isEditing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 rounded-full bg-[#8A71FF] p-3 text-white shadow-lg transition-all hover:bg-[#7A61EF]"
              >
                <Camera className="h-5 w-5" />
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          {/* 用户信息展示 */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-[#2B2558] mb-2">
              {profile.name || "未设置名称"}
            </h2>
            <p className="text-sm text-[#6A6D94] mb-3">
              {profile.email || "未设置邮箱"}
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#F5F0FF] px-4 py-2">
                <Wallet className="h-4 w-4 text-[#8A71FF]" />
                <span className="font-mono text-sm text-[#6A6D94]">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FFF5E6] to-[#E6F7FF] px-4 py-2">
                <Coins className="h-4 w-4 text-[#FF9D6B]" />
                <span className="font-mono text-sm font-semibold text-[#2B2558]">
                  {ydBalanceLabel} YD
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 表单编辑卡片 */}
      <div className="rounded-2xl bg-white/60 p-6 backdrop-blur-sm shadow-sm ring-1 ring-white/60">
        <h3 className="text-lg font-bold text-[#2B2558] mb-6">个人资料</h3>

        <div className="space-y-6">
          {/* 钱包地址（只读） */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[#2B2558]">
              <Wallet className="h-4 w-4" />
              钱包地址
            </label>
            <div className="rounded-xl bg-[#F5F0FF] px-4 py-3 font-mono text-sm text-[#6A6D94]">
              {address}
            </div>
            <p className="mt-2 text-xs text-[#6A6D94]">
              钱包地址不可修改，所有信息都绑定到此地址
            </p>
          </div>

          {/* 用户名 */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[#2B2558]">
              <User className="h-4 w-4" />
              用户名
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, name: e.target.value }))
              }
              disabled={!isEditing}
              placeholder="请输入您的用户名"
              className="w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 text-[#2B2558] transition-all focus:border-[#8A71FF] focus:outline-none focus:ring-2 focus:ring-[#8A71FF]/20 disabled:bg-[#F5F0FF] disabled:text-[#6A6D94]"
            />
          </div>

          {/* 邮箱 */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[#2B2558]">
              <Mail className="h-4 w-4" />
              邮箱
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, email: e.target.value }))
                }
                disabled={!isEditing}
                placeholder="请输入您的邮箱"
                className="flex-1 rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 text-[#2B2558] transition-all focus:border-[#8A71FF] focus:outline-none focus:ring-2 focus:ring-[#8A71FF]/20 disabled:bg-[#F5F0FF] disabled:text-[#6A6D94]"
              />
              {/* 暂时禁用发送验证码功能 */}
              {/* {isEditing && (
                <button
                  onClick={handleSendCode}
                  disabled={isSendingCode || countdown > 0 || !profile.email}
                  className="rounded-xl bg-gradient-to-r from-[#8A71FF] to-[#9D7FFF] px-6 py-3 font-medium text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isSendingCode ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      发送中...
                    </span>
                  ) : countdown > 0 ? (
                    `${countdown}秒后重试`
                  ) : (
                    "发送验证码"
                  )}
                </button>
              )} */}
            </div>

            {/* 暂时禁用验证码输入框 */}
            {/* 验证码输入框 - 仅在编辑模式且邮箱已修改时显示 */}
            {/* {isEditing && profile.email !== originalEmail && (
              <div className="mt-3">
                <input
                  type="text"
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value)}
                  placeholder="请输入邮箱验证码"
                  maxLength={6}
                  className="w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 text-[#2B2558] transition-all focus:border-[#8A71FF] focus:outline-none focus:ring-2 focus:ring-[#8A71FF]/20"
                />
                <p className="mt-2 text-xs text-[#FF9800]">
                  检测到邮箱已修改，请先发送验证码并填写
                </p>
              </div>
            )} */}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-6 flex gap-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-xl bg-gradient-to-r from-[#8A71FF] to-[#9D7FFF] px-6 py-3 font-medium text-white shadow-md transition-all hover:shadow-lg hover:scale-105"
            >
              编辑信息
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8A71FF] to-[#9D7FFF] px-6 py-3 font-medium text-white shadow-md transition-all hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    保存
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEmailCode(""); // 清空验证码
                  setCountdown(0); // 重置倒计时
                  loadUserProfile(); // 重新加载原始数据
                }}
                disabled={isSaving}
                className="rounded-xl border border-[#E0E0E0] px-6 py-3 font-medium text-[#6A6D94] transition-all hover:bg-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                取消
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
