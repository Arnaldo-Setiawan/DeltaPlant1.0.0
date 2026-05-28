export type ToolId =
  | "select"
  | "pan"
  | "draw"
  | "erase"
  | "polygon"
  | "pin"
  | "vehicle"
  | "construct";

export interface CanvasElementBase {
  id: string;
  phaseId: string;
  x: number;
  y: number;
  rotation: number;
  opacity: number;
  locked?: boolean;
}

export interface DrawingElement extends CanvasElementBase {
  type: "drawing";
  points: number[];
  stroke: string;
  strokeWidth: number;
}

export interface PolygonElement extends CanvasElementBase {
  type: "polygon";
  points: number[];
  fill: string;
  stroke: string;
}

export interface AssetElement extends CanvasElementBase {
  type: "asset";
  assetId: string;
  width: number;
  height: number;
}

export type CanvasElement = DrawingElement | PolygonElement | AssetElement;
