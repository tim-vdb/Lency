import { NextRequest, NextResponse } from "next/server"
import { AdminProjectsService } from "@/back/services/admin-data.service"
import { ProjectStatus, Visibility } from "@/back/generated/prisma_client"

type Params = { params: Promise<{ projectId: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
    try {
        const { projectId } = await params
        const body = await req.json()
        let project
        if (typeof body.status === "string") {
            project = await AdminProjectsService.updateStatus(projectId, body.status as ProjectStatus)
        } else if (typeof body.visibility === "string") {
            project = await AdminProjectsService.updateVisibility(projectId, body.visibility as Visibility)
        } else {
            return NextResponse.json({ error: "Champ invalide" }, { status: 400 })
        }
        return NextResponse.json({ project })
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    try {
        const { projectId } = await params
        await AdminProjectsService.delete(projectId)
        return NextResponse.json({ success: true })
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
