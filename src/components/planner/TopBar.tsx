"use client";

import { Download, Map, Settings, Share2, Upload, Users, X } from "lucide-react";
import type { PlannerMap } from "@/types/assets";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";

interface TopBarProps {
  maps: PlannerMap[];
  selectedMapId: string;
  roomCode: string | null;
  onMapChange: (mapId: string) => void;
  onCreateRoom: () => void;
  onLeaveRoom: () => void;
  onImport: () => void;
  onExport: () => void;
  onOpenSettings: () => void;
}

export function TopBar({
  maps,
  selectedMapId,
  roomCode,
  onMapChange,
  onCreateRoom,
  onLeaveRoom,
  onImport,
  onExport,
  onOpenSettings,
}: TopBarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 bg-[#151611]/95 px-3 text-stone-100 backdrop-blur md:px-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-lime-300/35 bg-lime-300 text-sm font-black text-stone-950">
          DP
        </div>
        <div className="hidden min-w-0 sm:block">
          <p className="truncate text-sm font-bold uppercase tracking-[0.18em] text-stone-100">
            DeltaPlant
          </p>
          <p className="truncate text-xs font-medium text-stone-500">Delta Force</p>
        </div>
      </div>

      <label className="ml-0 flex min-w-0 flex-1 items-center gap-2 md:ml-4 md:max-w-sm">
        <Map className="h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
        <select
          value={selectedMapId}
          onChange={(event) => onMapChange(event.target.value)}
          className="h-10 min-w-0 flex-1 rounded-md border border-white/10 bg-black/25 px-3 text-sm font-semibold text-stone-100 outline-none transition hover:border-cyan-300/45 focus:border-cyan-300"
          aria-label="Map"
        >
          {maps.map((map) => (
            <option key={map.id} value={map.id} className="bg-stone-950 text-stone-100">
              {map.label}
            </option>
          ))}
        </select>
      </label>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <Button
          variant={roomCode ? "primary" : "secondary"}
          size="sm"
          onClick={roomCode ? onLeaveRoom : onCreateRoom}
          title={roomCode ?? "Create Room"}
          className="hidden sm:inline-flex"
        >
          {roomCode ? <Users className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
          <span className="max-w-24 truncate">{roomCode ?? "Create Room"}</span>
          {roomCode ? <X className="h-3.5 w-3.5" /> : null}
        </Button>
        <IconButton label="Import Plan" onClick={onImport} className="hidden md:grid">
          <Upload className="h-4 w-4" />
        </IconButton>
        <IconButton label="Export Plan" onClick={onExport} className="hidden md:grid">
          <Download className="h-4 w-4" />
        </IconButton>
        <IconButton label="Settings" onClick={onOpenSettings}>
          <Settings className="h-4 w-4" />
        </IconButton>
      </div>
    </header>
  );
}
