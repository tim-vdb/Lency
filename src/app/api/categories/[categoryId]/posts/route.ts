import { CategoriesService } from "@/back/services/categories.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ categoryId: string }> }
) {
    try {
        const { categoryId } = await params;
        const posts = await CategoriesService.findPostsByCategory(categoryId);
        return NextResponse.json({ posts });
    } catch (error) {
        if (error instanceof Error && error.message === "Category not found") {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
