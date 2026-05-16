import { CommentsService } from "@/back/services/comments.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ resourceId: string }> }
) {
    try {
        const { resourceId } = await params;
        const data = await CommentsService.findByResourceId(resourceId);
        return NextResponse.json({ comments: data });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ resourceId: string }> }
) {
    try {
        const { resourceId } = await params;
        const data = await req.json();
        const newComment = await CommentsService.createComment({ ...data, resourceId });
        return NextResponse.json({ comment: newComment }, { status: 201 });
    } catch (error) {
        console.error("[POST /api/resources/:resourceId/comments]", error);
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if (["Content is required", "Target is required"].includes(error.message)) {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
