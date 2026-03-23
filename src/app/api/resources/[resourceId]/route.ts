import { getUser } from "@/back/lib/auth-session";
import { ResourcesService } from "@/back/services/resources.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ resourceId: string }> }
) {
    const { resourceId } = await params;

    const resource = await ResourcesService.findByIdResource(resourceId);

    if (!resource) {
        return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    return NextResponse.json({ resource });
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ resourceId: string }> }
) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resourceId } = await params;
    const data = await req.json();

    const resource = await ResourcesService.findByIdResource(resourceId);

    if (!resource) {
        return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    const updatedResource = await ResourcesService.updateResource(resourceId, data);

    return NextResponse.json({ resource: updatedResource });
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ resourceId: string }> }
) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resourceId } = await params;

    const resource = await ResourcesService.findByIdResource(resourceId);

    if (!resource) {
        return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    await ResourcesService.deleteResource(resourceId);

    return NextResponse.json({
        message: `Resource ${resourceId} deleted`,
    });
}