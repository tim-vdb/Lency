import { getUser } from "@/back/lib/auth-session";
import { BadgesService } from "@/back/services/badges.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const data = await BadgesService.findAllBadges();

    return NextResponse.json({ badges: data });
}

export async function POST(req: NextRequest) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, iconUrl, active } = await req.json();

    const newBadge = await BadgesService.createBadge({
        name,
        description,
        iconUrl,
        active,
    });

    return NextResponse.json({ badge: newBadge }, { status: 201 });
}