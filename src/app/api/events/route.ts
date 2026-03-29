import { EventsService } from "@/back/services/events.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const events = await EventsService.findAllEvents();
        return NextResponse.json({ events });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const newEvent = await EventsService.createEvent(data);
        return NextResponse.json({ event: newEvent }, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if ([
                "Title is required",
                "Description is required",
                "Start date is required",
                "End date is required",
                "Start date must be before end date",
                 "Event type is required",
            ].includes(error.message)) {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}