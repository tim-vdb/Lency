import { CategoriesService } from "@/back/services/categories.service";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const categories = await CategoriesService.findFollowedCategories();
        return NextResponse.json({ categories });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
