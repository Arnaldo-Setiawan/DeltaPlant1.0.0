import { generatedMapTileSets } from "@/config/generated-assets";
import type { PlannerMap } from "@/types/assets";

export const deltaForceMaps: PlannerMap[] = [...generatedMapTileSets];

export const defaultMap =
  deltaForceMaps.find((map) => map.id === "delta-force-directory") ?? deltaForceMaps[0] ?? null;
