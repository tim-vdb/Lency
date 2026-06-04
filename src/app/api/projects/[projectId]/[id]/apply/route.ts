import { NextRequest, NextResponse } from "next/server";
import { ProjectApplicationService } from "@/back/services/project-applications.service";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ projectId: string; id: string }> }
) {
    try {
        const { id } = await params;
        const application = await ProjectApplicationService.apply(id);
        return NextResponse.json(
            { application, message: "Application submitted successfully" },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized")
                return NextResponse.json({ error: "You must be logged in" }, { status: 401 });
            if (error.message === "Project not found")
                return NextResponse.json({ error: "Project not found" }, { status: 404 });
            if (error.message === "Already applied to this project")
                return NextResponse.json({ error: "You have already applied to this project" }, { status: 409 });
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
