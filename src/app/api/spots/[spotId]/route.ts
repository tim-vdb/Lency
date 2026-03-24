import { SpotsService } from "@/back/services/spots.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ spotId: string }> } ) {
    const { spotId } = await params;

    const data = await SpotsService.findByIdSpot(spotId);

    return NextResponse.json({ spot: data });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ spotId: string }> }) {
    const { spotId } = await params;
    const data = await req.json();

    const updatedSpot = await SpotsService.updateSpot(spotId, data);
    return NextResponse.json({ spot: updatedSpot });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ spotId: string }> }) {
    const { spotId } = await params;

    await SpotsService.deleteSpot(spotId);

    return NextResponse.json({message: `Spot ${spotId} deleted`,});
}