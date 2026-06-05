import { NextRequest, NextResponse } from "next/server";
import { ProjectInvitationService } from "@/back/services/project-invitations.service";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ invitationId: string }> }
) {
    try {
        const { invitationId } = await params;
        const { action } = await req.json();

        if (action === "accept") {
            const inv = await ProjectInvitationService.accept(invitationId);
            return NextResponse.json({ invitation: inv });
        }
        if (action === "reject") {
            const inv = await ProjectInvitationService.reject(invitationId);
            return NextResponse.json({ invitation: inv });
        }

        return NextResponse.json({ error: "Action invalide" }, { status: 400 });
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
