import { ArticlesService } from "@/back/services/articles.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const data = await ArticlesService.findAllArticles();
        return NextResponse.json({ articles: data });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const newArticle = await ArticlesService.createArticle(data);
        return NextResponse.json({ article: newArticle }, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if (error.message === "Title is required" || error.message === "Slug is required" || error.message === "Content is required") {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}