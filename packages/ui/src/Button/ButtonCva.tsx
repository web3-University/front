import React from "react";

export interface ButtonCvaProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const baseStyles: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "6px",
  fontWeight: 500,
  transition: "all 0.2s",
  cursor: "pointer",
  border: "none",
  outline: "none",
};

const variantStyles: Record<string, React.CSSProperties> = {
  primary: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
  },
  secondary: {
    backgroundColor: "#4b5563",
    color: "#ffffff",
  },
  outline: {
    backgroundColor: "transparent",
    color: "#2563eb",
    border: "2px solid #2563eb",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "#2563eb",
  },
  danger: {
    backgroundColor: "#dc2626",
    color: "#ffffff",
  },
};

const variantHoverStyles: Record<string, React.CSSProperties> = {
  primary: {
    backgroundColor: "#1d4ed8",
  },
  secondary: {
    backgroundColor: "#374151",
  },
  outline: {
    backgroundColor: "#eff6ff",
  },
  ghost: {
    backgroundColor: "#eff6ff",
  },
  danger: {
    backgroundColor: "#b91c1c",
  },
};

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: {
    height: "32px",
    padding: "0 12px",
    fontSize: "14px",
  },
  md: {
    height: "40px",
    padding: "0 16px",
    fontSize: "16px",
  },
  lg: {
    height: "48px",
    padding: "0 24px",
    fontSize: "18px",
  },
};

const disabledStyles: React.CSSProperties = {
  opacity: 0.5,
  cursor: "not-allowed",
  pointerEvents: "none",
};

export const ButtonCva = React.forwardRef<HTMLButtonElement, ButtonCvaProps>(
  (
    { variant = "primary", size = "md", style, children, disabled, ...props },
    ref,
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const buttonStyle: React.CSSProperties = {
      ...baseStyles,
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...(isHovered && !disabled ? variantHoverStyles[variant] : {}),
      ...(disabled ? disabledStyles : {}),
      ...style,
    };

    return (
      <button
        ref={ref}
        style={buttonStyle}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {children}
      </button>
    );
  },
);

ButtonCva.displayName = "ButtonCva";
