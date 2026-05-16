import { CommentsService } from "@/back/services/comments.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
    try {
        const { postId } = await params;
        const data = await CommentsService.findAllComments(postId);
        return NextResponse.json({ comments: data });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const newComment = await CommentsService.createComment(data);
        return NextResponse.json({ comment: newComment }, { status: 201 });
    } catch (error) {
        console.error("[POST /api/posts/:postId/comments]", error);
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if (error.message === "Content is required" || error.message === "Post is required") {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}