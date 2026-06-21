import { UsersService } from "@/back/services/users.service";
import { sendPasswordChangedEmail } from "@/back/lib/send-password-changed-email";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ error: "Token manquant" }, { status: 400 });
        }

        const user = await UsersService.confirmPasswordChange(token);

        sendPasswordChangedEmail({
            email: user.email,
            firstName: user.firstname ?? null,
        }).catch((err) => {
            console.error("Failed to send password changed notification:", err);
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "TOKEN_INVALID_OR_EXPIRED") {
                return NextResponse.json({ error: "Lien expiré ou invalide" }, { status: 400 });
            }
            if (error.message === "NO_PENDING_PASSWORD") {
                return NextResponse.json({ error: "Aucun changement de mot de passe en attente" }, { status: 400 });
            }
        }
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
