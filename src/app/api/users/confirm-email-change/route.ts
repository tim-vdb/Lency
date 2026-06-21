import { UsersService } from "@/back/services/users.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ error: "Token manquant" }, { status: 400 });
        }

        await UsersService.confirmEmailChange(token);

        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "TOKEN_INVALID_OR_EXPIRED" || error.message === "TOKEN_EXPIRED") {
                return NextResponse.json({ error: "Lien expiré ou invalide" }, { status: 400 });
            }
            if (error.message === "NO_PENDING_EMAIL") {
                return NextResponse.json({ error: "Aucun changement d'email en attente" }, { status: 400 });
            }
        }
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
