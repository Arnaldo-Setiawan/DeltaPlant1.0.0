import { Liveblocks } from "@liveblocks/node";
import { NextRequest, NextResponse } from "next/server";

const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: NextRequest) {
    const { room } = await request.json();

    const session = liveblocks.prepareSession(
        `user-${Math.random()}`,
        {
            userInfo: {
                name: `User ${Math.random()}`,
                color: "#0099FF",
            },
        }
    );

    session.allow(room, session.FULL_ACCESS);

    const authResponse = await session.authorize();

    return NextResponse.json(authResponse);
}
