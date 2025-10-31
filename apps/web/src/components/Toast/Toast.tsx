"use client";
import React from "react";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info, AlertCircle } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ type, message, onClose }) => {
  const config = {
    success: {
      icon: CheckCircle,
      bgColor: "bg-green-500/90",
      borderColor: "border-green-400",
      iconColor: "text-green-100",
    },
    error: {
      icon: XCircle,
      bgColor: "bg-red-500/90",
      borderColor: "border-red-400",
      iconColor: "text-red-100",
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-500/90",
      borderColor: "border-blue-400",
      iconColor: "text-blue-100",
    },
    warning: {
      icon: AlertCircle,
      bgColor: "bg-orange-500/90",
      borderColor: "border-orange-400",
      iconColor: "text-orange-100",
    },
  };

  const { icon: Icon, bgColor, borderColor, iconColor } = config[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`${bgColor} ${borderColor} backdrop-blur-sm border rounded-lg shadow-2xl p-4 pr-12 max-w-md animate-in slide-in-from-top-2 duration-300 relative`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
        <p className="text-white text-sm leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Toast 管理器
let toastId = 0;
const toastContainers = new Map<
  number,
  { type: ToastType; message: string; onClose: () => void }
>();
const listeners = new Set<() => void>();

export const showToast = (type: ToastType, message: string) => {
  const id = toastId++;
  toastContainers.set(id, {
    type,
    message,
    onClose: () => {
      toastContainers.delete(id);
      listeners.forEach((listener) => listener());
    },
  });
  listeners.forEach((listener) => listener());
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<
    Array<{
      id: number;
      type: ToastType;
      message: string;
      onClose: () => void;
    }>
  >([]);

  React.useEffect(() => {
    const updateToasts = () => {
      setToasts(
        Array.from(toastContainers.entries()).map(([id, toast]) => ({
          id,
          ...toast,
        })),
      );
    };

    listeners.add(updateToasts);
    return () => {
      listeners.delete(updateToasts);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={toast.onClose}
          />
        </div>
      ))}
    </div>
  );
};

export default Toast;
