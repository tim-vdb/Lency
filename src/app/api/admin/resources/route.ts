import { NextResponse } from "next/server"
import { AdminResourcesService } from "@/back/services/admin-data.service"

export async function GET() {
    try {
        const resources = await AdminResourcesService.findAll()
        return NextResponse.json({ resources })
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
