import { getUser } from "@/back/lib/auth-session";
import prisma from "@/back/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const drafts = await prisma.post.findMany({
            where: { authorId: user.id, isPublished: false },
            include: { author: true, category: true },
            orderBy: { updatedAt: "desc" },
        });

        return NextResponse.json({ posts: drafts.map((p) => ({ ...p, isSaved: false, isVoted: false })) });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
