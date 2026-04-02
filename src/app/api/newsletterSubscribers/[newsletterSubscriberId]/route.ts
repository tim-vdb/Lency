import { NewsletterSubscribersService } from "@/back/services/newsletterSubscribers.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ subscriberId: string }> }
) {
    try {
        const { subscriberId } = await params;
        const data = await NewsletterSubscribersService.findByIdSubscriber(subscriberId);
        return NextResponse.json({ subscriber: data });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Subscriber not found") {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ subscriberId: string }> }
) {
    try {
        const { subscriberId } = await params;
        await NewsletterSubscribersService.deleteSubscriber(subscriberId);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if (error.message === "Subscriber not found") {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}