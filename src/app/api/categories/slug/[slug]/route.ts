import { CategoriesService } from "@/back/services/categories.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const category = await CategoriesService.findBySlugCategory(slug);
        return NextResponse.json({ category });
    } catch (error) {
        if (error instanceof Error && error.message === "Category not found") {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
