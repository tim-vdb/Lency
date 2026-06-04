import { PostsService } from "@/back/services/posts.service";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const posts = await PostsService.findDrafts();
        return NextResponse.json({ posts });
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
