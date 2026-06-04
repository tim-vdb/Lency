import { NextRequest, NextResponse } from "next/server";
import { ProjectApplicationService } from "@/back/services/project-applications.service";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ projectId: string; id: string }> }
) {
    try {
        const { id } = await params;
        const applications = await ProjectApplicationService.getProjectApplications(id);
        return NextResponse.json({ applications }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized")
                return NextResponse.json({ error: "You must be logged in" }, { status: 401 });
            if (error.message === "You are not the project owner")
                return NextResponse.json({ error: "You are not authorized to view these applications" }, { status: 403 });
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
