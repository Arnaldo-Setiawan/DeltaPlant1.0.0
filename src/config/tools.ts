import type { ToolId } from "@/types/canvas";

export interface PlannerTool {
  id: ToolId;
  label: string;
  shortcut: string;
}

export const plannerTools: PlannerTool[] = [
  { id: "select", label: "Select", shortcut: "V" },
  { id: "pan", label: "Pan", shortcut: "H" },
  { id: "draw", label: "Draw", shortcut: "B" },
  { id: "erase", label: "Erase", shortcut: "E" },
  { id: "polygon", label: "Polygon", shortcut: "P" },
  { id: "pin", label: "Player Pin", shortcut: "1" },
  { id: "vehicle", label: "Vehicle", shortcut: "2" },
  { id: "construct", label: "Construct", shortcut: "3" },
];
