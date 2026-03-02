import { getUser } from "@/back/lib/auth-session";
import { PostsService } from "@/back/services/posts.service";
import { NextResponse } from "next/server";

export async function GET() {
    const data = PostsService.findAllPosts();

    return NextResponse.json({ posts: data });
}

export async function POST(request: Request) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, categoryId } = await request.json();

    const newPost = PostsService.createPost(user.id, { title, content, categoryId });

    return NextResponse.json({ post: newPost }, { status: 201 });
}
