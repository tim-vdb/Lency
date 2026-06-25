import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { AdminCategoriesService } from "@/back/services/admin-data.service"

type Params = { params: Promise<{ categoryId: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
    try {
        const { categoryId } = await params
        const body = await req.json()
        const category = await AdminCategoriesService.update(categoryId, {
            name: body.name,
            slug: body.slug,
            description: body.description,
        })
        return NextResponse.json({ category })
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")
            return NextResponse.json({ error: "Une communauté avec ce slug existe déjà" }, { status: 409 })
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
