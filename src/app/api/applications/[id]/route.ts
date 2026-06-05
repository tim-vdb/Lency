import { getUser } from "@/back/lib/auth-session";
import { ProjectApplicationAction } from "@/back/repositories/project-applications.action";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        const application = await ProjectApplicationAction.findById(id);
        if (!application) return NextResponse.json({ error: "Not found" }, { status: 404 });

        // Seul le propriétaire du projet peut voir la candidature complète
        if (application.project.ownerId !== user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json({ application });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
