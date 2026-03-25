import { PostsService } from "@/back/services/posts.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
    const { postId } = await params;
    
    const data = await PostsService.findByIdPost(postId);
    
    return NextResponse.json({ post : data });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
    const { postId } = await params;
    const data = await req.json();

    const updatedPost = await PostsService.updatePost(postId, data);
    return NextResponse.json({ message: `Post ${postId} updated`, updatedPost });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
    const { postId } = await params;
    
    await PostsService.deletePost(postId);

    return NextResponse.json({ message: `Post ${postId} deleted` });
}