import { getUser } from "@/back/lib/auth-session";
import { EventsService } from "@/back/services/events.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const events = await EventsService.findAllEvents();

    return NextResponse.json({ events });
}

export async function POST(req: NextRequest) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, location, startDate, endDate, participants } =
        await req.json();

    const newEvent = await EventsService.createEvent(user.id, {
        title,
        description,
        location,
        startDate,
        endDate,
        participants,
    });

    return NextResponse.json({ event: newEvent }, { status: 201 });
}