import type { CanvasElement } from "@/types/canvas";
import type { PlannerPhase } from "@/types/phases";

export interface PlannerDocument {
  version: "1.0";
  name: string;
  mapId: string;
  activePhaseId: string;
  phases: PlannerPhase[];
  elements: CanvasElement[];
}
