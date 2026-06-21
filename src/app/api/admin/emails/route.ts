import { AdminEmailService } from "@/back/services/admin-email.service"
import { sendEmailSchema } from "@/back/schemas/zod/admin-email.zod"
import { AdminEmailBox } from "@/back/generated/prisma_client"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const box = searchParams.get("box") as AdminEmailBox | null
        const emails = await AdminEmailService.findAll(box ?? undefined)
        return NextResponse.json({ emails })
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const parsed = sendEmailSchema.safeParse(body)
        if (!parsed.success)
            return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 })

        const email = await AdminEmailService.send(parsed.data)
        return NextResponse.json({ email }, { status: 201 })
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
