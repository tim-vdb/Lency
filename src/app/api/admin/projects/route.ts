import { NextResponse } from "next/server"
import { AdminProjectsService } from "@/back/services/admin-data.service"

export async function GET() {
    try {
        const projects = await AdminProjectsService.findAll()
        return NextResponse.json({ projects })
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
