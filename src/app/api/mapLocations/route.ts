import { getUser } from "@/back/lib/auth-session";
import { MapLocationsService } from "@/back/services/mapLocations.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const mapLocations = await MapLocationsService.findAllMapLocations();

    return NextResponse.json({ mapLocations });
}

export async function POST(req: NextRequest) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, latitude, longitude, description } = await req.json();

    const newLocation = await MapLocationsService.createMapLocation({
        name,
        latitude,
        longitude,
        description,
    });

    return NextResponse.json({ mapLocation: newLocation }, { status: 201 });
}