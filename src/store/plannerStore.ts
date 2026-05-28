import { create } from "zustand";
import { defaultMap } from "@/config/maps";
import type { ToolId } from "@/types/canvas";

interface PlannerState {
  activeTool: ToolId;
  selectedMapId: string;
  brushColor: string;
  brushSize: number;
  zoom: number;
  roomCode: string | null;
  lastAction: string;
  boardRevision: number;
  setActiveTool: (tool: ToolId) => void;
  setSelectedMapId: (mapId: string) => void;
  setBrushColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  setZoom: (zoom: number) => void;
  setRoomCode: (roomCode: string | null) => void;
  setLastAction: (action: string) => void;
  clearBoard: () => void;
}

export const usePlannerStore = create<PlannerState>((set) => ({
  activeTool: "select",
  selectedMapId: defaultMap?.id ?? "",
  brushColor: "#f04438",
  brushSize: 6,
  zoom: 1,
  roomCode: null,
  lastAction: "Ready",
  boardRevision: 0,
  setActiveTool: (tool) => set({ activeTool: tool, lastAction: `${tool} tool` }),
  setSelectedMapId: (mapId) => set({ selectedMapId: mapId, lastAction: "Map selected" }),
  setBrushColor: (color) => set({ brushColor: color, lastAction: "Brush color" }),
  setBrushSize: (size) => set({ brushSize: size, lastAction: "Brush size" }),
  setZoom: (zoom) => set({ zoom, lastAction: "Zoom changed" }),
  setRoomCode: (roomCode) => set({ roomCode, lastAction: roomCode ? "Room created" : "Room closed" }),
  setLastAction: (action) => set({ lastAction: action }),
  clearBoard: () =>
    set((state) => ({ lastAction: "Board cleared", boardRevision: state.boardRevision + 1 })),
}));
