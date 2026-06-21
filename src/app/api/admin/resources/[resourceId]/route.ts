import { NextRequest, NextResponse } from "next/server"
import { AdminResourcesService } from "@/back/services/admin-data.service"

type Params = { params: Promise<{ resourceId: string }> }

export async function DELETE(_req: NextRequest, { params }: Params) {
    try {
        const { resourceId } = await params
        await AdminResourcesService.delete(resourceId)
        return NextResponse.json({ success: true })
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
