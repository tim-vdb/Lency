import { getUser } from "@/back/lib/auth-session";
import { SubscriptionsService } from "@/back/services/subscriptions.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const subscriptions = await SubscriptionsService.findAllSubscriptions();

    return NextResponse.json({ subscriptions });
}

export async function POST(req: NextRequest) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status, startedAt, endedAt } = await req.json();

    const newSubscription = await SubscriptionsService.createSubscription(user.id, {
        status,
        startedAt,
        endedAt,
    });

    return NextResponse.json({ subscription: newSubscription }, { status: 201 });
}