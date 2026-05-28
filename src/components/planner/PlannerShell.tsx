"use client";

import { useEffect, useMemo } from "react";
import { AssetTray } from "@/components/planner/AssetTray";
import { BottomTimeline } from "@/components/planner/BottomTimeline";
import { CanvasViewport } from "@/components/planner/CanvasViewport";
import { LeftToolbar } from "@/components/planner/LeftToolbar";
import { SettingsPanel } from "@/components/planner/SettingsPanel";
import { TopBar } from "@/components/planner/TopBar";
import { plannerAssets } from "@/config/assets";
import { deltaForceMaps } from "@/config/maps";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useRoomCode } from "@/hooks/useRoomCode";
import { usePhaseStore } from "@/store/phaseStore";
import { usePlannerStore } from "@/store/plannerStore";
import type { AssetCategory, PlannerAsset } from "@/types/assets";
import type { ToolId } from "@/types/canvas";

const assetToolByCategory: Partial<Record<AssetCategory, ToolId>> = {
  pin: "pin",
  vehicle: "vehicle",
  construct: "construct",
};

export function PlannerShell() {
  const activeTool = usePlannerStore((state) => state.activeTool);
  const selectedMapId = usePlannerStore((state) => state.selectedMapId);
  const brushColor = usePlannerStore((state) => state.brushColor);
  const brushSize = usePlannerStore((state) => state.brushSize);
  const zoom = usePlannerStore((state) => state.zoom);
  const lastAction = usePlannerStore((state) => state.lastAction);
  const boardRevision = usePlannerStore((state) => state.boardRevision);
  const setActiveTool = usePlannerStore((state) => state.setActiveTool);
  const setSelectedMapId = usePlannerStore((state) => state.setSelectedMapId);
  const setBrushColor = usePlannerStore((state) => state.setBrushColor);
  const setBrushSize = usePlannerStore((state) => state.setBrushSize);
  const setZoom = usePlannerStore((state) => state.setZoom);
  const setRoomCode = usePlannerStore((state) => state.setRoomCode);
  const setLastAction = usePlannerStore((state) => state.setLastAction);
  const clearBoard = usePlannerStore((state) => state.clearBoard);

  const phases = usePhaseStore((state) => state.phases);
  const activePhaseId = usePhaseStore((state) => state.activePhaseId);
  const setActivePhaseId = usePhaseStore((state) => state.setActivePhaseId);

  const { roomCode, createRoom, clearRoom } = useRoomCode();

  const selectedMap =
    deltaForceMaps.find((map) => map.id === selectedMapId) ?? deltaForceMaps[0] ?? null;
  const activePhase = phases.find((phase) => phase.id === activePhaseId) ?? phases[0];

  useEffect(() => {
    if (roomCode) {
      setRoomCode(roomCode);
    }
  }, [roomCode, setRoomCode]);

  const shortcutHandlers = useMemo(
    () => ({
      onUndo: () => setLastAction("Undo"),
      onRedo: () => setLastAction("Redo"),
      onCopy: () => setLastAction("Copy"),
      onPaste: () => setLastAction("Paste"),
      onClear: clearBoard,
    }),
    [clearBoard, setLastAction],
  );

  useKeyboardShortcuts(shortcutHandlers);

  function handleCreateRoom() {
    const nextRoomCode = createRoom();
    setRoomCode(nextRoomCode);
  }

  function handleLeaveRoom() {
    clearRoom();
    setRoomCode(null);
  }

  function handleSelectAsset(asset: PlannerAsset) {
    const tool = assetToolByCategory[asset.category];
    if (tool) setActiveTool(tool);
    setLastAction(asset.label);
  }

  return (
    <div className="flex min-h-dvh flex-col overflow-hidden bg-[#0f100c] text-stone-100">
      <TopBar
        maps={deltaForceMaps}
        selectedMapId={selectedMap?.id ?? ""}
        roomCode={roomCode}
        onMapChange={setSelectedMapId}
        onCreateRoom={handleCreateRoom}
        onLeaveRoom={handleLeaveRoom}
        onImport={() => setLastAction("Import")}
        onExport={() => setLastAction("Export")}
        onOpenSettings={() => setLastAction("Settings")}
      />

      <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[auto_minmax(0,1fr)_auto_auto] lg:grid-cols-[4.25rem_minmax(0,1fr)_19rem] lg:grid-rows-[minmax(0,1fr)_5.75rem]">
        <LeftToolbar activeTool={activeTool} onToolChange={setActiveTool} />

        <main className="flex min-h-0 flex-col p-2 lg:p-3">
          <CanvasViewport
            map={selectedMap}
            activeTool={activeTool}
            activePhaseName={activePhase.name}
            zoom={zoom}
            brushColor={brushColor}
            brushSize={brushSize}
            boardRevision={boardRevision}
          />
          <AssetTray assets={plannerAssets} onSelectAsset={handleSelectAsset} />
        </main>

        <SettingsPanel
          brushColor={brushColor}
          brushSize={brushSize}
          zoom={zoom}
          lastAction={lastAction}
          activePhaseName={activePhase.name}
          onBrushColorChange={setBrushColor}
          onBrushSizeChange={setBrushSize}
          onZoomChange={setZoom}
          onClearBoard={clearBoard}
        />

        <div className="lg:col-span-2 lg:col-start-2">
          <BottomTimeline
            phases={phases}
            activePhaseId={activePhaseId}
            onPhaseChange={setActivePhaseId}
          />
        </div>
      </div>
    </div>
  );
}
