import { getUser } from "@/back/lib/auth-session";
import { ArticlesService } from "@/back/services/articles.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const data = await ArticlesService.findAllArticles();

    return NextResponse.json({ articles: data });
}

export async function POST(req: NextRequest) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, slug, excerpt, content, image } = await req.json();

    const newArticle = await ArticlesService.createArticle(user.id, {
        title,
        slug,
        excerpt,
        content,
        image,
    });

    return NextResponse.json({ article: newArticle }, { status: 201 });
}