import { TalentsService } from "@/back/services/talents.service";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const talents = await TalentsService.findAll();
        return NextResponse.json({ talents });
    } catch {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
