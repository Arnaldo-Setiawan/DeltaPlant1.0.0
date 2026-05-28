"use client";

import { Play, StepForward } from "lucide-react";
import type { PlannerPhase } from "@/types/phases";
import { cn } from "@/lib/utils";

interface BottomTimelineProps {
  phases: PlannerPhase[];
  activePhaseId: string;
  onPhaseChange: (phaseId: string) => void;
}

export function BottomTimeline({ phases, activePhaseId, onPhaseChange }: BottomTimelineProps) {
  return (
    <footer className="flex min-h-22 items-center gap-3 overflow-x-auto border-t border-white/10 bg-[#151611] px-3 py-3">
      <div className="hidden h-12 w-12 shrink-0 place-items-center rounded-md border border-lime-300/35 bg-lime-300 text-stone-950 md:grid">
        <Play className="h-4 w-4 fill-current" />
      </div>
      <div className="grid min-w-[34rem] flex-1 grid-cols-3 gap-2">
        {phases.map((phase) => {
          const active = phase.id === activePhaseId;

          return (
            <button
              type="button"
              key={phase.id}
              onClick={() => onPhaseChange(phase.id)}
              className={cn(
                "flex h-14 min-w-0 items-center gap-3 rounded-md border px-3 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-lime-300",
                active
                  ? "border-lime-300/60 bg-lime-300 text-stone-950"
                  : "border-white/10 bg-white/[0.055] text-stone-300 hover:border-lime-300/35 hover:bg-lime-300/10",
              )}
            >
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-md border text-xs font-black",
                  active ? "border-stone-950/20 bg-stone-950/10" : "border-white/10 bg-black/20",
                )}
              >
                {phase.order}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold">{phase.name}</span>
                <span className="block truncate text-[11px] font-semibold uppercase tracking-[0.14em] opacity-70">
                  Step {phase.order}
                </span>
              </span>
              <StepForward className="ml-auto h-4 w-4 shrink-0 opacity-60" />
            </button>
          );
        })}
      </div>
    </footer>
  );
}
