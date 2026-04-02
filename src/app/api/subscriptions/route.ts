import { SubscriptionsService } from "@/back/services/subscriptions.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const subscriptions = await SubscriptionsService.findAllSubscriptions();
        return NextResponse.json({ subscriptions });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const newSubscription = await SubscriptionsService.createSubscription(data);
        return NextResponse.json({ subscription: newSubscription }, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if (error.message === "User already has an active subscription") {
                return NextResponse.json({ error: error.message }, { status: 409 });
            }
            if (error.message === "Start date is required" || error.message === "Start date must be before end date") {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}