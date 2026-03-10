"use client";
import React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "destructive" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent-indigo hover:bg-[#4f46e5] text-white border-transparent",
  secondary:
    "bg-board-surface hover:bg-board-card text-text-secondary border border-board-borderHover",
  destructive:
    "bg-priority-highBg hover:bg-[#6b1a1a] text-priority-highText border border-priority-highText/40",
  ghost:
    "bg-transparent hover:bg-board-card text-text-muted border-transparent",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-5 py-2.5 text-sm gap-2",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", className, children, disabled, ...rest },
    ref
  ) => (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium border",
        "transition-all duration-150 focus:outline-none focus-visible:ring-2",
        "focus-visible:ring-accent-indigo focus-visible:ring-offset-1",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
);

Button.displayName = "Button";
