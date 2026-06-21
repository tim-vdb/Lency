src/front/lib/ably-client.ts

"use client";

import * as Ably from "ably";

// Lazy singleton — only created in the browser (not during SSR).
// authUrl with a leading slash only works in a browser context.
let _client: Ably.Realtime | null = null;

function getClient(): Ably.Realtime {
    if (!_client) {
        _client = new Ably.Realtime({
            authUrl: "/api/ably/token",
            authMethod: "GET",
        });
    }
    return _client;
}

export const ablyClient: Ably.Realtime = new Proxy({} as Ably.Realtime, {
    get(_target, prop: keyof Ably.Realtime) {
        return getClient()[prop];
    },
});


-----------------
src/api/ably/token/route.ts

import * as Ably from "ably";
import { NextResponse } from "next/server";
import { getUser } from "@/back/lib/auth-session";

export async function GET() {
    const apiKey = process.env.ABLY_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "Ably API key not configured" }, { status: 500 });
    }

    try {
        const user = await getUser();
        // Use user ID as clientId for per-user channel scoping, fallback to "anonymous"
        const clientId = user?.id ?? "anonymous";

        const rest = new Ably.Rest(apiKey);
        const tokenRequest = await rest.auth.createTokenRequest({
            clientId,
            capability: { "*": ["subscribe", "publish"] },
        });
        console.log("[ably/token] issued token request capability:", JSON.stringify(tokenRequest.capability));
        return NextResponse.json(tokenRequest);
    } catch {
        return NextResponse.json({ error: "Failed to create Ably token" }, { status: 500 });
    }
}
