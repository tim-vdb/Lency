import { SpotsService } from "@/back/services/spots.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ spotId: string }> }
) {
    try {
        const { spotId } = await params;
        const data = await SpotsService.findByIdSpot(spotId);
        return NextResponse.json({ spot: data });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Spot not found") {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ spotId: string }> }
) {
    try {
        const { spotId } = await params;
        const data = await req.json();
        const updatedSpot = await SpotsService.updateSpot(spotId, data);
        return NextResponse.json({ spot: updatedSpot });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if (error.message === "Forbidden") {
                return NextResponse.json({ error: error.message }, { status: 403 });
            }
            if (error.message === "Spot not found") {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
            if (error.message === "No data to update") {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ spotId: string }> }
) {
    try {
        const { spotId } = await params;
        await SpotsService.deleteSpot(spotId);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if (error.message === "Forbidden") {
                return NextResponse.json({ error: error.message }, { status: 403 });
            }
            if (error.message === "Spot not found") {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}