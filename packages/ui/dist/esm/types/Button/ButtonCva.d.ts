import React from "react";
export interface ButtonCvaProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    children: React.ReactNode;
}
export declare const ButtonCva: React.ForwardRefExoticComponent<ButtonCvaProps & React.RefAttributes<HTMLButtonElement>>;
