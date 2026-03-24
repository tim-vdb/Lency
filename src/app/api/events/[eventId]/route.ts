import { getUser } from "@/back/lib/auth-session";
import { EventsService } from "@/back/services/events.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
    const { eventId } = await params;

    const data = await EventsService.findByIdEvent(eventId);

    return NextResponse.json({ event: data });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
    const { eventId } = await params;
    const data = await req.json();

    const updatedEvent = await EventsService.updateEvent(eventId, data);
    return NextResponse.json({ event: updatedEvent });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
    const { eventId } = await params;

    await EventsService.deleteEvent(eventId);

    return NextResponse.json({message: `Event ${eventId} deleted`});
}