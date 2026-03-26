import { BadgesService } from "@/back/services/badges.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const data = await BadgesService.findAllBadges();
        return NextResponse.json({ badges: data });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const newBadge = await BadgesService.createBadge(data);
        return NextResponse.json({ badge: newBadge }, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if (error.message === "Name is required" || error.message === "Description is required") {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}