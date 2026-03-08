import { CommentsService } from "@/back/services/comments.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ commentId: string }> }) {
    const { commentId } = await params;
    const comment = await CommentsService.findByIdComment(commentId);
    if (!comment) {
        return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({ comment });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ commentId: string }> }) {
    const { commentId } = await params;
    const data = await req.json();

    const updatedComment = await CommentsService.updateComment(commentId, data);

    return NextResponse.json({ message: `Comment ${commentId} updated`, updatedComment });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ commentId: string }> }) {
    const { commentId } = await params;
    await CommentsService.deleteComment(commentId);
    return NextResponse.json({ message: `Comment ${commentId} deleted` });
}