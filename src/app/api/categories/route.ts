import { getUser } from "@/back/lib/auth-session";
import { CategoriesService } from "@/back/services/categories.service";
import { NextResponse } from "next/server";

export async function GET() {
    const data = CategoriesService.findAllCategories();

    return NextResponse.json({ categories: data });
}

export async function POST(request: Request) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, slug, description, iconUrl, bannerUrl, rules, lastPostAt } = await request.json();

    const newCategory = CategoriesService.createCategory(user.id, { name, slug, description, iconUrl, bannerUrl, rules, lastPostAt });

    return NextResponse.json({ category: newCategory }, { status: 201 });
}