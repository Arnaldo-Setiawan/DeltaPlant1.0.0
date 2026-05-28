import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-lime-300/40 bg-lime-300 text-stone-950 hover:bg-lime-200 focus-visible:ring-lime-300",
  secondary:
    "border-white/10 bg-white/[0.07] text-stone-100 hover:bg-white/[0.12] focus-visible:ring-cyan-300",
  ghost:
    "border-transparent bg-transparent text-stone-300 hover:bg-white/[0.08] hover:text-white focus-visible:ring-cyan-300",
  danger:
    "border-red-400/40 bg-red-500/15 text-red-100 hover:bg-red-500/25 focus-visible:ring-red-300",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
};

export function Button({
  children,
  className,
  variant = "secondary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-md border font-semibold outline-none transition focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-45",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
