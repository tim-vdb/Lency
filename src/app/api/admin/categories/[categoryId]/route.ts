import { NextRequest, NextResponse } from "next/server"
import { AdminCategoriesService } from "@/back/services/admin-data.service"
import { Visibility } from "@/back/generated/prisma_client"

type Params = { params: Promise<{ categoryId: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
    try {
        const { categoryId } = await params
        const body = await req.json()
        const category = await AdminCategoriesService.update(categoryId, {
            name: body.name,
            slug: body.slug,
            description: body.description,
            visibility: body.visibility as Visibility | undefined,
            isNSFW: body.isNSFW,
        })
        return NextResponse.json({ category })
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    try {
        const { categoryId } = await params
        await AdminCategoriesService.delete(categoryId)
        return NextResponse.json({ success: true })
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
