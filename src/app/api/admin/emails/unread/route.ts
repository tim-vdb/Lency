import { AdminEmailService } from "@/back/services/admin-email.service"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const counts = await AdminEmailService.countUnread()
        return NextResponse.json(counts)
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
