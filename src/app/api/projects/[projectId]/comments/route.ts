import { CommentsService } from "@/back/services/comments.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ projectId: string }> }
) {
    try {
        const { projectId } = await params;
        const data = await CommentsService.findByProjectId(projectId);
        return NextResponse.json({ comments: data });
    } catch (err) {
        console.error("[GET /api/projects/:projectId/comments]", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ projectId: string }> }
) {
    try {
        const { projectId } = await params;
        const data = await req.json();
        const newComment = await CommentsService.createComment({ ...data, projectId });
        return NextResponse.json({ comment: newComment }, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized")
                return NextResponse.json({ error: error.message }, { status: 401 });
            if (error.message === "Project not found")
                return NextResponse.json({ error: error.message }, { status: 404 });
            if (["Content is required", "Target is required"].includes(error.message))
                return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
