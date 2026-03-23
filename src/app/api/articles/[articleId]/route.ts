import { getUser } from "@/back/lib/auth-session";
import { ArticlesService } from "@/back/services/articles.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ articleId: string }> }
) {
    const { articleId } = await params;

    const article = await ArticlesService.findByIdArticle(articleId);

    if (!article) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ article });
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ articleId: string }> }
) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { articleId } = await params;
    const data = await req.json();

    const article = await ArticlesService.findByIdArticle(articleId);

    if (!article) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    if (article.authorId !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedArticle = await ArticlesService.updateArticle(articleId, data);

    return NextResponse.json({ article: updatedArticle });
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ articleId: string }> }
) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { articleId } = await params;

    const article = await ArticlesService.findByIdArticle(articleId);

    if (!article) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    if (article.authorId !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await ArticlesService.deleteArticle(articleId);

    return NextResponse.json({
        message: `Article ${articleId} deleted`,
    });
}