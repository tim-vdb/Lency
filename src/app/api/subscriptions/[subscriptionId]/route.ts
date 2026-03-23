import { getUser } from "@/back/lib/auth-session";
import { SubscriptionsService } from "@/back/services/subscriptions.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ subscriptionId: string }> }
) {
    const { subscriptionId } = await params;

    const subscription = await SubscriptionsService.findByIdSubscription(subscriptionId);

    if (!subscription) {
        return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    return NextResponse.json({ subscription });
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ subscriptionId: string }> }
) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subscriptionId } = await params;
    const data = await req.json();

    const subscription = await SubscriptionsService.findByIdSubscription(subscriptionId);

    if (!subscription) {
        return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    if (subscription.userId !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await SubscriptionsService.updateSubscription(subscriptionId, data);

    return NextResponse.json({ subscription: updated });
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ subscriptionId: string }> }
) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subscriptionId } = await params;

    const subscription = await SubscriptionsService.findByIdSubscription(subscriptionId);

    if (!subscription) {
        return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    if (subscription.userId !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await SubscriptionsService.deleteSubscription(subscriptionId);

    return NextResponse.json({
        message: `Subscription ${subscriptionId} deleted`,
    });
}