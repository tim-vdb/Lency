import { NextRequest, NextResponse } from "next/server"
import { AdminPostsService } from "@/back/services/admin-data.service"

type Params = { params: Promise<{ postId: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
    try {
        const { postId } = await params
        const body = await req.json()
        let post
        if (typeof body.isPublished === "boolean") {
            post = await AdminPostsService.updatePublished(postId, body.isPublished)
        } else if (typeof body.isLocked === "boolean") {
            post = await AdminPostsService.updateLocked(postId, body.isLocked)
        } else {
            return NextResponse.json({ error: "Champ invalide" }, { status: 400 })
        }
        return NextResponse.json({ post })
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    try {
        const { postId } = await params
        await AdminPostsService.delete(postId)
        return NextResponse.json({ success: true })
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
