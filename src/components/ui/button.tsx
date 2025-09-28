import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

// 按钮组件，支持不同的变体和尺寸
const button = cva(
  "inline-flex items-center justify-center font-medium rounded-xl transition-all focus:outline-none disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-[#FF7A7B] via-[#FF9D6B] to-[#8A71FF] text-white shadow-[0_20px_45px_rgba(255,157,107,0.28)] hover:brightness-[0.97]",
        secondary:
          "border border-[#E5E6F8] bg-white text-[#5F6094] shadow-[0_18px_40px_rgba(160,168,255,0.16)] hover:-translate-y-[2px]",
        ghost: "text-[#6A6D94] hover:bg-[#F2F3FF]",
        destructive: "bg-red-600 text-white hover:bg-red-500",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5",
        lg: "h-12 px-6 text-lg",
      },
      fullWidth: { true: "w-full" },
    },
    defaultVariants: { variant: "primary", size: "lg" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
}

export function Button({
  className,
  leftIcon,
  rightIcon,
  loading,
  children,
  variant,
  size,
  fullWidth,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(button({ variant, size, fullWidth }), className)}
      {...rest}
    >
      {leftIcon ? <span className="mr-2 inline-flex">{leftIcon}</span> : null}
      <span>{loading ? "..." : children}</span>
      {rightIcon ? <span className="ml-2 inline-flex">{rightIcon}</span> : null}
    </button>
  );
}
