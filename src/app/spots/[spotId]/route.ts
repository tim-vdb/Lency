import { getUser } from "@/back/lib/auth-session";
import { SpotsService } from "@/back/services/spots.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ spotId: string }> }
) {
    const { spotId } = await params;

    const spot = await SpotsService.findByIdSpot(spotId);

    if (!spot) {
        return NextResponse.json({ error: "Spot not found" }, { status: 404 });
    }

    return NextResponse.json({ spot });
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ spotId: string }> }
) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { spotId } = await params;
    const data = await req.json();

    const spot = await SpotsService.findByIdSpot(spotId);

    if (!spot) {
        return NextResponse.json({ error: "Spot not found" }, { status: 404 });
    }

    const updatedSpot = await SpotsService.updateSpot(spotId, data);

    return NextResponse.json({ spot: updatedSpot });
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ spotId: string }> }
) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { spotId } = await params;

    const spot = await SpotsService.findByIdSpot(spotId);

    if (!spot) {
        return NextResponse.json({ error: "Spot not found" }, { status: 404 });
    }

    await SpotsService.deleteSpot(spotId);

    return NextResponse.json({
        message: `Spot ${spotId} deleted`,
    });
}