"use client";

import { useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { uploadCouseImage, uploadCouseVideo } from "@/lib/api/course";
import SparkMD5 from "spark-md5";

// 文件类型定义
type FileType = "avatar" | "video" | "image" | "file";

// 分片配置
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB per chunk
const MAX_CONCURRENT = 3; // 最大并发上传数
const LARGE_FILE_THRESHOLD = 10 * 1024 * 1024; // 10MB 以上启用分片

const MIME_TYPE_MAP: Record<string, string> = {
  // 视频类型
  video: "video/mp4",
  mp4: "video/mp4",
  webm: "video/webm",
  avi: "video/x-msvideo",
  mov: "video/quicktime",

  // 图片类型
  image: "image/jpeg",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",

  // 文档类型
  pdf: "application/pdf",
  txt: "text/plain",
  json: "application/json",

  // 默认
  file: "application/octet-stream",
};
const getMimeType = (file: File | Blob, fileType: FileType): string => {
  // 1. 优先使用文件本身的 type
  if (
    file.type &&
    file.type !== "" &&
    file.type !== "application/octet-stream"
  ) {
    console.log("使用文件原始MIME类型:", file.type);
    return file.type;
  }

  // 2. 如果文件是 File 对象，从扩展名推断
  if (file instanceof File && file.name) {
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (extension && MIME_TYPE_MAP[extension]) {
      console.log("从文件扩展名推断MIME类型:", MIME_TYPE_MAP[extension]);
      return MIME_TYPE_MAP[extension];
    }
  }
  const defaultType = MIME_TYPE_MAP[fileType] || "application/octet-stream";
  console.log("使用默认MIME类型:", defaultType);
  return defaultType;
};

// 上传状态
interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  url: string | null;
  previousUrl: string | null;
  currentChunk: number;
  totalChunks: number;
  uploadSpeed: number;
  isChunked: boolean;
}

// 分片信息
interface ChunkInfo {
  chunk: Blob;
  index: number;
  start: number;
  end: number;
}

