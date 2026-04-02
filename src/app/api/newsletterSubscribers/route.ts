import { NewsletterSubscribersService } from "@/back/services/newsletterSubscribers.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const subscribers = await NewsletterSubscribersService.findAllSubscribers();
        return NextResponse.json({ subscribers });
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
        const newSubscriber = await NewsletterSubscribersService.createSubscriber(data);
        return NextResponse.json({ subscriber: newSubscriber }, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Email is required") {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
            if (error.message === "Email already subscribed") {
                return NextResponse.json({ error: error.message }, { status: 409 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}