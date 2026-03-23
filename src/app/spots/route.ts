import { getUser } from "@/back/lib/auth-session";
import { SpotsService } from "@/back/services/spots.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const spots = await SpotsService.findAllSpots();

    return NextResponse.json({ spots });
}

export async function POST(req: NextRequest) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
        name,
        description,
        address,
        city,
        author,
        rating,
        rating_count,
        mapLocationId,
    } = await req.json();

    const newSpot = await SpotsService.createSpot({
        name,
        description,
        address,
        city,
        author,
        rating,
        rating_count,
        mapLocationId,
    });

    return NextResponse.json({ spot: newSpot }, { status: 201 });
}