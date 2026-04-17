import { SpotsService } from "@/back/services/spots.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const spots = await SpotsService.findAllSpots();
        return NextResponse.json({ spots });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const newSpot = await SpotsService.createSpot(data);
        return NextResponse.json({ spot: newSpot }, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            if ([
                "Name is required",
                "Description is required",
                "Address is required",
                "City is required",
                "Author is required",
                "Map location is required",
                "Location name is required",
                "Latitude is required",
                "Longitude is required",
            ].includes(error.message)) {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}