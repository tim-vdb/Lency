import { CategoriesService } from "@/back/services/categories.service";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const posts = await CategoriesService.findFollowedCategoryPosts();
        return NextResponse.json({ posts });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
