export type AssetCategory = "pin" | "vehicle" | "construct";

export interface PlannerAsset {
  id: string;
  label: string;
  category: AssetCategory;
  src: string;
  source?: string;
}

export interface PlannerMapTile {
  z: number;
  x: number;
  y: number;
  src: string;
  source?: string;
}

export interface PlannerMap {
  id: string;
  label: string;
  tileTemplate: string;
  baseTileSrc: string;
  tileSize: number;
  minZoom: number;
  maxZoom: number;
  renderZoom: number;
  renderMinX: number;
  renderMaxX: number;
  renderMinY: number;
  renderMaxY: number;
  width: number;
  height: number;
  tiles: readonly PlannerMapTile[];
}
