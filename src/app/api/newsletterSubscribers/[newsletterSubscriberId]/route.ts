import { NewsletterSubscribersService } from "@/back/services/newsletterSubscribers.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ subscriberId: string }> }) {
    const { subscriberId } = await params;

    const data = await NewsletterSubscribersService.findByIdSubscriber(subscriberId);

    return NextResponse.json({ subscriber: data });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ subscriberId: string }> }) {
    const { subscriberId } = await params;
    const data = await req.json();

    const updatedSubscriber = await NewsletterSubscribersService.updateSubscriber(
        subscriberId,
        data
    );
    return NextResponse.json({ subscriber: updatedSubscriber });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ subscriberId: string }> }) {
    const { subscriberId } = await params;

    await NewsletterSubscribersService.deleteSubscriber(subscriberId);

    return NextResponse.json({message: `Subscriber ${subscriberId} deleted`,});
}