import { getUser } from "@/back/lib/auth-session";
import { CommentsService } from "@/back/services/comments.service";
import { NextResponse } from "next/server";

export async function GET() {
    const data = CommentsService.findAllComments();

    return NextResponse.json({ comments: data });
}

export async function POST(req: Request) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { content, postId, authorId, parentId, upvoteCount } = await req.json();
    const newComment = CommentsService.createComment(user.id, { content, postId, authorId, parentId, upvoteCount })
    return NextResponse.json({ comment: newComment }, { status: 201 });
}
