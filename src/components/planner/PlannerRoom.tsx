"use client";

import { useSearchParams } from "next/navigation";
import { RoomProvider } from "@liveblocks/react";
import { PlannerShell } from "./PlannerShell";
import { toLiveblocksRoomId } from "@/lib/liveblocks";

export function PlannerRoom() {
  const searchParams = useSearchParams();
  const roomCode = searchParams.get("room");
  const roomId = toLiveblocksRoomId(roomCode);

  return (
    <RoomProvider id={roomId} initialPresence={{}}>
      <PlannerShell />
    </RoomProvider>
  );
}
