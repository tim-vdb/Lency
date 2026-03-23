import { getUser } from "@/back/lib/auth-session";
import { EventsService } from "@/back/services/events.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ eventId: string }> }
) {
    const { eventId } = await params;

    const event = await EventsService.findByIdEvent(eventId);

    if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ event });
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ eventId: string }> }
) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId } = await params;
    const data = await req.json();

    const event = await EventsService.findByIdEvent(eventId);

    if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.userId !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedEvent = await EventsService.updateEvent(eventId, data);

    return NextResponse.json({ event: updatedEvent });
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ eventId: string }> }
) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId } = await params;

    const event = await EventsService.findByIdEvent(eventId);

    if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.userId !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await EventsService.deleteEvent(eventId);

    return NextResponse.json({
        message: `Event ${eventId} deleted`,
    });
}