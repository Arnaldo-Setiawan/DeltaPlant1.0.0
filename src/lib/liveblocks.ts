export const LIVEBLOCKS_AUTH_ENDPOINT = "/api/liveblocks-auth";
export const LOCAL_ROOM_ID = "local-plan";

export function toLiveblocksRoomId(roomCode: string | null) {
  return roomCode ? `delta-force:${roomCode.toUpperCase()}` : LOCAL_ROOM_ID;
}
