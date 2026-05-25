import { PostsService } from "@/back/services/posts.service";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const authorId = searchParams.get("authorId") ?? undefined;
        const data = await PostsService.findAllPosts(authorId);
        return NextResponse.json({ posts: data });
    } catch (e) {
        console.error("[GET /api/posts]", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const newPost = await PostsService.createPost(data);
        revalidatePath("/community", "layout");
        revalidatePath("/user", "layout");
        return NextResponse.json({ post: newPost }, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if ([
                "Content is required",
                "Category is required",
            ].includes(error.message)) {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}