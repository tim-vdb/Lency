import { ResourcesService } from "@/back/services/resources.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    _req: NextRequest,
    { params }: { params: Promise<{ resourceId: string }> }
) {
    try {
        const { resourceId } = await params;
        const result = await ResourcesService.toggleSaveResource(resourceId);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }
        if (error instanceof Error && error.message === "Resource not found") {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
