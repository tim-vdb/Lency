import { NextRequest, NextResponse } from "next/server"
import { AdminCategoriesService } from "@/back/services/admin-data.service"

export async function GET() {
    try {
        const categories = await AdminCategoriesService.findAll()
        return NextResponse.json({ categories })
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        if (!body.name || !body.slug) {
            return NextResponse.json({ error: "Nom et slug requis" }, { status: 400 })
        }
        const category = await AdminCategoriesService.create({
            name: body.name,
            slug: body.slug,
            description: body.description,
        })
        return NextResponse.json({ category }, { status: 201 })
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
