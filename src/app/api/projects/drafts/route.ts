import { getUser } from "@/back/lib/auth-session";
import prisma from "@/back/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const drafts = await prisma.project.findMany({
            where: { ownerId: user.id, status: "DRAFT" },
            include: { owner: true, participants: true, mapLocation: true },
            orderBy: { updatedAt: "desc" },
        });

        return NextResponse.json({ projects: drafts });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
