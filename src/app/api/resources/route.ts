import { ResourcesService } from "@/back/services/resources.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const categoryId = req.nextUrl.searchParams.get("categoryId") ?? undefined;
        const authorId = req.nextUrl.searchParams.get("authorId") ?? undefined;
        const resources = await ResourcesService.findAllResources({ categoryId, authorId });
        return NextResponse.json({ resources });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const newResource = await ResourcesService.createResource(data);
        return NextResponse.json({ resource: newResource }, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if ([
                "Title is required",
                "Type is required",
                "Category is required",
            ].includes(error.message)) {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
        }
        console.error("[POST /api/resources]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
