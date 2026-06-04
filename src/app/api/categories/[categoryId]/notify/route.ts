import { getUser } from "@/back/lib/auth-session";
import { CategoryNotificationsAction } from "@/back/repositories/category-notifications.action";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ categoryId: string }> }) {
    try {
        const user = await getUser();
        if (!user) return NextResponse.json({ subscribed: false });
        const { categoryId } = await params;
        const sub = await CategoryNotificationsAction.isSubscribed(user.id, categoryId);
        return NextResponse.json({ subscribed: !!sub });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(_req: NextRequest, { params }: { params: Promise<{ categoryId: string }> }) {
    try {
        const user = await getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const { categoryId } = await params;
        const existing = await CategoryNotificationsAction.isSubscribed(user.id, categoryId);
        if (existing) {
            await CategoryNotificationsAction.unsubscribe(user.id, categoryId);
            return NextResponse.json({ subscribed: false });
        }
        await CategoryNotificationsAction.subscribe(user.id, categoryId);
        return NextResponse.json({ subscribed: true });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
