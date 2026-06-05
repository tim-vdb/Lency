import { PostsService } from "@/back/services/posts.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { ids } = await req.json() as { ids: string[] };
        const validIds = await PostsService.validateIds(ids);
        return NextResponse.json({ validIds });
    } catch {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
