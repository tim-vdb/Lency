import { ResourcesService } from "@/back/services/resources.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ resourceId: string }> }
) {
    try {
        const { resourceId } = await params;
        const data = await ResourcesService.findByIdResource(resourceId);
        return NextResponse.json({ resource: data });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Resource not found") {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ resourceId: string }> }
) {
    try {
        const { resourceId } = await params;
        const data = await req.json();
        const updatedResource = await ResourcesService.updateResource(resourceId, data);
        return NextResponse.json({ resource: updatedResource });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if (error.message === "Resource not found") {
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
    { params }: { params: Promise<{ resourceId: string }> }
) {
    try {
        const { resourceId } = await params;
        await ResourcesService.deleteResource(resourceId);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if (error.message === "Resource not found") {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}