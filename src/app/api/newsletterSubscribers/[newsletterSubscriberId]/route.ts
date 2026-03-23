import { NewsletterSubscribersService } from "@/back/services/newsletterSubscribers.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ subscriberId: string }> }
) {
    const { subscriberId } = await params;

    const subscriber = await NewsletterSubscribersService.findByIdSubscriber(subscriberId);

    if (!subscriber) {
        return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
    }

    return NextResponse.json({ subscriber });
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ subscriberId: string }> }
) {
    const { subscriberId } = await params;
    const data = await req.json();

    const subscriber = await NewsletterSubscribersService.findByIdSubscriber(subscriberId);

    if (!subscriber) {
        return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
    }

    const updatedSubscriber = await NewsletterSubscribersService.updateSubscriber(
        subscriberId,
        data
    );

    return NextResponse.json({ subscriber: updatedSubscriber });
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ subscriberId: string }> }
) {
    const { subscriberId } = await params;

    const subscriber = await NewsletterSubscribersService.findByIdSubscriber(subscriberId);

    if (!subscriber) {
        return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
    }

    await NewsletterSubscribersService.deleteSubscriber(subscriberId);

    return NextResponse.json({
        message: `Subscriber ${subscriberId} deleted`,
    });
}