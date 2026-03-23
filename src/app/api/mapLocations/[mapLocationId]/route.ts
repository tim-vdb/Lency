import { getUser } from "@/back/lib/auth-session";
import { MapLocationsService } from "@/back/services/mapLocations.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ mapLocationId: string }> }
) {
    const { mapLocationId } = await params;

    const mapLocation = await MapLocationsService.findByIdMapLocation(mapLocationId);

    if (!mapLocation) {
        return NextResponse.json({ error: "Map location not found" }, { status: 404 });
    }

    return NextResponse.json({ mapLocation });
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ mapLocationId: string }> }
) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { mapLocationId } = await params;
    const data = await req.json();

    const mapLocation = await MapLocationsService.findByIdMapLocation(mapLocationId);

    if (!mapLocation) {
        return NextResponse.json({ error: "Map location not found" }, { status: 404 });
    }

    const updatedLocation = await MapLocationsService.updateMapLocation(
        mapLocationId,
        data
    );

    return NextResponse.json({ mapLocation: updatedLocation });
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ mapLocationId: string }> }
) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { mapLocationId } = await params;

    const mapLocation = await MapLocationsService.findByIdMapLocation(mapLocationId);

    if (!mapLocation) {
        return NextResponse.json({ error: "Map location not found" }, { status: 404 });
    }

    await MapLocationsService.deleteMapLocation(mapLocationId);

    return NextResponse.json({
        message: `Map location ${mapLocationId} deleted`,
    });
}