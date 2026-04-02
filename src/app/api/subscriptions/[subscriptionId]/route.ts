import { SubscriptionsService } from "@/back/services/subscriptions.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ subscriptionId: string }> }
) {
    try {
        const { subscriptionId } = await params;
        const data = await SubscriptionsService.findByIdSubscription(subscriptionId);
        return NextResponse.json({ subscription: data });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Subscription not found") {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ subscriptionId: string }> }
) {
    try {
        const { subscriptionId } = await params;
        const data = await req.json();
        const updatedSubscription = await SubscriptionsService.updateSubscription(subscriptionId, data);
        return NextResponse.json({ subscription: updatedSubscription });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if (error.message === "Subscription not found") {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
            if (error.message === "No data to update") {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ subscriptionId: string }> }
) {
    try {
        const { subscriptionId } = await params;
        await SubscriptionsService.deleteSubscription(subscriptionId);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if (error.message === "Subscription not found") {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}