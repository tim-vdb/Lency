import { NextRequest, NextResponse } from "next/server";
import { UsersService } from "@/back/services/users.service";

export async function GET(req: NextRequest) {
    try {
        const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
        const users = await UsersService.search(q);
        return NextResponse.json({ users });
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
