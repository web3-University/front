import React from "react";

interface ButtonCvaProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}
declare const ButtonCva: React.ForwardRefExoticComponent<
  ButtonCvaProps & React.RefAttributes<HTMLButtonElement>
>;

export { ButtonCva };
export type { ButtonCvaProps };
