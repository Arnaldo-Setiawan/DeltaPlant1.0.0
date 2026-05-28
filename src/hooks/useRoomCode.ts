"use client";

import { useCallback } from "react";
import { customAlphabet } from "nanoid/non-secure";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const createCode = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

export function useRoomCode() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const roomCode = searchParams.get("room")?.toUpperCase() ?? null;

  const createRoom = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    const code = createCode();
    params.set("room", code);
    router.replace(`${pathname}?${params.toString()}`);
    return code;
  }, [pathname, router, searchParams]);

  const clearRoom = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("room");
    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  }, [pathname, router, searchParams]);

  return { roomCode, createRoom, clearRoom };
}
