import { getUser } from "@/back/lib/auth-session"
import { mkdir, writeFile } from "fs/promises"
import { NextRequest, NextResponse } from "next/server"
import path from "path"

const ALLOWED_TYPES = [
    "image/jpeg", "image/png", "image/webp", "image/gif",
    "video/mp4", "video/webm", "video/ogg",
    "audio/mpeg", "audio/ogg", "audio/wav", "audio/webm",
]
const MAX_SIZE = 50 * 1024 * 1024 // 50 MB

export async function POST(req: NextRequest) {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 })
    if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ error: "Type de fichier non supporté" }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: "Fichier trop volumineux (max 50 Mo)" }, { status: 400 })
    }

    const ext = path.extname(file.name) || `.${file.type.split("/")[1]}`
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
    const uploadDir = path.join(process.cwd(), "public", "uploads", "posts")

    await mkdir(uploadDir, { recursive: true })
    await writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()))

    return NextResponse.json({ url: `/uploads/posts/${filename}` })
}
