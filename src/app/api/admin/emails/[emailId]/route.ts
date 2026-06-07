import { AdminEmailService } from "@/back/services/admin-email.service"
import { patchEmailSchema } from "@/back/schemas/zod/admin-email.zod"
import { NextRequest, NextResponse } from "next/server"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ emailId: string }> }) {
    try {
        const { emailId } = await params
        const email = await AdminEmailService.findById(emailId)
        if (!email) return NextResponse.json({ error: "Email introuvable" }, { status: 404 })
        return NextResponse.json({ email })
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ emailId: string }> }) {
    try {
        const { emailId } = await params
        const body = await req.json()
        const parsed = patchEmailSchema.safeParse(body)
        if (!parsed.success)
            return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 })

        const email = await AdminEmailService.patch(emailId, parsed.data)
        return NextResponse.json({ email })
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ emailId: string }> }) {
    try {
        const { emailId } = await params
        await AdminEmailService.delete(emailId)
        return NextResponse.json({ success: true })
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
