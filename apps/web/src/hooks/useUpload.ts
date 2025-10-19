"use client";

import { FileType } from "lucide-react";
import { useState } from "react";
import { type UploadImageParams, uploadCouseImage } from "@/lib/api/course";

// 文件类型定义
type FileType = "avatar" | "video" | "image" | "file";

// 上传状态
interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  url: string | null;
  previousUrl: string | null; // 新增：保存上传前的 URL
}

// Hook 返回类型
interface UseUploadReturn {
  uploadFile: (
    file: File | Blob,
    fileType: FileType,
    currentUrl?: string, // 新增：当前已有的 URL
  ) => Promise<string | null>;
  isUploading: boolean;
  progress: number;
  error: string | null;
  url: string | null;
  previousUrl: string | null; // 新增
  reset: () => void;
}

export const useUpload = (): UseUploadReturn => {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    url: null,
    previousUrl: null,
  });

  // 获取上传 URL（预签名 URL 或直接上传地址）
  const getUploadUrl = async (file: Blob | File, fileType: string) => {
    console.log(file, fileType, "__fileType");
    const params = {
      file: file,
      fileType: fileType,
    };
    const response = await uploadCouseImage(params);
    console.log("response", response);

    if (!response.data) {
      throw new Error("获取上传地址失败");
    }

    return response.data; // { uploadUrl: string, fileUrl: string }
  };

  // 上传文件到服务器或云存储
  const uploadToStorage = async (
    file: File | Blob,
    uploadUrl: string,
    onProgress?: (progress: number) => void,
  ) => {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // 监听上传进度
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress?.(progress);
        }
      });

      // 上传完成
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`上传失败: ${xhr.statusText}`));
        }
      });

      // 上传错误
      xhr.addEventListener("error", () => {
        reject(new Error("网络错误"));
      });

      // 上传超时
      xhr.addEventListener("timeout", () => {
        reject(new Error("上传超时"));
      });

      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader(
        "Content-Type",
        file.type || "application/octet-stream",
      );
      xhr.send(file);
    });
  };

  // 主上传函数
  const uploadFile = async (
    file: File | Blob,
    fileType: FileType,
    currentUrl?: string, // 新增参数：当前已有的 URL
  ): Promise<string | null> => {
    try {
      // 保存当前 URL，并重置状态
      setState({
        isUploading: true,
        progress: 0,
        error: null,
        url: currentUrl || null, // 保持当前 URL 显示
        previousUrl: currentUrl || null, // 保存原始 URL
      });

      // 验证文件
      if (!file) {
        throw new Error("请选择文件");
      }

      // 获取文件名
      // 1. 获取上传地址
      const { url: fileUrl } = (await getUploadUrl(file, fileType)) as any;

      console.log(fileUrl, "__uploadUrl, fileUrl");
      // 2. 上传文件
      // await uploadToStorage(file, uploadUrl, (progress) => {
      //   setState((prev) => ({ ...prev, progress }));
      // });

      // 3. 上传成功 - 更新为新 URL
      setState({
        isUploading: false,
        progress: 100,
        error: null,
        url: fileUrl,
        previousUrl: currentUrl || null,
      });

      return fileUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "上传失败";
      // 上传失败 - 恢复到原始 URL
      setState((prev) => ({
        isUploading: false,
        progress: 0,
        error: errorMessage,
        url: prev.previousUrl, // 恢复原始 URL
        previousUrl: prev.previousUrl,
      }));
      return null;
    }
  };

  // 重置状态
  const reset = () => {
    setState({
      isUploading: false,
      progress: 0,
      error: null,
      url: null,
      previousUrl: null,
    });
  };

  return {
    uploadFile,
    isUploading: state.isUploading,
    progress: state.progress,
    error: state.error,
    url: state.url,
    previousUrl: state.previousUrl,
    reset,
  };
};
