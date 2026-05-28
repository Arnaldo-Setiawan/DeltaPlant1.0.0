import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  active?: boolean;
  children: ReactNode;
}

export function IconButton({
  label,
  active = false,
  className,
  children,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      data-active={active}
      className={cn(
        "grid h-11 w-11 shrink-0 place-items-center rounded-md border border-white/10 bg-white/[0.055] text-stone-300 outline-none transition hover:border-lime-300/35 hover:bg-lime-300/10 hover:text-lime-100 focus-visible:ring-2 focus-visible:ring-lime-300 data-[active=true]:border-lime-300/60 data-[active=true]:bg-lime-300 data-[active=true]:text-stone-950",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
