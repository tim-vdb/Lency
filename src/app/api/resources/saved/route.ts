import { NextResponse } from "next/server";
import { ResourcesService } from "@/back/services/resources.service";

export async function GET() {
    try {
        const resources = await ResourcesService.findSavedResources();
        return NextResponse.json({ resources });
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
