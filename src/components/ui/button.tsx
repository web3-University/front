import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import {
  type ButtonHTMLAttributes,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

// 按钮组件，支持不同的变体和尺寸
const button = cva(
  "relative inline-flex cursor-pointer items-center justify-center font-medium rounded-xl transition-all focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 overflow-hidden",
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
  onPointerDown,
  onPointerEnter,
  ...rest
}: ButtonProps) {
  const [ripples, setRipples] = useState<
    Array<{ id: number; style: React.CSSProperties }>
  >([]);

  useEffect(() => {
    if (!ripples.length) return;
    const timeout = window.setTimeout(
      () => setRipples((items) => items.slice(1)),
      500,
    );
    return () => window.clearTimeout(timeout);
  }, [ripples]);

  const resolvedVariant = variant ?? "primary";

  const getRippleColor = () => {
    switch (resolvedVariant) {
      case "secondary":
        return "rgba(96, 106, 255, 0.25)";
      case "ghost":
        return "rgba(106, 109, 148, 0.25)";
      case "destructive":
        return "rgba(255, 255, 255, 0.35)";
      default:
        return "rgba(255, 255, 255, 0.45)";
    }
  };

  const triggerRipple = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>, scale = 1) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * scale;
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      setRipples((items) => [
        ...items,
        {
          id: Date.now() + Math.random(),
          style: {
            width: size,
            height: size,
            left: x,
            top: y,
            backgroundColor: getRippleColor(),
          },
        },
      ]);
    },
    [getRippleColor],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      triggerRipple(event, 1);
      onPointerDown?.(event);
    },
    [onPointerDown, triggerRipple],
  );

  const handlePointerEnter = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      triggerRipple(event, 0.6);
      onPointerEnter?.(event);
    },
    [onPointerEnter, triggerRipple],
  );

  return (
    <button
      className={clsx(button({ variant, size, fullWidth }), className)}
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnter}
      {...rest}
    >
      <span className="pointer-events-none absolute inset-0">
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            style={ripple.style}
            className="button-ripple"
          />
        ))}
      </span>
      {leftIcon ? <span className="mr-2 inline-flex">{leftIcon}</span> : null}
      <span>{loading ? "..." : children}</span>
      {rightIcon ? <span className="ml-2 inline-flex">{rightIcon}</span> : null}
    </button>
  );
}
