import { PostsService } from "@/back/services/posts.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    _req: NextRequest,
    { params }: { params: Promise<{ postId: string }> }
) {
    try {
        const { postId } = await params;
        const result = await PostsService.toggleVotePost(postId);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }
        if (error instanceof Error && error.message === "Post not found") {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
