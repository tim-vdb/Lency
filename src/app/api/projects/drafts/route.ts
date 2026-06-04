import { ProjectsService } from "@/back/services/projects.service";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const projects = await ProjectsService.findDrafts();
        return NextResponse.json({ projects });
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
