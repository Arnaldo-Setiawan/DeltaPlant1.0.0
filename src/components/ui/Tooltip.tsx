import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  label: string;
  side?: "top" | "right" | "bottom";
  children: ReactNode;
}

const positions = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  right: "left-full top-1/2 ml-2 -translate-y-1/2",
  bottom: "left-1/2 top-full mt-2 -translate-x-1/2",
};

export function Tooltip({ label, side = "right", children }: TooltipProps) {
  return (
    <span className="group/tooltip relative inline-flex">
      {children}
      <span
        className={cn(
          "pointer-events-none absolute z-50 whitespace-nowrap rounded-md border border-white/10 bg-stone-950 px-2 py-1 text-[11px] font-medium text-stone-100 opacity-0 shadow-xl shadow-black/30 transition group-hover/tooltip:opacity-100",
          positions[side],
        )}
      >
        {label}
      </span>
    </span>
  );
}
