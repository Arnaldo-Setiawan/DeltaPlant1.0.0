"use client";

import { Brush, RotateCcw, SlidersHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const brushColors = ["#f04438", "#f59e0b", "#20c997", "#38bdf8", "#f8fafc"];

interface SettingsPanelProps {
  brushColor: string;
  brushSize: number;
  zoom: number;
  lastAction: string;
  activePhaseName: string;
  onBrushColorChange: (color: string) => void;
  onBrushSizeChange: (size: number) => void;
  onZoomChange: (zoom: number) => void;
  onClearBoard: () => void;
}

export function SettingsPanel({
  brushColor,
  brushSize,
  zoom,
  lastAction,
  activePhaseName,
  onBrushColorChange,
  onBrushSizeChange,
  onZoomChange,
  onClearBoard,
}: SettingsPanelProps) {
  return (
    <aside className="min-w-0 border-t border-white/10 bg-[#11120f] lg:border-l lg:border-t-0">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <SlidersHorizontal className="h-4 w-4 text-cyan-300" />
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-stone-300">Settings</h2>
      </div>

      <div className="grid gap-5 p-4">
        <section className="grid gap-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
            <Brush className="h-3.5 w-3.5" />
            Brush
          </div>
          <div className="flex flex-wrap gap-2">
            {brushColors.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={`Brush color ${color}`}
                onClick={() => onBrushColorChange(color)}
                className={cn(
                  "h-8 w-8 rounded-md border border-white/10 outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-300",
                  brushColor === color && "ring-2 ring-lime-300",
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <label className="grid gap-2 text-xs font-semibold text-stone-400">
            <span>Size {brushSize}px</span>
            <input
              type="range"
              min={2}
              max={28}
              value={brushSize}
              onChange={(event) => onBrushSizeChange(Number(event.target.value))}
              className="accent-lime-300"
            />
          </label>
        </section>

        <section className="grid gap-3">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">View</div>
          <label className="grid gap-2 text-xs font-semibold text-stone-400">
            <span>Zoom {Math.round(zoom * 100)}%</span>
            <input
              type="range"
              min={0.5}
              max={2.5}
              step={0.05}
              value={zoom}
              onChange={(event) => onZoomChange(Number(event.target.value))}
              className="accent-cyan-300"
            />
          </label>
          <Button variant="ghost" size="sm" onClick={() => onZoomChange(1)} className="justify-start">
            <RotateCcw className="h-4 w-4" />
            Reset View
          </Button>
        </section>

        <section className="grid gap-2 rounded-md border border-white/10 bg-black/20 p-3">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-stone-500">Phase</span>
            <span className="truncate font-bold text-stone-200">{activePhaseName}</span>
          </div>
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-stone-500">Status</span>
            <span className="truncate font-bold text-lime-200">{lastAction}</span>
          </div>
        </section>

        <Button variant="danger" onClick={onClearBoard} className="w-full justify-start">
          <Trash2 className="h-4 w-4" />
          Clear Board
        </Button>
      </div>
    </aside>
  );
}
