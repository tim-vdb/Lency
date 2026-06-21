import { NextResponse } from "next/server"
import { AdminUsersService } from "@/back/services/admin-data.service"

export async function GET() {
    try {
        const users = await AdminUsersService.findAll()
        return NextResponse.json({ users })
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
