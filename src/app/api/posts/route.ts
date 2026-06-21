import { PostsService } from "@/back/services/posts.service";
import { createPostSchema } from "@/back/schemas/zod/post.zod";
import { createZodRoute } from "next-zod-route";
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
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export const POST = createZodRoute()
    .body(createPostSchema)
    .handler(async (_req, { body }) => {
        try {
            const newPost = await PostsService.createPost(body);
            revalidatePath("/community", "layout");
            revalidatePath("/user", "layout");
            return NextResponse.json({ post: newPost }, { status: 201 });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Unauthorized")
                    return NextResponse.json({ error: error.message }, { status: 401 });
            }
            return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
        }
    });
