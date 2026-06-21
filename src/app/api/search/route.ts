import { NextRequest, NextResponse } from "next/server";
import { SearchService } from "@/back/services/search.service";

export async function GET(req: NextRequest) {
    try {
        const query = req.nextUrl.searchParams.get("q")?.trim() ?? "";
        const result = await SearchService.search(query);
        return NextResponse.json(result);
    } catch (e) {
        console.error("[GET /api/search]", e);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
