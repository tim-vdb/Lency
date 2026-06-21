import { NextResponse } from "next/server"
import { AdminPostsService } from "@/back/services/admin-data.service"

export async function GET() {
    try {
        const posts = await AdminPostsService.findAll()
        return NextResponse.json({ posts })
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
