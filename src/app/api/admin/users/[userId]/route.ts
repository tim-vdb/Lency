import { NextRequest, NextResponse } from "next/server"
import { AdminUsersService } from "@/back/services/admin-data.service"
import { Role } from "@/back/generated/prisma_client"

type Params = { params: Promise<{ userId: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
    try {
        const { userId } = await params
        const body = await req.json()
        if (typeof body.role !== "string") {
            return NextResponse.json({ error: "Champ invalide" }, { status: 400 })
        }
        const user = await AdminUsersService.updateRole(userId, body.role as Role)
        return NextResponse.json({ user })
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    try {
        const { userId } = await params
        await AdminUsersService.delete(userId)
        return NextResponse.json({ success: true })
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        if (error instanceof Error && error.message === "Cannot delete yourself")
            return NextResponse.json({ error: error.message }, { status: 400 })
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
