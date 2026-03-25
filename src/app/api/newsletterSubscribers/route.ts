import { NewsletterSubscribersService } from "@/back/services/newsletterSubscribers.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const subscribers = await NewsletterSubscribersService.findAllSubscribers();

    return NextResponse.json({ subscribers });
}

export async function POST(req: NextRequest) {
    const { email, userId } = await req.json();

    const newSubscriber = await NewsletterSubscribersService.createSubscriber({
        email,
        userId,
    });

    return NextResponse.json({ subscriber: newSubscriber }, { status: 201 });
}