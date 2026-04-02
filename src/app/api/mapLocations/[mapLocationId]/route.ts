import { getUser } from "@/back/lib/auth-session";
import { MapLocationsService } from "@/back/services/mapLocations.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ mapLocationId: string }> }) {
    const { mapLocationId } = await params;

    const data = await MapLocationsService.findByIdMapLocation(mapLocationId);

    return NextResponse.json({ mapLocation: data });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ mapLocationId: string }> }) {
    const { mapLocationId } = await params;
    const data = await req.json();

    const updatedLocation = await MapLocationsService.updateMapLocation(
        mapLocationId,
        data
    );
    return NextResponse.json({ mapLocation: updatedLocation });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ mapLocationId: string }> }) {
    const { mapLocationId } = await params;

    await MapLocationsService.deleteMapLocation(mapLocationId);

    return NextResponse.json({ message: `Map location ${mapLocationId} deleted` });
}