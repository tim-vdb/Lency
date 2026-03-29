import { SpotsService } from "@/back/services/spots.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ spotId: string }> }
) {
    try {
        const { spotId } = await params;
        const { rating } = await req.json();
        const updatedSpot = await SpotsService.rateSpot(spotId, rating);
        return NextResponse.json({ spot: updatedSpot });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Spot not found") {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
            if (error.message === "Rating must be between 1 and 5") {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}