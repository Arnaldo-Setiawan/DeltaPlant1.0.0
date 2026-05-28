"use client";

import {
  Eraser,
  Hand,
  MapPin,
  MousePointer2,
  Pencil,
  Pentagon,
  Shield,
  Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { plannerTools } from "@/config/tools";
import type { ToolId } from "@/types/canvas";
import { IconButton } from "@/components/ui/IconButton";
import { Separator } from "@/components/ui/Separator";
import { Tooltip } from "@/components/ui/Tooltip";

const icons: Record<ToolId, LucideIcon> = {
  select: MousePointer2,
  pan: Hand,
  draw: Pencil,
  erase: Eraser,
  polygon: Pentagon,
  pin: MapPin,
  vehicle: Truck,
  construct: Shield,
};

interface LeftToolbarProps {
  activeTool: ToolId;
  onToolChange: (tool: ToolId) => void;
}

export function LeftToolbar({ activeTool, onToolChange }: LeftToolbarProps) {
  const primaryTools = plannerTools.slice(0, 5);
  const assetTools = plannerTools.slice(5);

  return (
    <aside className="flex min-w-0 items-center gap-2 overflow-x-auto border-b border-white/10 bg-[#11120f] p-2 lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r">
      {primaryTools.map((tool) => {
        const Icon = icons[tool.id];

        return (
          <Tooltip key={tool.id} label={`${tool.label} (${tool.shortcut})`} side="right">
            <IconButton
              label={tool.label}
              active={activeTool === tool.id}
              onClick={() => onToolChange(tool.id)}
            >
              <Icon className="h-4.5 w-4.5" />
            </IconButton>
          </Tooltip>
        );
      })}

      <Separator className="hidden lg:block" />
      <Separator orientation="vertical" className="h-8 lg:hidden" />

      {assetTools.map((tool) => {
        const Icon = icons[tool.id];

        return (
          <Tooltip key={tool.id} label={`${tool.label} (${tool.shortcut})`} side="right">
            <IconButton
              label={tool.label}
              active={activeTool === tool.id}
              onClick={() => onToolChange(tool.id)}
            >
              <Icon className="h-4.5 w-4.5" />
            </IconButton>
          </Tooltip>
        );
      })}
    </aside>
  );
}
