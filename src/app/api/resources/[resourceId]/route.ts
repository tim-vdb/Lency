import { ResourcesService } from "@/back/services/resources.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ resourceId: string }> }) {
    const { resourceId } = await params;

    const data = await ResourcesService.findByIdResource(resourceId);

    return NextResponse.json({ resource : data });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ resourceId: string }> }) {
    const { resourceId } = await params;
    const data = await req.json();

    const updatedResource = await ResourcesService.updateResource(resourceId, data);
    return NextResponse.json({ resource: updatedResource });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ resourceId: string }> }) {
    const { resourceId } = await params;

    await ResourcesService.deleteResource(resourceId);

    return NextResponse.json({ message: `Resource ${resourceId} deleted`,});
}