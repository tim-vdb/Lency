import { ArticlesService } from "@/back/services/articles.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ articleId: string }> }) {
    const { articleId } = await params;

    const data = await ArticlesService.findByIdArticle(articleId);

    return NextResponse.json({ article: data });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ articleId: string }> }) {
    const { articleId } = await params;
    const data = await req.json();

    const updatedArticle = await ArticlesService.updateArticle(articleId, data);
    return NextResponse.json({ article: updatedArticle });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ articleId: string }> }) {
    const { articleId } = await params;
   
    await ArticlesService.deleteArticle(articleId);

    return NextResponse.json({ message: `Article ${articleId} deleted`,});
}