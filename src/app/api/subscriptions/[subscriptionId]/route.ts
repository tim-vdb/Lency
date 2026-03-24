import { SubscriptionsService } from "@/back/services/subscriptions.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ subscriptionId: string }> }) {
    const { subscriptionId } = await params;

    const data = await SubscriptionsService.findByIdSubscription(subscriptionId);

    return NextResponse.json({ subscription: data });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ subscriptionId: string }> }) {
    const { subscriptionId } = await params;
    const data = await req.json();

    const updatedSubscription = await SubscriptionsService.updateSubscription(subscriptionId, data);
    return NextResponse.json({ subscription: updatedSubscription });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ subscriptionId: string }> }) {
    const { subscriptionId } = await params;

    await SubscriptionsService.deleteSubscription(subscriptionId);

    return NextResponse.json({message: `Subscription ${subscriptionId} deleted`,});
}