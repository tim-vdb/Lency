import { AdminEmailService } from "@/back/services/admin-email.service"
import { replyEmailSchema } from "@/back/schemas/zod/admin-email.zod"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest, { params }: { params: Promise<{ emailId: string }> }) {
    try {
        const { emailId } = await params
        const body = await req.json()
        const parsed = replyEmailSchema.safeParse(body)
        if (!parsed.success)
            return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 })

        const reply = await AdminEmailService.reply(emailId, parsed.data)
        return NextResponse.json({ reply }, { status: 201 })
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        if (error instanceof Error && error.message === "Email introuvable")
            return NextResponse.json({ error: error.message }, { status: 404 })
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
