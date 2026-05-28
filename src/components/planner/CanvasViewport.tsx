"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type Konva from "konva";
import { Group, Image as KonvaImage, Layer, Line, Rect, Stage } from "react-konva";
import useImage from "use-image";
import { Layers3, RadioTower } from "lucide-react";
import type { PlannerMap, PlannerMapTile } from "@/types/assets";
import type { ToolId } from "@/types/canvas";

interface CanvasViewportProps {
  map: PlannerMap | null;
  activeTool: ToolId;
  activePhaseName: string;
  zoom: number;
  brushColor: string;
  brushSize: number;
  boardRevision: number;
}

interface SketchLine {
  id: string;
  points: number[];
  color: string;
  strokeWidth: number;
  mode: "draw" | "erase";
}

interface PanStart {
  pointerX: number;
  pointerY: number;
  panX: number;
  panY: number;
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

function MapTile({
  tile,
  x,
  y,
  size,
}: {
  tile: PlannerMapTile;
  x: number;
  y: number;
  size: number;
}) {
  const [image] = useImage(tile.src, "anonymous");

  return (
    <KonvaImage image={image} x={x} y={y} width={size} height={size} listening={false} />
  );
}

export function CanvasViewport({
  map,
  activeTool,
  activePhaseName,
  zoom,
  brushColor,
  brushSize,
  boardRevision,
}: CanvasViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const isDrawing = useRef(false);
  const activeLineId = useRef<string | null>(null);
  const panStart = useRef<PanStart | null>(null);

  const [stageSize, setStageSize] = useState({ width: 1, height: 1 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [lines, setLines] = useState<SketchLine[]>([]);

  const renderTiles = useMemo(
    () => map?.tiles.filter((tile) => tile.z === map.renderZoom) ?? [],
    [map],
  );

  const fitScale = useMemo(() => {
    if (!map) return 1;
    return Math.min(stageSize.width / map.width, stageSize.height / map.height) * 0.94;
  }, [map, stageSize.height, stageSize.width]);

  const mapScale = Math.max(0.05, fitScale * zoom);
  const mapOrigin = {
    x: map ? (stageSize.width - map.width * mapScale) / 2 + pan.x : 0,
    y: map ? (stageSize.height - map.height * mapScale) / 2 + pan.y : 0,
  };

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setStageSize({
        width: Math.max(1, entry.contentRect.width),
        height: Math.max(1, entry.contentRect.height),
      });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;
      setPan({ x: 0, y: 0 });
      setLines([]);
    });

    return () => {
      cancelled = true;
    };
  }, [map?.id]);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;
      setLines([]);
    });

    return () => {
      cancelled = true;
    };
  }, [boardRevision]);

  function getMapPoint() {
    const stage = stageRef.current;
    const pointer = stage?.getPointerPosition();
    if (!pointer || !map) return null;

    return {
      x: (pointer.x - mapOrigin.x) / mapScale,
      y: (pointer.y - mapOrigin.y) / mapScale,
    };
  }

  function isInsideMap(point: { x: number; y: number }) {
    if (!map) return false;
    return point.x >= 0 && point.x <= map.width && point.y >= 0 && point.y <= map.height;
  }

  function handlePointerDown(event: Konva.KonvaEventObject<MouseEvent | TouchEvent>) {
    event.evt.preventDefault();

    const pointer = stageRef.current?.getPointerPosition();
    if (!pointer) return;

    if (activeTool === "pan") {
      panStart.current = {
        pointerX: pointer.x,
        pointerY: pointer.y,
        panX: pan.x,
        panY: pan.y,
      };
      return;
    }

    if (activeTool !== "draw" && activeTool !== "erase") return;

    const point = getMapPoint();
    if (!point || !isInsideMap(point)) return;

    const id = createId();
    activeLineId.current = id;
    isDrawing.current = true;

    setLines((currentLines) => [
      ...currentLines,
      {
        id,
        points: [point.x, point.y],
        color: brushColor,
        strokeWidth: activeTool === "erase" ? Math.max(brushSize * 3, 16) : brushSize,
        mode: activeTool,
      },
    ]);
  }

  function handlePointerMove(event: Konva.KonvaEventObject<MouseEvent | TouchEvent>) {
    event.evt.preventDefault();

    const pointer = stageRef.current?.getPointerPosition();
    if (!pointer) return;

    if (activeTool === "pan" && panStart.current) {
      setPan({
        x: panStart.current.panX + pointer.x - panStart.current.pointerX,
        y: panStart.current.panY + pointer.y - panStart.current.pointerY,
      });
      return;
    }

    if (!isDrawing.current || !activeLineId.current) return;

    const point = getMapPoint();
    if (!point || !isInsideMap(point)) return;

    setLines((currentLines) =>
      currentLines.map((line) =>
        line.id === activeLineId.current
          ? { ...line, points: [...line.points, point.x, point.y] }
          : line,
      ),
    );
  }

  function handlePointerUp() {
    isDrawing.current = false;
    activeLineId.current = null;
    panStart.current = null;
  }

  const cursor =
    activeTool === "draw"
      ? "crosshair"
      : activeTool === "erase"
        ? "cell"
        : activeTool === "pan"
          ? "grab"
          : "default";

  return (
    <section
      ref={containerRef}
      className="relative min-h-[24rem] flex-1 overflow-hidden border border-white/10 bg-[#171813] lg:min-h-0"
    >
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        style={{ cursor }}
      >
        <Layer listening={false}>
          <Rect width={stageSize.width} height={stageSize.height} fill="#171813" />
          {map ? (
            <Group x={mapOrigin.x} y={mapOrigin.y} scaleX={mapScale} scaleY={mapScale}>
              <Rect width={map.width} height={map.height} fill="#0f100c" />
              {renderTiles.map((tile) => (
                <MapTile
                  key={`${map.id}-${tile.z}-${tile.x}-${tile.y}`}
                  tile={tile}
                  x={(tile.x - map.renderMinX) * map.tileSize}
                  y={(tile.y - map.renderMinY) * map.tileSize}
                  size={map.tileSize}
                />
              ))}
            </Group>
          ) : null}
        </Layer>

        <Layer>
          {map ? (
            <Group x={mapOrigin.x} y={mapOrigin.y} scaleX={mapScale} scaleY={mapScale}>
              {lines.map((line) => (
                <Line
                  key={line.id}
                  points={line.points}
                  stroke={line.color}
                  strokeWidth={line.strokeWidth}
                  tension={0.42}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={
                    line.mode === "erase" ? "destination-out" : "source-over"
                  }
                />
              ))}
            </Group>
          ) : null}
        </Layer>
      </Stage>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,rgba(0,0,0,0.04)_34%,rgba(0,0,0,0.28)_100%)]" />

      <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap items-center gap-2">
        <div className="inline-flex h-8 items-center gap-2 rounded-md border border-white/10 bg-black/35 px-2.5 text-xs font-semibold text-stone-100 backdrop-blur">
          <Layers3 className="h-3.5 w-3.5 text-lime-300" />
          <span className="max-w-[12rem] truncate">{map?.label ?? "No Map"}</span>
        </div>
        {map ? (
          <div className="inline-flex h-8 items-center rounded-md border border-white/10 bg-black/35 px-2.5 text-xs font-semibold text-stone-300 backdrop-blur">
            z{map.renderZoom} / {renderTiles.length} tiles
          </div>
        ) : null}
        <div className="inline-flex h-8 items-center gap-2 rounded-md border border-white/10 bg-black/35 px-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200 backdrop-blur">
          <RadioTower className="h-3.5 w-3.5" />
          {activePhaseName}
        </div>
      </div>

      <div className="pointer-events-none absolute right-3 top-3 rounded-md border border-white/10 bg-black/35 px-2.5 py-1.5 text-xs font-semibold text-stone-200 backdrop-blur">
        {Math.round(zoom * 100)}%
      </div>

      <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 rounded-md border border-white/10 bg-black/35 px-3 py-2 text-xs font-semibold text-stone-200 backdrop-blur">
        <span className="h-2 w-2 rounded-full bg-lime-300" />
        <span className="uppercase tracking-[0.14em]">{activeTool}</span>
      </div>
    </section>
  );
}
