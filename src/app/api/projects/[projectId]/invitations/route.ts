import { NextRequest, NextResponse } from "next/server";
import { ProjectInvitationService } from "@/back/services/project-invitations.service";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ projectId: string }> }
) {
    try {
        const { projectId } = await params;
        const invitations = await ProjectInvitationService.listForProject(projectId);
        return NextResponse.json({ invitations });
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ projectId: string }> }
) {
    try {
        const { projectId } = await params;
        const { userId } = await req.json();
        if (!userId) return NextResponse.json({ error: "userId requis" }, { status: 400 });

        const invitation = await ProjectInvitationService.send(projectId, userId);
        return NextResponse.json({ invitation }, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
            if (error.message === "Already invited") return NextResponse.json({ error: "Déjà invité" }, { status: 409 });
            if (error.message === "You are not the project owner") return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
