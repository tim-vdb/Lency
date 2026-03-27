import { EventsService } from "@/back/services/events.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const { eventId } = await params;
        const data = await EventsService.findByIdEvent(eventId);
        return NextResponse.json({ event: data });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Event not found") {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const { eventId } = await params;
        const data = await req.json();
        const updatedEvent = await EventsService.updateEvent(eventId, data);
        return NextResponse.json({ event: updatedEvent });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if (error.message === "Event not found") {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
            if (error.message === "No data to update") {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
            if (error.message === "Start date must be before end date") {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const { eventId } = await params;
        await EventsService.deleteEvent(eventId);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if (error.message === "Event not found") {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}