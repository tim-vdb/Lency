import { AdminEmailService } from "@/back/services/admin-email.service"
import { inboundEmailSchema } from "@/back/schemas/zod/admin-email.zod"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        // Resend wraps inbound data in { type, data }, Postmark sends flat object
        const payload = body?.data ?? body

        const parsed = inboundEmailSchema.safeParse(payload)
        if (!parsed.success) {
            console.error("[inbound] invalid payload:", JSON.stringify(parsed.error.issues, null, 2))
            return NextResponse.json({ error: "Payload invalide" }, { status: 400 })
        }

        const email = await AdminEmailService.receiveInbound(parsed.data)
        return NextResponse.json({ ok: true, emailId: email?.id ?? null })
    } catch (error) {
        console.error("[inbound] error:", error)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
