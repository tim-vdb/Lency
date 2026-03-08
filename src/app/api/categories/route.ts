import { getUser } from "@/back/lib/auth-session";
import { CategoriesService } from "@/back/services/categories.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const data = await CategoriesService.findAllCategories();

    return NextResponse.json({ categories: data });
}

export async function POST(req: NextRequest) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, slug, description, iconUrl, bannerUrl, rules, lastPostAt } = await req.json();

    const newCategory = await CategoriesService.createCategory(user.id, { name, slug, description, iconUrl, bannerUrl, rules, lastPostAt });

    return NextResponse.json({ category: newCategory }, { status: 201 });
}