export const useUpload = () => {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    url: null,
    previousUrl: null,
    currentChunk: 0,
    totalChunks: 0,
    uploadSpeed: 0,
    isChunked: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const tUpload = useTranslations("courseCreate.upload");

  /**
   * 计算文件 Hash
   */
  const calculateFileHash = useCallback(
    (file: File | Blob): Promise<string> => {
      return new Promise((resolve, reject) => {
        const spark = new SparkMD5.ArrayBuffer();
        const fileReader = new FileReader();
        const chunkSize = 2 * 1024 * 1024;
        let currentChunk = 0;
        const chunks = Math.ceil(file.size / chunkSize);

        fileReader.onload = (e) => {
          if (e.target?.result) {
            spark.append(e.target.result as ArrayBuffer);
            currentChunk++;

            if (currentChunk < chunks) {
              loadNext();
            } else {
              resolve(spark.end());
            }
          }
        };

        fileReader.onerror = () => {
          reject(new Error(tUpload("fileReadFailed")));
        };

        const loadNext = () => {
          const start = currentChunk * chunkSize;
          const end = Math.min(start + chunkSize, file.size);
          fileReader.readAsArrayBuffer(file.slice(start, end));
        };

        loadNext();
      });
    },
    [tUpload],
  );

  /**
   * 切分文件为多个分片
   */
  const createChunks = useCallback(
    (file: File | Blob, mimeType: string): ChunkInfo[] => {
      const chunks: ChunkInfo[] = [];

      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end, mimeType);
        chunks.push({
          chunk,
          index: i,
          start,
          end,
        });
      }

      return chunks;
    },
    [],
  );

  /**
   * 上传单个分片
   */
  const uploadChunk = async (
    chunkInfo: ChunkInfo,
    fileHash: string,
    fileType: FileType,
    mimeType: string,
    totalChunks: number,
    fileName?: string,
  ): Promise<any> => {
    const chunkFile = new File(
      [chunkInfo.chunk],
      fileName || `chunk_${chunkInfo.index}`,
      { type: mimeType },
    );

    const params = {
      file: chunkFile,
      fileType: fileType,
      hashId: fileHash,
      contentType: mimeType,
      chunkIndex: chunkInfo.index, // ✅ 添加 chunkIndex - 当前分片的下标
      totalChunks: totalChunks, // ✅ 总分片数
    };

    console.log(`📤 上传分片 ${chunkInfo.index + 1}/${totalChunks}:`, {
      chunkSize: chunkInfo.chunk.size,
      chunkIndex: chunkInfo.index, // 当前分片下标
      totalChunks: totalChunks, // 总分片数
      hashId: fileHash,
      fileType,
      mimeType,
    });

    const response = await uploadCouseVideo(params);

    console.log(
      `📥 分片 ${chunkInfo.index + 1}/${totalChunks} 响应:`,
      response,
    );

    if (!response || !response.data) {
      console.error(`❌ 分片 ${chunkInfo.index + 1} 响应异常:`, response);
      throw new Error(
        tUpload("chunkResponseEmpty", {
          index: chunkInfo.index + 1,
          total: totalChunks,
        }),
      );
    }

    return response.data;
  };

  /**
   * 普通上传（无分片）
   */
  const normalUpload = async (
    file: File | Blob,
    fileType: FileType,
    mimeType: string,
  ): Promise<string> => {
    let uploadFile: File;
    if (file instanceof File) {
      // 如果文件的 type 不正确，重新创建一个 File 对象
      if (!file.type || file.type === "application/octet-stream") {
        uploadFile = new File([file], file.name, { type: mimeType });
      } else {
        uploadFile = file;
      }
    } else {
      // Blob 转 File
      uploadFile = new File([file], "upload", { type: mimeType });
    }
    const params = {
      file: uploadFile,
      fileType: fileType,
    };

    console.log("📤 普通上传参数:", {
      fileSize: file.size,
      fileType,
      fileName: (file as File).name || "unknown",
      mimeType,
      actualFileType: uploadFile.type,
    });

    const progressInterval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        progress: Math.min(prev.progress + 10, 90),
      }));
    }, 200);

    try {
      const response = await uploadCouseImage(params);

      clearInterval(progressInterval);

      console.log("📥 普通上传响应:", response);

      // 详细检查响应结构
      if (!response) {
        throw new Error(tUpload("noResponse"));
      }

      if (!response.data) {
        console.error("❌ 响应缺少 data 字段:", response);
        throw new Error(tUpload("missingDataField"));
      }

      if (!response.data.url) {
        console.error("❌ 响应缺少 url 字段:", response.data);
        throw new Error(tUpload("missingUrlField"));
      }

      console.log("✅ 获取到URL:", response.data.url);
      return response.data.url;
    } catch (error) {
      clearInterval(progressInterval);
      console.error("❌ 普通上传错误:", error);
      throw error;
    }
  };

  /**
   * 并发上传分片
   */
  const uploadChunksWithConcurrency = async (
    chunks: ChunkInfo[],
    fileHash: string,
    fileType: FileType,
    mimeType: string,
    fileName?: string,
  ): Promise<string> => {
    const totalChunks = chunks.length;
    let uploadedChunks = 0;
    const startTime = Date.now();
    let uploadedBytes = 0;
    let finalUrl = "";

    console.log(`🎯 开始分片上传: ${totalChunks} 个分片`);

    const queue = [...chunks];
    const executing: Promise<void>[] = [];

    const uploadNext = async (): Promise<void> => {
      if (queue.length === 0) return;

      const chunkInfo = queue.shift()!;
      const chunkSize = chunkInfo.chunk.size;

      try {
        const result = await retryUpload(
          () =>
            uploadChunk(
              chunkInfo,
              fileHash,
              fileType,
              mimeType,
              totalChunks, // 传递总分片数
              fileName,
            ),
          3,
        );

        // 检查是否返回了最终URL
        if (result?.url) {
          console.log(`✅ 分片 ${chunkInfo.index + 1} 返回URL:`, result.url);
          finalUrl = result.url;
        }

        uploadedChunks++;
        uploadedBytes += chunkSize;

        const elapsedTime = (Date.now() - startTime) / 1000;
        const speed = uploadedBytes / elapsedTime;
        const progress = Math.round((uploadedChunks / totalChunks) * 100);

        setState((prev) => ({
          ...prev,
          currentChunk: uploadedChunks,
          progress,
          uploadSpeed: speed,
        }));

        console.log(
          `✅ 分片进度: ${uploadedChunks}/${totalChunks} (${progress}%)`,
        );
      } catch (error) {
        console.error(`❌ 分片 ${chunkInfo.index + 1} 失败:`, error);
        throw new Error(
          tUpload("chunkUploadFailed", {
            index: chunkInfo.index + 1,
            total: totalChunks,
            message:
              error instanceof Error ? error.message : String(error ?? ""),
          }),
        );
      }
    };

    while (queue.length > 0 || executing.length > 0) {
      while (executing.length < MAX_CONCURRENT && queue.length > 0) {
        const promise = uploadNext().then(() => {
          executing.splice(executing.indexOf(promise), 1);
        });
        executing.push(promise);
      }

      if (executing.length > 0) {
        await Promise.race(executing);
      }
    }

    if (!finalUrl) {
      console.error("❌ 分片上传完成但未获取到URL");
      throw new Error(tUpload("chunkUploadMissingUrl"));
    }

    console.log("✅ 分片上传完成，最终URL:", finalUrl);
    return finalUrl;
  };

  /**
   * 重试机制
   */
  const retryUpload = async <T>(
    fn: () => Promise<T>,
    maxRetries: number,
  ): Promise<T> => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        const delay = Math.pow(2, i) * 1000;
        console.log(`⚠️ 重试 ${i + 1}/${maxRetries}，等待 ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw new Error(tUpload("retriesExhausted"));
  };

  /**
   * 主上传函数
   */
  const uploadFile = async (
    file: File | Blob,
    fileType: FileType,
    currentUrl?: string,
  ): Promise<string | null> => {
    try {
      console.log("========== 开始上传 ==========");
      console.log("文件信息:", {
        size: file.size,
        type: fileType,
        name: (file as File).name || "unknown",
        isLargeFile: file.size >= LARGE_FILE_THRESHOLD,
      });

      if (!file) {
        throw new Error(tUpload("fileRequired"));
      }
      const mimeType = getMimeType(file, fileType);
      const fileName = file instanceof File ? file.name : undefined;
      abortControllerRef.current = new AbortController();
      console.log("文件信息:", {
        name: fileName,
        size: file.size,
        originalType: file.type,
        detectedMimeType: mimeType,
        fileType: fileType,
        isLargeFile: file.size >= LARGE_FILE_THRESHOLD,
      });
      const isLargeFile = file.size >= LARGE_FILE_THRESHOLD;

      setState({
        isUploading: true,
        progress: 0,
        error: null,
        url: currentUrl || null,
        previousUrl: currentUrl || null,
        currentChunk: 0,
        totalChunks: 0,
        uploadSpeed: 0,
        isChunked: isLargeFile,
      });

      let finalUrl: string;

      if (isLargeFile) {
        console.log("📦 使用分片上传模式");
        const fileHash = await calculateFileHash(file);
        console.log("✅ 文件Hash:", fileHash);

        const chunks = createChunks(file, mimeType);
        console.log(`📦 切分为 ${chunks.length} 个分片`);

        setState((prev) => ({
          ...prev,
          totalChunks: chunks.length,
        }));

        finalUrl = await uploadChunksWithConcurrency(
          chunks,
          fileHash,
          fileType,
          mimeType,
          fileName,
        );
      } else {
        console.log("📤 使用普通上传模式");
        finalUrl = await normalUpload(file, fileType, mimeType);
      }

      console.log("✅ 上传成功！最终URL:", finalUrl);

      setState({
        isUploading: false,
        progress: 100,
        error: null,
        url: finalUrl,
        previousUrl: currentUrl || null,
        currentChunk: state.totalChunks,
        totalChunks: state.totalChunks,
        uploadSpeed: 0,
        isChunked: isLargeFile,
      });

      console.log("========== 上传完成 ==========");
      return finalUrl;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : tUpload("genericFailure");
      console.error("❌ 上传失败:", err);
      console.error("========== 上传失败 ==========");

      setState((prev) => ({
        isUploading: false,
        progress: 0,
        error: errorMessage,
        url: prev.previousUrl,
        previousUrl: prev.previousUrl,
        currentChunk: 0,
        totalChunks: 0,
        uploadSpeed: 0,
        isChunked: false,
      }));

      return null;
    }
  };

  const cancelUpload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setState((prev) => ({
      isUploading: false,
      progress: 0,
      error: tUpload("uploadCancelled"),
      url: prev.previousUrl,
      previousUrl: prev.previousUrl,
      currentChunk: 0,
      totalChunks: 0,
      uploadSpeed: 0,
      isChunked: false,
    }));
  }, [tUpload]);

  const reset = useCallback(() => {
    setState({
      isUploading: false,
      progress: 0,
      error: null,
      url: null,
      previousUrl: null,
      currentChunk: 0,
      totalChunks: 0,
      uploadSpeed: 0,
      isChunked: false,
    });
  }, []);

  return {
    uploadFile,
    isUploading: state.isUploading,
    progress: state.progress,
    error: state.error,
    url: state.url,
    previousUrl: state.previousUrl,
    currentChunk: state.currentChunk,
    totalChunks: state.totalChunks,
    uploadSpeed: state.uploadSpeed,
    isChunked: state.isChunked,
    reset,
    cancelUpload,
  };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

export const formatSpeed = (bytesPerSecond: number): string => {
  if (bytesPerSecond < 1024) return `${bytesPerSecond.toFixed(0)} B/s`;
  if (bytesPerSecond < 1024 * 1024)
    return `${(bytesPerSecond / 1024).toFixed(2)} KB/s`;
  return `${(bytesPerSecond / (1024 * 1024)).toFixed(2)} MB/s`;
};
