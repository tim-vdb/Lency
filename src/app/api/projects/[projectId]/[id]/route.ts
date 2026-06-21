import { NextRequest, NextResponse } from "next/server";
import { ProjectsService } from "@/back/services/projects.service";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ projectId: string; id: string }> }
) {
    try {
        const { id } = await params;
        const project = await ProjectsService.findByIdProject(id);
        return NextResponse.json({ project });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Project not found")
                return NextResponse.json({ error: "Project not found" }, { status: 404 });
            if (error.message === "Forbidden")
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
