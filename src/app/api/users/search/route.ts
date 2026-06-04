import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/back/lib/prisma";
import { getUser } from "@/back/lib/auth-session";

export async function GET(req: NextRequest) {
    try {
        const currentUser = await getUser();
        if (!currentUser) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

        const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

        const users = await prisma.user.findMany({
            where: {
                readyToStart: true,
                id: { not: currentUser.id },
                ...(q && {
                    OR: [
                        { firstname: { contains: q, mode: "insensitive" } },
                        { lastname: { contains: q, mode: "insensitive" } },
                        { username: { contains: q, mode: "insensitive" } },
                    ],
                }),
            },
            select: {
                id: true,
                firstname: true,
                lastname: true,
                username: true,
                image: true,
                avatarUrl: true,
                bio: true,
                configs: {
                    where: { title: "roles" },
                    select: { content: true },
                    take: 1,
                },
            },
            take: 20,
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ users });
    } catch {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
